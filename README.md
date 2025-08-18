# React Native Markdown X [![npm version](https://badge.fury.io/js/react-native-markdown-x.svg)](https://badge.fury.io/js/react-native-markdown-x) [![Known Vulnerabilities](https://snyk.io/test/github/rarenatoe/react-native-markdown-x/badge.svg)](https://snyk.io/test/github/rarenatoe/react-native-markdown-x)

THE definitive CommonMark renderer for React Native. Built with TypeScript, using native components, fully customizable.

## Features

- __TypeScript First__: Complete type safety with exported types for customization
- __Native Components__: No WebView - renders using React Native components
- __Fully Customizable__: Override any render function or style
- __Better Architecture__: Clean AstRenderer class with proper fallbacks
- __Standardized API__: All render functions use consistent props interface
- __Modern Performance__: Optimized for React Native applications

## Install

```bash
npm install react-native-markdown-x
```

```bash
yarn add react-native-markdown-x
```

```bash
pnpm add react-native-markdown-x
```

```bash
bun add react-native-markdown-x
```

## Get Started

```tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { Markdown } from 'react-native-markdown-x';

const App = () => (
  <ScrollView style={{ padding: 16 }}>
    <Markdown>
      {`# Hello World\n\n**Bold text** and *italic text*\n\nNormal text here.`}
    </Markdown>
  </ScrollView>
);
```

## API Reference

### Core Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string \| AstNode[]` | *required* | Markdown content or pre-processed AST |
| `styles` | `StyleMap` | [Default styles](https://github.com/rarenatoe/react-native-markdown-x/blob/master/src/lib/data/defaultStyles.ts) | Style overrides for markdown elements |
| `renderFunctions` | `RenderFunctionMap` | [Default renders](https://github.com/rarenatoe/react-native-markdown-x/blob/master/src/lib/data/defaultRenderFunctions.tsx) | Custom render functions |
| `onLinkPress` | `(url: string) => void` | `Linking.openURL` | Custom link handling |

### Advanced Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `renderer` | `AstRenderer` | `instanceOf(AstRenderer)` | Custom renderer instance (mutually exclusive with `renderFunctions`/`styles`) |
| `useDefaultRenderFunctions` | `boolean` | `true` | Whether to merge with default renders or use only provided functions |
| `useDefaultStyles` | `boolean` | `true` | Whether to merge with default styles or use only provided styles |
| `markdownit` | `MarkdownIt` | `instanceOf(MarkdownIt)` | Custom markdown-it configuration |
| `textComponent` | `ComponentType<TextProps>` | `Text` | Custom Text component for rendering |
| `maxTopLevelChildren` | `number` | `undefined` | Limit rendered top-level elements |
| `topLevelExceededComponent` | `JSX.Element` | `<Text key="dotdotdot">...</Text>` | Component shown when `maxTopLevelChildren` is exceeded |
| `allowedImageHandlers` | `string[]` | `['data:image/png;base64', 'data:image/gif;base64', 'data:image/jpeg;base64', 'https://', 'http://']` | Allowed image URL prefixes |
| `defaultImageHandler` | `string` | `https://` | Prepended to image URLs not matching `allowedImageHandlers` |
| `debugPrintTree` | `boolean` | `false` | Log AST structure for debugging |

## Syntax Support

### Core Markdown Elements

All standard CommonMark elements are supported with native React Native rendering:

- __Headings__: `# h1` through `###### h6`
- __Emphasis__: `**bold**`, `__bold__`, `*italic*`, `_italic_`, `~~strikethrough~~`
- __Lists__: Ordered (`1. item`) and unordered (`- item`) with nesting support
- __Links__: `[text](url)` and `[text](url "title")` with auto-linking
- __Images__: `![alt](src)` and reference-style `![alt][id]`
- __Code__: Inline `` `code` `` and fenced blocks with syntax highlighting
- __Tables__: Full table support with alignment options
- __Blockquotes__: Single and nested `> quote` blocks
- __Horizontal Rules__: `---` or `___` separators
- __Typographic Replacements__: Smart quotes, em-dashes, and symbols

<details><summary>View Live Examples</summary>

| Feature | iOS | Android |
|---------|-----|---------|
| __Headings__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-1.png" alt="iOS Headings" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-1.png" alt="Android Headings" width="200"/> |
| __Emphasis__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-4.png" alt="iOS Emphasis" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-4.png" alt="Android Emphasis" width="200"/> |
| __Lists__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-6.png" alt="iOS Lists" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-6.png" alt="Android Lists" width="200"/> |
| __Links__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-9.png" alt="iOS Links" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-9.png" alt="Android Links" width="200"/> |
| __Images__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-10.png" alt="iOS Images" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-10.png" alt="Android Images" width="200"/> |
| __Code__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-7.png" alt="iOS Code" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-7.png" alt="Android Code" width="200"/> |
| __Tables__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-8.png" alt="iOS Tables" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-8.png" alt="Android Tables" width="200"/> |
| __Blockquotes__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-5.png" alt="iOS Blockquotes" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-5.png" alt="Android Blockquotes" width="200"/> |
| __Horizontal Rules__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-2.png" alt="iOS Horizontal Rules" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-2.png" alt="Android Horizontal Rules" width="200"/> |
| __Typographic Replacements__ | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/ios-3.png" alt="iOS Typographic Replacements" width="200"/> | <img src="https://github.com/rarenatoe/react-native-markdown-x/raw/main/doc/images/android-3.png" alt="Android Typographic Replacements" width="200"/> |

</details>

<details><summary>All Markdown for Testing</summary>
<p>

This is all of the markdown in one place for testing that your applied styles work in all cases

```md
Headings

  # h1 Heading 8-)
  ## h2 Heading
  ### h3 Heading
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading


Horizontal Rules

  Some text above
  ___

  Some text in the middle

  ---

  Some text below


Emphasis

  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~


Blockquotes

  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.


Lists

  Unordered

  + Create a list by starting a line with `+`, `-`, or `*`
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar


Code

  Inline \`code\`

  Indented code

      // Some comments
      line 1 of code
      line 2 of code
      line 3 of code


  Block code "fences"

  \`\`\`
  Sample text here...
  \`\`\`

  Syntax highlighting

  \`\`\` js
  var foo = function (bar) {
    return bar++;
  };

  console.log(foo(5));
  \`\`\`


Tables

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

  Right aligned columns

  | Option | Description |
  | ------:| -----------:|
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | __Headings__ <br/> <pre>
  | ext    | extension to be used for dest files. |


Links

  [link text](https://www.google.com)

  [link with title](https://www.google.com "title text!")

  Autoconverted link https://www.google.com (enable linkify to see)

Images

  ![Minion](https://octodex.github.com/images/minion.png)
  ![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

  Like links, Images also have a footnote style syntax

  ![Alt text][id]

  With a reference later in the document defining the URL location:

  [id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


Typographic Replacements

  Enable typographer option to see result.

  (c) (C) (r) (R) (tm) (TM) (p) (P) +-

  test.. test... test..... test?..... test!....

  !!!!!! ???? ,,  -- ---

  "Smartypants, double quotes" and 'single quotes'

```

</p>
</details>

## Customization

### Styling

Customize appearance using the `styles` prop. By default, your styles are merged with the built-in defaults - changes to specific elements override defaults for those elements only.

```tsx
// Merged with defaults (useDefaultStyles: true - default behavior)
<Markdown
  styles={{
    body: { color: 'red', fontSize: 14 },     // Affects all text
    heading1: { color: 'purple' },           // Overrides default h1 style
    code_block: { backgroundColor: '#f0f0f0' }
  }}
>
  {content}
</Markdown>

// Complete style override (useDefaultStyles: false)
<Markdown
  styles={{
    body: { color: 'red', fontSize: 14 },
    heading1: { fontSize: 24, fontWeight: 'bold' }
    // Only these styles will be applied - no defaults
  }}
  useDefaultStyles={false}
>
  {content}
</Markdown>
```

__Note__: The `text` style doesn't apply to all text (e.g., list markers). Use `body` for global text styling.

### Render Functions

Override how elements are rendered using the `renderFunctions` prop. All render functions have a __standardized interface__ with consistent props and return types. Like styles, these are merged with defaults by default:

```tsx
// Merged with defaults (useDefaultRenderFunctions: true - default behavior)
const customRenders = {
  heading1: ({ node, children, styles, Text }) => (
    <Text key={node.key} style={[styles.heading1, { borderLeftWidth: 4, borderLeftColor: 'blue' }]}>
      📝 {children}
    </Text>
  ),
  strong: ({ node, children, styles, Text }) => (
    <Text key={node.key} style={[styles.strong, { color: 'red' }]}>
      {children}
    </Text>
  )
};

<Markdown renderFunctions={customRenders}>{content}</Markdown>

// Complete override (useDefaultRenderFunctions: false)
const minimalRenders = {
  body: ({ children }) => <View>{children}</View>,
  heading1: ({ node, children, styles, Text }) => (
    <Text key={node.key} style={styles.heading1}>{children}</Text>
  ),
  // Must provide all render functions you need - no defaults
};

<Markdown 
  renderFunctions={minimalRenders}
  useDefaultRenderFunctions={false}
>
  {content}
</Markdown>
```

#### Standardized Render Function Interface

All render functions receive the same props object with the following signature:

```tsx
type RenderFunction = (props: {
  node: AstNode;              // The current AST node
  children?: ReactNode;       // Rendered child elements
  parents: AstNode[];         // Parent nodes in the AST tree
  styles: FlattenedStyleMap;  // All computed styles
  Text: ComponentType<TextProps>; // Text component (respects textComponent prop)
  inheritedStyles?: TextOnlyStyle; // Inherited text styles from parents
  onLinkPress?: (url: string) => void; // Link handler function
  allowedImageHandlers?: string[];     // Allowed image URL prefixes
  defaultImageHandler?: string;        // Default image URL prefix
}) => ReactNode;
```

This standardized interface means:

- ✅ __Consistent API__: No more different function signatures per element type
- ✅ __Text Component Access__: The `Text` component is always available as a prop
- ✅ __Type Safety__: Full TypeScript support with proper prop types
- ✅ __Future Proof__: New features can be added without breaking changes

> ⚠️ __Important__: When providing both custom `styles` and `renderFunctions` for the same element type, you must ensure your custom render function actually uses the provided style from the `styles` parameter. The style won't be applied automatically!
>
> ```tsx
> // ❌ Style will be ignored - custom render function doesn't use it
> <Markdown
>   styles={{ heading1: { color: 'red', fontSize: 24 } }}
>   renderFunctions={{
>     heading1: ({ node, children, Text }) => <Text key={node.key}>{children}</Text>
>   }}
> >
>   {content}
> </Markdown>
> 
> // ✅ Style will be applied - custom render function uses styles parameter
> <Markdown
>   styles={{ heading1: { color: 'red', fontSize: 24 } }}
>   renderFunctions={{
>     heading1: ({ node, children, styles, Text }) => (
>       <Text key={node.key} style={styles.heading1}>{children}</Text>
>     )
>   }}
> >
>   {content}
> </Markdown>
> 
> // ✅ Alternative - apply styles directly in the render function
> <Markdown
>   renderFunctions={{
>     heading1: ({ node, children, Text }) => (
>       <Text key={node.key} style={{ color: 'red', fontSize: 24 }}>
>         {children}
>       </Text>
>     )
>   }}
> >
>   {content}
> </Markdown>
> ```

### Available Elements

| Element | Render Function | Style Key(s) |
|---------|----------------|--------------|
| Body | `body` | `body` |
| Headings | `heading1`-`heading6` | `heading1`-`heading6` |
| Text formatting | `strong`, `em`, `s` | `strong`, `em`, `s` |
| Lists | `bullet_list`, `ordered_list`, `list_item` | `bullet_list`, `ordered_list`, `list_item`, `list_item_*_marker`, `list_item_*_content` |
| Code | `code_inline`, `code_block`, `fence` | `code_inline`, `code_block`, `fence` |
| Tables | `table`, `thead`, `tbody`, `th`, `tr`, `td` | `table`, `thead`, `tbody`, `th`, `tr`, `td` |
| Links & Images | `link`, `blocklink`, `image` | `link`, `blocklink`, `image` |
| Other | `blockquote`, `hr`, `paragraph` | `blockquote`, `hr`, `paragraph` |

### Extensions & Plugins

Extend functionality using any markdown-it compatible plugin. Use `debugPrintTree` to identify new components and create corresponding render functions:

```tsx
import MarkdownIt from 'markdown-it';
import blockEmbedPlugin from 'markdown-it-block-embed';

const markdownItInstance = MarkdownIt({typographer: true})
  .use(blockEmbedPlugin, { containerClassName: "video-embed" });

const customRenders = {
  video: ({ node, children, styles, Text }) => {
    // Access plugin data through node.sourceInfo
    const { videoID, serviceName } = node.sourceInfo;
    return (
      <Text key={node.key} style={styles.video}>
        🎥 {serviceName} video: {videoID}
      </Text>
    );
  }
};

<Markdown 
  markdownit={markdownItInstance}
  renderFunctions={customRenders}
  styles={{ video: { color: 'blue' } }}
>
  {`@[youtube](lJIrF4YjHfQ)`}
</Markdown>
```

<details><summary>Complete Plugin Integration Example</summary>

This example shows full integration with a video embed plugin:

```tsx
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Markdown } from 'react-native-markdown-x';
import MarkdownIt from 'markdown-it';
import blockEmbedPlugin from 'markdown-it-block-embed';

const markdownItInstance = MarkdownIt({typographer: true})
  .use(blockEmbedPlugin, { containerClassName: "video-embed" });

const renderFunctions = {
  video: ({ node, children, styles, Text }) => {
    console.log(node); // Debug: see available properties
    return (
      <Text key={node.key} style={styles.video}>
        🎥 Video Component Here
      </Text>
    );
  }
};

const styles = { video: { color: 'red', fontSize: 16 } };

const content = `# Video Example\n\n@[youtube](lJIrF4YjHfQ)`;

export default () => (
  <ScrollView style={{ padding: 16 }}>
    <Markdown
      debugPrintTree
      markdownit={markdownItInstance}
      renderFunctions={renderFunctions}
      styles={styles}
    >
      {content}
    </Markdown>
  </ScrollView>
);
```

The `debugPrintTree` output shows the AST structure:

```text
body
-heading1
--textgroup
---text
-video
```

And node properties include all plugin data:

```js
{
  type: "video",
  sourceInfo: {
    service: "youtube",
    videoID: "lJIrF4YjHfQ",
    options: { width: 640, height: 390 }
  }
}
```

</details>

<details><summary>Complete Styling Example</summary>

```tsx
import { Markdown } from 'react-native-markdown-x';

const styles = {
  body: { fontSize: 16, lineHeight: 24 },
  heading1: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  heading2: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  strong: { fontWeight: 'bold', color: '#333' },
  em: { fontStyle: 'italic', color: '#666' },
  code_inline: { 
    backgroundColor: '#f5f5f5', 
    paddingHorizontal: 4,
    fontFamily: 'monospace'
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    paddingLeft: 16,
    fontStyle: 'italic'
  }
};

<Markdown styles={styles}>{content}</Markdown>
```

</details>

## Advanced Usage

### Custom Link Handling

#### Option 1: onLinkPress callback

```tsx
const onLinkPress = (url) => {
  if (url.includes('internal://')) {
    // Handle internal navigation
    navigate(url);
    return false; // Don't use default handler
  }
  return true; // Use default Linking.openURL
};

<Markdown onLinkPress={onLinkPress}>{content}</Markdown>
```

#### Option 2: Custom render function

```tsx
const renderFunctions = {
  link: ({ node, children, styles, Text, onLinkPress }) => (
    <Text 
      key={node.key} 
      style={styles.link} 
      onPress={() => handleCustomLink(node.attributes.href)}
    >
      {children}
    </Text>
  )
};

<Markdown renderFunctions={renderFunctions}>{content}</Markdown>
```

### Disabling Markdown Features

Disable specific markdown types for mobile-friendly content:

```tsx
import MarkdownIt from 'markdown-it';

// Disable links and images
const restrictedMarkdown = MarkdownIt({typographer: true}).disable(['link', 'image']);

<Markdown markdownit={restrictedMarkdown}>
  {`# This heading works\n[but this link](is plain text)`}
</Markdown>
```

### Pre-processing Content

For advanced use cases, process the AST directly:

```tsx
import { Markdown, tokensToAST, stringToTokens } from 'react-native-markdown-x';
import MarkdownIt from 'markdown-it';

const markdownItInstance = MarkdownIt({typographer: true});
const ast = tokensToAST(stringToTokens(content, markdownItInstance));

// Modify AST as needed
<Markdown>{ast}</Markdown>
```

### Custom AstRenderer

For complete control, create a custom renderer. When using a custom renderer, `renderFunctions`, `styles`, `useDefaultRenderFunctions`, and `useDefaultStyles` props are ignored:

```tsx
import { Markdown, AstRenderer, DEFAULT_RENDER_FUNCTIONS, DEFAULT_STYLES } from 'react-native-markdown-x';

const customRenderer = new AstRenderer({
  renderFunctions: {
    ...DEFAULT_RENDER_FUNCTIONS,
    heading1: ({ node, children, styles, Text }) => (
      <Text key={node.key} style={[styles.heading1, { color: 'blue' }]}>
        {children}
      </Text>
    )
  },
  styles: DEFAULT_STYLES,
  useDefaultStyles: false,
  onLinkPress: (url) => console.log('Link pressed:', url)
});

<Markdown renderer={customRenderer}>{content}</Markdown>
```

## Architecture & Type Safety

### Prop Conflicts Prevention

The library uses TypeScript discriminated unions to prevent conflicting prop combinations:

```tsx
// ✅ Valid: Using individual props
<Markdown styles={myStyles} renderFunctions={myRenders}>
  {content}
</Markdown>

// ✅ Valid: Using custom renderer
<Markdown renderer={customRenderer}>
  {content}
</Markdown>

// ❌ TypeScript Error: Cannot use both renderer and individual props
<Markdown 
  renderer={customRenderer}
  styles={myStyles}        // TypeScript prevents this
  renderFunctions={myRenders}  // TypeScript prevents this
>
  {content}
</Markdown>
```

### Performance Optimizations

- __Memoized Renderer__: The `AstRenderer` instance is memoized to prevent unnecessary re-creation
- __Memoized Parser__: The `MarkdownIt` instance is memoized for consistent parsing
- __Style Flattening__: Styles are flattened once during renderer creation for optimal performance
- __Efficient Re-renders__: Only re-renders when props actually change

### Advanced Configuration

```tsx
import { Markdown, AstRenderer } from 'react-native-markdown-x';
import { MyCustomText } from './components';

// Complete customization with performance optimization
const renderer = new AstRenderer({
  textComponent: MyCustomText,
  useDefaultRenderFunctions: false,  // Start from scratch
  useDefaultStyles: false,           // Complete style control
  renderFunctions: {
    // Only define what you need
    body: ({ children }) => <ScrollView>{children}</ScrollView>,
    paragraph: ({ children, styles, Text }) => <Text style={styles.paragraph}>{children}</Text>
  },
  styles: {
    paragraph: { marginBottom: 16 }
  }
});

<Markdown renderer={renderer}>{content}</Markdown>
```

---

## Migration Guide

Migrating from other React Native markdown libraries:

| Other Libraries | React Native Markdown X |
|----------------|-------------------------|
| `style` prop | `styles` prop |
| `mergeStyle` prop | `useDefaultStyles` prop |
| `rules` prop | `renderFunctions` prop |

```tsx
// Before (other libraries)
<Markdown style={myStyles} mergeStyle={true} rules={myRules}>
  {content}
</Markdown>

// After (React Native Markdown X)
<Markdown styles={myStyles} useDefaultStyles={true} renderFunctions={myRenderFunctions}>
  {content}
</Markdown>
```

---

*This library represents the next evolution in React Native markdown rendering, combining the best features from existing libraries with modern TypeScript architecture and improved performance.*
