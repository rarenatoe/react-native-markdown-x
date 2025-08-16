import Token from "markdown-it/lib/token";

export function renderInlineAsText(tokens: Token["children"]) {
  if (!tokens) return "";

  let result = "";

  for (const token of tokens) {
    if (token.type === "text") {
      result += token.content;
    } else if (token.type === "image") {
      result += renderInlineAsText(token.children);
    }
  }

  return result;
}
