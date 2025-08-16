import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import type { AstNode } from "./AstNode";
import type { TextProps } from "react-native";
import type { FlattenedStyleMap } from "./StyleMap";
import type { AstNodeType } from "./AstNodeType";
import type { TextOnlyStyle } from "../lib/data";

type BaseRenderProps<T extends AstNode = AstNode> = PropsWithChildren<{
  node: T;
  parents: AstNode[];
  inheritedStyles?: TextOnlyStyle;
  Text: ComponentType<TextProps>;
  onLinkPress?: (url: string) => void;
  allowedImageHandlers?: string[];
  defaultImageHandler?: string;
  styles: FlattenedStyleMap;
}>;

export type RenderFunction<T extends AstNode = AstNode> = (
  props: BaseRenderProps<T>,
) => ReactNode;

export type KnownTypeRenderFunctionMap = Record<AstNodeType, RenderFunction>;

export type RenderFunctionMap = Partial<KnownTypeRenderFunctionMap> &
  Record<string, RenderFunction>;
