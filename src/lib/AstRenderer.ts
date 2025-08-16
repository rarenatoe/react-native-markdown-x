import type { ComponentType, JSX, ReactNode } from "react";
import {
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  convertAdditionalStyles,
  generateUniqueKey,
  getTextOnlyStyle,
} from "./util";
import type {
  AstNode,
  FlattenedStyleMap,
  StyleMap,
  RenderFunctionMap,
  RenderFunction,
} from "../types";
import {
  DEFAULT_RENDER_FUNCTIONS,
  DEFAULT_STYLES,
  type TextOnlyStyle,
} from "./data";
import { logWarning } from "../util/logger";

const getStyle = (
  styles: StyleMap | undefined,
  useDefaultStyles: boolean,
): FlattenedStyleMap => {
  if (!styles) return useDefaultStyles ? DEFAULT_STYLES : {};

  const flattened = Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [
      key,
      StyleSheet.flatten(value),
    ]),
  ) as FlattenedStyleMap;

  if (!useDefaultStyles) return flattened;

  return Object.fromEntries(
    Object.entries(DEFAULT_STYLES).map(([key, value]) => [
      key,
      { ...value, ...flattened[key] },
    ]),
  );
};

interface AstRendererProps {
  renderFunctions?: RenderFunctionMap;
  styles?: StyleMap;
  onLinkPress?: (url: string) => void;
  maxTopLevelChildren?: number;
  topLevelExceededComponent: JSX.Element;
  allowedImageHandlers?: string[];
  defaultImageHandler?: string;
  debugPrintTree?: boolean;
  textComponent?: React.ComponentType<TextProps>;
  /**
   * Whether to include default render functions (default: true)
   * When true, provided renderFunctions are merged with defaults
   * When false, only provided renderFunctions are used
   */
  useDefaultRenderFunctions?: boolean;
  /**
   * Whether to include default styles (default: true)
   * When true, provided styles are merged with defaults
   * When false, only provided styles are used
   */
  useDefaultStyles?: boolean;
}

export default class AstRenderer {
  private _renderFunctions: RenderFunctionMap;
  private _styles: FlattenedStyleMap;
  private _debugPrintTree: boolean;
  private _onLinkPress?: (url: string) => void;
  private _maxTopLevelChildren?: number;
  private _topLevelExceededComponent: JSX.Element;
  private _allowedImageHandlers?: string[];
  private _defaultImageHandler?: string;
  private _textComponent: ComponentType<TextProps>;

  constructor({
    renderFunctions = {},
    styles,
    onLinkPress,
    maxTopLevelChildren,
    topLevelExceededComponent,
    allowedImageHandlers,
    defaultImageHandler,
    debugPrintTree = false,
    textComponent = Text,
    useDefaultRenderFunctions = true,
    useDefaultStyles = true,
  }: AstRendererProps) {
    this._renderFunctions = useDefaultRenderFunctions
      ? {
          ...DEFAULT_RENDER_FUNCTIONS,
          ...renderFunctions,
        }
      : renderFunctions;

    this._styles = StyleSheet.create(getStyle(styles, useDefaultStyles));

    this._onLinkPress = onLinkPress;
    this._maxTopLevelChildren = maxTopLevelChildren;
    this._topLevelExceededComponent = topLevelExceededComponent;
    this._allowedImageHandlers = allowedImageHandlers;
    this._defaultImageHandler = defaultImageHandler;
    this._debugPrintTree = debugPrintTree;
    this._textComponent = textComponent;
  }

  getRenderFunction = (type: string): RenderFunction => {
    const renderFunction = this._renderFunctions[type];
    if (renderFunction) return renderFunction;

    logWarning(
      `Unknown node type encountered: ${type}. Nothing will be rendered. Please be sure to provide a rule if you intend to render this node.`,
    );
    return () => null;
  };

  renderNode = (
    node: AstNode,
    parentNodes: AstNode[],
    isRoot = false,
  ): ReactNode => {
    const parents = [...parentNodes];

    if (this._debugPrintTree) {
      const level = "-".repeat(parents.length);
      console.log(`${level}${node.type}`);
    }

    parents.unshift(node);

    // calculate the children first
    let children = node.children.map((value) => {
      return this.renderNode(value, parents);
    });

    // We are at the bottom of some tree - grab all the parent styles
    // this effectively grabs the styles from parents and
    // applies them in order of priority parent (least) to child (most)
    // to allow styling global, then lower down things individually

    // we have to handle list_item seperately here because they have some child
    // pseudo classes that need the additional style props from parents passed down to them
    let inheritedStyles: TextOnlyStyle | undefined;

    if (children.length === 0 || node.type === "list_item") {
      for (let a = parentNodes.length - 1; a > -1; a--) {
        // grab and additional attributes specified by markdown-it
        let refStyle: TextStyle | ViewStyle | ImageStyle = {};

        const currentParentNode = parentNodes[a];

        if (typeof currentParentNode?.attributes.style === "string") {
          refStyle = convertAdditionalStyles(
            currentParentNode.attributes.style,
          );
        }

        // combine in specific styles for the object
        if (currentParentNode && this._styles[currentParentNode.type]) {
          refStyle = {
            ...refStyle,
            ...StyleSheet.flatten(this._styles[currentParentNode.type]),
          };

          // workaround for list_items and their content cascading down the tree
          if (currentParentNode.type === "list_item") {
            let contentStyle: StyleProp<ViewStyle> = {};

            if (parentNodes[a + 1]?.type === "bullet_list") {
              contentStyle = this._styles.list_item_bullet_content;
            } else if (parentNodes[a + 1]?.type === "ordered_list") {
              contentStyle = this._styles.list_item_ordered_content;
            }

            refStyle = {
              ...refStyle,
              ...StyleSheet.flatten(contentStyle),
            };
          }
        }

        inheritedStyles = { ...inheritedStyles, ...getTextOnlyStyle(refStyle) };
      }
    }

    // cull top level children

    if (
      isRoot &&
      this._maxTopLevelChildren &&
      children.length > this._maxTopLevelChildren
    ) {
      children = children.slice(0, this._maxTopLevelChildren);
      children.push(this._topLevelExceededComponent);
    }

    const renderFunction: RenderFunction = this.getRenderFunction(node.type);

    return renderFunction({
      node,
      children,
      parents: parentNodes,
      styles: this._styles,
      onLinkPress: this._onLinkPress,
      Text: this._textComponent,
      allowedImageHandlers: this._allowedImageHandlers,
      defaultImageHandler: this._defaultImageHandler,
      inheritedStyles,
    });
  };

  render = (nodes: AstNode[]) => {
    const root: AstNode = {
      type: "body",
      key: generateUniqueKey(),
      children: nodes,
      index: 0,
      block: false,
      attributes: {},
    };
    return this.renderNode(root, [], true);
  };
}
