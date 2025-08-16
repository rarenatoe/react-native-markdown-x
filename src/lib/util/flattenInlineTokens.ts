import Token from "markdown-it/lib/token";

export function flattenInlineTokens(tokens: Token[]) {
  return tokens.reduce<Token[]>((acc, curr) => {
    if (curr.type === "inline" && curr.children && curr.children.length > 0) {
      acc.push(...flattenInlineTokens(curr.children));
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
}
