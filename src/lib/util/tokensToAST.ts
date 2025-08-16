import Token from "markdown-it/lib/token";
import { generateUniqueKey } from "./generateUniqueKey";
import { getTokenTypeByToken } from "./getTokenTypeByToken";
import type {
  AstNode,
  BaseAttributes,
  ImageAttributes,
  LinkAttributes,
  OrderedListAttributes,
} from "../../types";

function createNode(token: Token, tokenIndex: number): AstNode {
  const type = getTokenTypeByToken(token);
  const content = token.content;

  let attributes: BaseAttributes = {};

  if (token.attrs) {
    attributes = token.attrs.reduce(
      (prev, [name, value]) => ({ ...prev, [name]: value }),
      {},
    );
  }

  const commonProps = {
    sourceType: token.type,
    sourceInfo: token.info,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    sourceMeta: token.meta,
    block: token.block,
    markup: token.markup,
    key: generateUniqueKey() + "_" + type,
    content,
    tokenIndex,
    index: 0,
    children: tokensToAST(token.children),
  };

  switch (type) {
    case "link":
      return {
        ...commonProps,
        type: "link",
        attributes: attributes as LinkAttributes,
      };
    case "image":
      return {
        ...commonProps,
        type: "image",
        attributes: attributes as ImageAttributes,
      };
    case "ordered_list":
      return {
        ...commonProps,
        type: "ordered_list",
        attributes: attributes as OrderedListAttributes,
      };
    default:
      // For all other node types
      return {
        ...commonProps,
        type,
        attributes,
      };
  }
}

export function tokensToAST(tokens: readonly Token[] | null) {
  const stack: AstNode[][] = [];
  let children: AstNode[] = [];

  if (!tokens || tokens.length === 0) {
    return [];
  }

  tokens.forEach((token, i) => {
    const astNode = createNode(token, i);

    if (
      !(
        astNode.type === "text" &&
        astNode.children.length === 0 &&
        astNode.content === ""
      )
    ) {
      astNode.index = children.length;

      if (token.nesting === 1) {
        children.push(astNode);
        stack.push(children);
        children = astNode.children;
      } else if (token.nesting === -1) {
        children = stack.pop() ?? [];
      } else {
        children.push(astNode);
      }
    }
  });

  return children;
}
