import { getTokenTypeByToken } from "./getTokenTypeByToken";
import { flattenInlineTokens } from "./flattenInlineTokens";
import { renderInlineAsText } from "./renderInlineAsText";
import Token from "markdown-it/lib/token";

export function cleanupTokens(tokens: Token[]) {
  tokens = flattenInlineTokens(tokens);
  tokens.forEach((token) => {
    token.type = getTokenTypeByToken(token);

    // set image and hardbreak to block elements
    if (token.type === "image" || token.type === "hardbreak") {
      token.block = true;
    }

    // Set img alt text
    if (token.type === "image") {
      const altText = renderInlineAsText(token.children);
      if (token.attrs) {
        const altIndex = token.attrIndex("alt");
        if (altIndex !== -1 && token.attrs[altIndex]) {
          token.attrs[altIndex][1] = altText;
        } else {
          token.attrs.push(["alt", altText]);
        }
      } else {
        token.attrs = [["alt", altText]];
      }
    }
  });

  /**
   * changing a link token to a blocklink to fix issue where link tokens with
   * nested non text tokens breaks component
   */
  const stack: Token[] = [];
  tokens = tokens.reduce<Token[]>((acc, token) => {
    if (token.type === "link" && token.nesting === 1) {
      stack.push(token);
    } else if (
      stack.length > 0 &&
      token.type === "link" &&
      token.nesting === -1
    ) {
      if (stack.some((stackToken) => stackToken.block)) {
        if (stack[0]) {
          stack[0].type = "blocklink";
          stack[0].block = true;
        }
        token.type = "blocklink";
        token.block = true;
      }

      stack.push(token);

      acc.push(...stack);
      stack.length = 0; // clear the stack
    } else if (stack.length > 0) {
      stack.push(token);
    } else {
      acc.push(token);
    }

    return acc;
  }, []);

  return tokens;
}
