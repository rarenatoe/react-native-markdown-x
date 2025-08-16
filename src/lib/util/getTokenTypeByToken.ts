import Token from "markdown-it/lib/token";
import type { AstNodeType } from "../../types";

/**
 * Extracts the AST node type from a markdown-it token
 *
 * @param token - The markdown-it token to process
 * @returns The corresponding AST node type or "unknown" if not recognized
 *
 * @example
 * // For a heading token:
 * {
 *   "type": "heading_open",
 *   "tag": "h1",
 *   // ... other token properties
 * }
 * // Returns: "heading1"
 */
export function getTokenTypeByToken(token: Token): AstNodeType {
  const cleanedType = token.type.replace(/_(?:open|close)$/, "");

  return cleanedType === "heading"
    ? (`heading${token.tag.slice(1)}` as AstNodeType)
    : (cleanedType as AstNodeType);
}
