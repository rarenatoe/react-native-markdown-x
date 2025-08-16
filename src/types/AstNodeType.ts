export type AstNodeType =
  // The main container
  | "body"
  // Headings
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  // Horizontal Rule
  | "hr"
  // Emphasis
  | "strong"
  | "em"
  | "s"
  // Blockquotes
  | "blockquote"
  // Lists
  | "bullet_list"
  | "ordered_list"
  | "list_item"
  // Code
  | "code_inline"
  | "code_block"
  | "fence"
  // Tables
  | "table"
  | "thead"
  | "tbody"
  | "th"
  | "tr"
  | "td"
  // Links
  | "link"
  | "blocklink"
  // Images
  | "image"
  // Text Output
  | "text"
  | "textgroup"
  | "paragraph"
  | "hardbreak"
  | "softbreak"
  // Believe these are never used but retained for completeness
  | "pre"
  | "inline"
  | "span";
