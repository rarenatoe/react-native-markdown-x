import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import type { AstNodeType } from "./AstNodeType";

export type FlattenedStyleMap = Partial<
  {
    [K in AstNodeType]: K extends "image"
      ? ImageStyle
      : K extends
            | "heading1"
            | "heading2"
            | "heading3"
            | "heading4"
            | "heading5"
            | "heading6"
            | "strong"
            | "em"
            | "s"
            | "code_inline"
            | "code_block"
            | "fence"
            | "link"
            | "blocklink"
            | "text"
            | "textgroup"
            | "hardbreak"
            | "softbreak"
            | "span"
            | "inline"
        ? TextStyle
        : ViewStyle;
  } & {
    // List item sub-components for bullet lists
    list_item_bullet_marker: TextStyle;
    list_item_bullet_content: ViewStyle;
    // List item sub-components for ordered lists
    list_item_ordered_marker: TextStyle;
    list_item_ordered_content: ViewStyle;
  }
> &
  Record<string, TextStyle | ViewStyle | ImageStyle>;

export type StyleMap = {
  [K in keyof FlattenedStyleMap]: StyleProp<FlattenedStyleMap[K]>;
};
