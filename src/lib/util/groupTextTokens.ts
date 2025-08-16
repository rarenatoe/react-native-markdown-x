import Token from "markdown-it/lib/token";

class GroupedTextToken implements Token {
  type: string;
  tag: string;
  attrs: [string, string][];
  map: [number, number] | null;
  nesting: Token.Nesting;
  level: number;
  children: Token[] | null;
  content: string;
  markup: string;
  info: string;
  meta: unknown;
  block: boolean;
  hidden: boolean;

  constructor(type: string, tag: string, nesting: Token.Nesting) {
    this.type = type;
    this.tag = tag;
    this.attrs = [];
    this.map = null;
    this.nesting = nesting;
    this.level = 0;
    this.children = null;
    this.content = "";
    this.markup = "";
    this.info = "";
    this.meta = {};
    this.block = false;
    this.hidden = false;
  }

  attrIndex() {
    return 0;
  }
  attrPush() {
    // Empty Implementation
  }
  attrSet() {
    // Empty Implementation
  }
  attrGet() {
    return null;
  }
  attrJoin() {
    // Empty Implementation
  }
}

export function groupTextTokens(tokens: Token[]) {
  const result: Token[] = [];

  let hasGroup = false;

  tokens.forEach((token) => {
    if (!token.block && !hasGroup) {
      hasGroup = true;
      result.push(new GroupedTextToken("textgroup", "", 1));
      result.push(token);
    } else if (!token.block && hasGroup) {
      result.push(token);
    } else if (token.block && hasGroup) {
      hasGroup = false;
      result.push(new GroupedTextToken("textgroup", "", -1));
      result.push(token);
    } else {
      result.push(token);
    }
  });

  return result;
}
