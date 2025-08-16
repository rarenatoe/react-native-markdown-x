import MarkdownIt from "markdown-it";

export function stringToTokens(source: string, md: MarkdownIt) {
  try {
    return md.parse(source, {});
  } catch (err) {
    console.warn(err);
  }

  return [];
}
