import { type JSX, memo, useMemo, type ComponentType } from "react";
import { Text, type TextStyle } from "react-native";
import parser from "../lib/parser";
import AstRenderer from "../lib/AstRenderer";
import MarkdownIt from "markdown-it";
import type { AstNode, RenderFunctionMap, StyleMap } from "../types";
import { logWarning } from "../util/logger";

type MarkdownProps = {
  textComponent?: ComponentType<TextStyle>;
  children: string | AstNode[];
  markdownit?: MarkdownIt;
  onLinkPress?: (url: string) => void;
  maxTopLevelChildren?: number;
  topLevelExceededComponent?: JSX.Element;
  allowedImageHandlers?: string[];
  defaultImageHandler?: string;
  debugPrintTree?: boolean;
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
} & (
  | {
      renderer?: AstRenderer;
      renderFunctions?: never;
      styles?: never;
      useDefaultRenderFunctions?: never;
      useDefaultStyles?: never;
    }
  | {
      renderer?: never;
      renderFunctions?: RenderFunctionMap;
      styles?: StyleMap;
      useDefaultRenderFunctions?: boolean;
      useDefaultStyles?: boolean;
    }
);

const Markdown = memo(
  ({
    children,
    textComponent = Text,
    renderer,
    renderFunctions,
    styles,
    markdownit = MarkdownIt({
      typographer: true,
    }),
    onLinkPress,
    maxTopLevelChildren,
    topLevelExceededComponent = <Text key="dotdotdot">...</Text>,
    allowedImageHandlers = [
      "data:image/png;base64",
      "data:image/gif;base64",
      "data:image/jpeg;base64",
      "https://",
      "http://",
    ],
    defaultImageHandler = "https://",
    debugPrintTree = false,
    useDefaultRenderFunctions = true,
    useDefaultStyles = true,
  }: MarkdownProps) => {
    const momoizedRenderer = useMemo(() => {
      if (renderer) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (renderFunctions) {
          logWarning(
            "You are using renderer and renderFunctions at the same time. This is not possible, props.renderFunctions will be ignored.",
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (styles) {
          logWarning(
            "You are using renderer and styles at the same time. This is not possible, props.styles will be ignored.",
          );
        }

        if (renderer instanceof AstRenderer) {
          return renderer;
        }

        throw new Error(
          "[react-native-markdown-x] Provided renderer is not an AstRenderer. Please use an instance of AstRenderer.",
        );
      }

      return new AstRenderer({
        textComponent,
        renderFunctions,
        styles,
        onLinkPress,
        maxTopLevelChildren,
        topLevelExceededComponent,
        allowedImageHandlers,
        defaultImageHandler,
        debugPrintTree,
        useDefaultRenderFunctions,
        useDefaultStyles,
      });
    }, [
      renderer,
      renderFunctions,
      styles,
      textComponent,
      onLinkPress,
      maxTopLevelChildren,
      topLevelExceededComponent,
      allowedImageHandlers,
      defaultImageHandler,
      debugPrintTree,
      useDefaultRenderFunctions,
      useDefaultStyles,
    ]);

    const momoizedParser = useMemo(() => markdownit, [markdownit]);

    return parser(children, momoizedRenderer.render, momoizedParser);
  },
);

export default Markdown;
