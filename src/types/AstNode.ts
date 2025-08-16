export interface BaseAttributes {
  style?: unknown;
}

interface BaseNode<T extends BaseAttributes> {
  type: string;
  sourceType?: string;
  sourceInfo?: string;
  sourceMeta?: unknown;
  block: boolean;
  key: string;
  content?: string;
  markup?: string;
  tokenIndex?: number;
  index: number;
  children: AstNode[];
  attributes: T; // Use the generic type here
}

export interface LinkAttributes extends BaseAttributes {
  href: string;
}

export interface LinkNode extends BaseNode<LinkAttributes> {
  type: "link";
}

export interface OrderedListAttributes extends BaseAttributes {
  start?: number;
}

export interface OrderedListNode extends BaseNode<OrderedListAttributes> {
  type: "ordered_list";
}

export interface ImageAttributes extends BaseAttributes {
  src: string;
  alt: string;
}

export interface ImageNode extends BaseNode<ImageAttributes> {
  type: "image";
}

// Define the type for all other nodes that don't have a required href
export interface OtherNode extends BaseNode<BaseAttributes> {
  type: Exclude<string, "link" | "ordered_list" | "image">;
}

export type AstNode = OtherNode | LinkNode | ImageNode | OrderedListNode;
