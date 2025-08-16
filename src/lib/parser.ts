import type { ReactNode } from "react";
import MarkdownIt from "markdown-it";

import {
  tokensToAST,
  stringToTokens,
  cleanupTokens,
  groupTextTokens,
  omitListItemParagraph,
} from "./util";
import type { AstNode } from "../types";

export default function parser(
  source: string | AstNode[],
  renderer: (nodes: AstNode[]) => ReactNode,
  markdownIt: MarkdownIt,
) {
  if (Array.isArray(source)) {
    return renderer(source);
  }

  let tokens = stringToTokens(source, markdownIt);
  tokens = cleanupTokens(tokens);
  tokens = groupTextTokens(tokens);
  tokens = omitListItemParagraph(tokens);
  const astTree = tokensToAST(tokens);
  console.log({ astTree });
  return renderer(astTree);
}
