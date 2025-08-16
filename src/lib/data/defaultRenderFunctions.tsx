import { Pressable, View, Platform } from "react-native";
import FitImage from "react-native-fit-image";
import { hasParents, openUrl } from "../util";
import type { KnownTypeRenderFunctionMap } from "../../types";
import type {
  AstNode,
  LinkNode,
  ImageNode,
  OrderedListNode,
} from "../../types/AstNode";

// Helper for finding ordered list parent
const findOrderedListParent = (parents: AstNode[]): OrderedListNode | undefined =>
  parents.find((p): p is OrderedListNode => p.type === "ordered_list");

export const DEFAULT_RENDER_FUNCTIONS: KnownTypeRenderFunctionMap = {
  // The main container
  body: ({ node, children, styles }) => (
    <View key={node.key} style={styles.body}>
      {children}
    </View>
  ),
  // Headings
  heading1: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading1}>
      {children}
    </View>
  ),
  heading2: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading2}>
      {children}
    </View>
  ),
  heading3: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading3}>
      {children}
    </View>
  ),
  heading4: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading4}>
      {children}
    </View>
  ),
  heading5: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading5}>
      {children}
    </View>
  ),
  heading6: ({ node, children, styles }) => (
    <View key={node.key} style={styles.heading6}>
      {children}
    </View>
  ),
  // Horizontal Rule
  hr: ({ node, styles }) => <View key={node.key} style={styles.hr} />,
  // Emphasis
  strong: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.strong}>
      {children}
    </Text>
  ),
  em: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.em}>
      {children}
    </Text>
  ),
  s: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.s}>
      {children}
    </Text>
  ),
  // Blockquotes
  blockquote: ({ node, children, styles }) => (
    <View key={node.key} style={styles.blockquote}>
      {children}
    </View>
  ),
  // Lists
  bullet_list: ({ node, children, styles }) => (
    <View key={node.key} style={styles.bullet_list}>
      {children}
    </View>
  ),
  ordered_list: ({ node, children, styles }) => (
    <View key={node.key} style={styles.ordered_list}>
      {children}
    </View>
  ),
  list_item: ({
    Text,
    node,
    children,
    parents,
    styles,
    inheritedStyles = {},
  }) => {
    if (hasParents(parents, "bullet_list")) {
      return (
        <View key={node.key} style={styles.list_item}>
          <Text
            style={[inheritedStyles, styles.list_item_bullet_marker]}
            accessible={false}
          >
            {Platform.select({
              android: "\u2022",
              ios: "\u00B7",
              default: "\u2022",
            })}
          </Text>
          <View style={styles.list_item_bullet_content}>{children}</View>
        </View>
      );
    }

    if (hasParents(parents, "ordered_list")) {
      const orderedListParent = findOrderedListParent(parents);

      const listItemNumber =
        (orderedListParent?.attributes.start ?? 1) + node.index;

      return (
        <View key={node.key} style={styles.list_item}>
          <Text style={[inheritedStyles, styles.list_item_ordered_marker]}>
            {listItemNumber}
            {node.markup}
          </Text>
          <View style={styles.list_item_ordered_content}>{children}</View>
        </View>
      );
    }

    // we should not need this, but just in case
    return (
      <View key={node.key} style={styles.list_item}>
        {children}
      </View>
    );
  },
  // Code
  code_inline: ({ Text, node, styles, inheritedStyles = {} }) => (
    <Text key={node.key} style={[inheritedStyles, styles.code_inline]}>
      {node.content}
    </Text>
  ),
  code_block: ({ Text, node, styles, inheritedStyles = {} }) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (typeof node.content === "string" && node.content.endsWith("\n")) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <Text key={node.key} style={[inheritedStyles, styles.code_block]}>
        {content}
      </Text>
    );
  },
  fence: ({ Text, node, styles, inheritedStyles = {} }) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (typeof node.content === "string" && node.content.endsWith("\n")) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <Text key={node.key} style={[inheritedStyles, styles.fence]}>
        {content}
      </Text>
    );
  },
  // Tables
  table: ({ node, children, styles }) => (
    <View key={node.key} style={styles.table}>
      {children}
    </View>
  ),
  thead: ({ node, children, styles }) => (
    <View key={node.key} style={styles.thead}>
      {children}
    </View>
  ),
  tbody: ({ node, children, styles }) => (
    <View key={node.key} style={styles.tbody}>
      {children}
    </View>
  ),
  th: ({ node, children, styles }) => (
    <View key={node.key} style={styles.th}>
      {children}
    </View>
  ),
  tr: ({ node, children, styles }) => (
    <View key={node.key} style={styles.tr}>
      {children}
    </View>
  ),
  td: ({ node, children, styles }) => (
    <View key={node.key} style={styles.td}>
      {children}
    </View>
  ),
  // Links
  link: ({ Text, node, children, styles, onLinkPress }) => {
    const linkNode = node as LinkNode;
    return (
      <Pressable
        accessibilityRole={"link"}
        key={node.key}
        onPress={() => {
          openUrl(linkNode.attributes.href, onLinkPress);
        }}
      >
        <Text style={styles.link}>{children}</Text>
      </Pressable>
    );
  },
  blocklink: ({ node, children, styles, onLinkPress }) => {
    const linkNode = node as LinkNode;
    return (
      <Pressable
        accessibilityRole={"link"}
        key={node.key}
        onPress={() => {
          openUrl(linkNode.attributes.href, onLinkPress);
        }}
        style={styles.blocklink}
      >
        <View style={styles.image}>{children}</View>
      </Pressable>
    );
  },
  // Images
  image: ({ node, styles, allowedImageHandlers, defaultImageHandler }) => {
    const imageNode = node as ImageNode;
    const { src, alt } = imageNode.attributes;

    const isAllowedSource = allowedImageHandlers?.some((value) =>
      src.toLowerCase().startsWith(value.toLowerCase()),
    );

    const uri = isAllowedSource
      ? src
      : defaultImageHandler
        ? `${defaultImageHandler}${src}`
        : null;

    if (!uri) return null;

    const imageProps = {
      indicator: true,
      style: styles.image,
      source: { uri },
      ...(alt && { accessible: true, accessibilityLabel: alt }),
    };

    return <FitImage key={node.key} {...imageProps} />;
  },
  // Text Output
  text: ({ Text, node, styles, inheritedStyles = {} }) => (
    <Text key={node.key} style={[inheritedStyles, styles.text]}>
      {node.content}
    </Text>
  ),
  textgroup: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.textgroup}>
      {children}
    </Text>
  ),
  paragraph: ({ node, children, styles }) => (
    <View key={node.key} style={styles.paragraph}>
      {children}
    </View>
  ),
  hardbreak: ({ Text, node, styles }) => (
    <Text key={node.key} style={styles.hardbreak}>
      {"\n"}
    </Text>
  ),
  softbreak: ({ Text, node, styles }) => (
    <Text key={node.key} style={styles.softbreak}>
      {"\n"}
    </Text>
  ),
  // Believe these are never used but retained for completeness
  pre: ({ node, children, styles }) => (
    <View key={node.key} style={styles.pre}>
      {children}
    </View>
  ),
  inline: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.inline}>
      {children}
    </Text>
  ),
  span: ({ Text, node, children, styles }) => (
    <Text key={node.key} style={styles.span}>
      {children}
    </Text>
  ),
};
