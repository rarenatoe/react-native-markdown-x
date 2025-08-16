import type Token from "markdown-it/lib/token";
import { cleanupTokens } from "../cleanupTokens";

// Helper function to create a token that implements the Token interface properly
const createToken = (overrides: Partial<Token> = {}): Token => {
  const token = {
    type: "text",
    tag: "",
    attrs: null,
    map: null,
    nesting: 0,
    level: 0,
    children: null,
    content: "",
    markup: "",
    info: "",
    meta: null,
    block: false,
    hidden: false,
    attrIndex(name: string): number {
      if (!this.attrs) return -1;
      return this.attrs.findIndex((attr) => attr[0] === name);
    },
    attrPush(attr: [string, string]): void {
      this.attrs ??= [];
      this.attrs.push(attr);
    },
    attrSet(name: string, value: string): void {
      const index = this.attrIndex(name);
      if (index >= 0 && this.attrs?.[index]) {
        this.attrs[index][1] = value;
      } else {
        this.attrPush([name, value]);
      }
    },
    attrGet(name: string): string | null {
      const index = this.attrIndex(name);
      return index >= 0 && this.attrs?.[index] ? this.attrs[index][1] : null;
    },
    attrJoin(name: string, value: string): void {
      const index = this.attrIndex(name);
      if (index >= 0 && this.attrs?.[index]) {
        this.attrs[index][1] = `${this.attrs[index][1]} ${value}`;
      } else {
        this.attrPush([name, value]);
      }
    },
    ...overrides,
  } as Token;

  return token;
};

describe("cleanupTokens", () => {
  describe("image token handling", () => {
    it("should set image tokens to block elements", () => {
      const tokens = [createToken({ type: "image", block: false })];
      const result = cleanupTokens(tokens);
      expect(result[0]?.block).toBe(true);
    });

    it("should set alt text for image tokens with children", () => {
      const childToken = createToken({
        type: "text",
        content: "Test alt text",
      });
      const imageToken = createToken({
        type: "image",
        attrs: [["src", "image.jpg"]],
        children: [childToken],
      });

      const result = cleanupTokens([imageToken]);
      expect(result[0]?.attrs).toContainEqual(["alt", "Test alt text"]);
    });

    it("should update existing alt text for image tokens", () => {
      const childToken = createToken({ type: "text", content: "New alt text" });
      const imageToken = createToken({
        type: "image",
        attrs: [["alt", "Old alt text"]],
        children: [childToken],
      });

      const result = cleanupTokens([imageToken]);
      expect(result[0]?.attrs?.[0]).toEqual(["alt", "New alt text"]);
    });

    it("should create attrs array for image tokens without attrs", () => {
      const childToken = createToken({ type: "text", content: "Alt text" });
      const imageToken = createToken({
        type: "image",
        attrs: null,
        children: [childToken],
      });

      const result = cleanupTokens([imageToken]);
      expect(result[0]?.attrs).toEqual([["alt", "Alt text"]]);
    });

    it("should handle image tokens with no children", () => {
      const imageToken = createToken({
        type: "image",
        attrs: null,
        children: null,
      });

      const result = cleanupTokens([imageToken]);
      expect(result[0]?.attrs).toEqual([["alt", ""]]);
    });
  });

  describe("hardbreak token handling", () => {
    it("should set hardbreak tokens to block elements", () => {
      const tokens = [createToken({ type: "hardbreak", block: false })];
      const result = cleanupTokens(tokens);
      expect(result[0]?.block).toBe(true);
    });
  });

  describe("link to blocklink conversion", () => {
    it("should convert links with block children to blocklinks", () => {
      const tokens = [
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "image", block: true }),
        createToken({ type: "link_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);
      expect(result[0]?.type).toBe("blocklink");
      expect(result[0]?.block).toBe(true);
      expect(result[2]?.type).toBe("blocklink");
      expect(result[2]?.block).toBe(true);
    });

    it("should keep normal links as links when no block children", () => {
      const tokens = [
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "text", block: false }),
        createToken({ type: "link_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);
      expect(result[0]?.type).toBe("link");
      expect(result[0]?.block).toBe(false);
      expect(result[2]?.type).toBe("link");
      expect(result[2]?.block).toBe(false);
    });

    it("should handle multiple consecutive links correctly (stack clearing test)", () => {
      const tokens = [
        // First link with block child
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "image", block: true }),
        createToken({ type: "link_close", nesting: -1 }),
        // Second link with text child
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "text", block: false }),
        createToken({ type: "link_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);

      // First link should be blocklink
      expect(result[0]?.type).toBe("blocklink");
      expect(result[2]?.type).toBe("blocklink");

      // Second link should remain link (proves stack was cleared)
      expect(result[3]?.type).toBe("link");
      expect(result[5]?.type).toBe("link");
    });

    it("should handle nested links with mixed content", () => {
      const tokens = [
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "text", block: false }),
        createToken({ type: "strong_open", nesting: 1, block: false }),
        createToken({ type: "text", block: false }),
        createToken({ type: "strong_close", nesting: -1, block: false }),
        createToken({ type: "image", block: true }),
        createToken({ type: "link_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);
      expect(result[0]?.type).toBe("blocklink");
      expect(result[6]?.type).toBe("blocklink");
    });

    it("should handle tokens outside of links normally", () => {
      const tokens = [
        createToken({ type: "paragraph_open", nesting: 1 }),
        createToken({ type: "text" }),
        createToken({ type: "paragraph_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);
      expect(result).toHaveLength(3);
      expect(result[0]?.type).toBe("paragraph");
      expect(result[1]?.type).toBe("text");
      expect(result[2]?.type).toBe("paragraph");
    });

    it("should handle empty token array", () => {
      const result = cleanupTokens([]);
      expect(result).toEqual([]);
    });

    it("should handle single token", () => {
      const token = createToken({ type: "text", content: "Hello" });
      const result = cleanupTokens([token]);
      expect(result).toHaveLength(1);
      expect(result[0]?.type).toBe("text");
    });
  });

  describe("token type conversion", () => {
    it("should convert heading_open tokens to heading types", () => {
      const tokens = [
        createToken({ type: "heading_open", tag: "h1" }),
        createToken({ type: "heading_open", tag: "h2" }),
        createToken({ type: "heading_open", tag: "h6" }),
      ];

      const result = cleanupTokens(tokens);
      expect(result[0]?.type).toBe("heading1");
      expect(result[1]?.type).toBe("heading2");
      expect(result[2]?.type).toBe("heading6");
    });

    it("should strip _open and _close suffixes from token types", () => {
      const tokens = [
        createToken({ type: "paragraph_open" }),
        createToken({ type: "paragraph_close" }),
        createToken({ type: "strong_open" }),
        createToken({ type: "strong_close" }),
      ];

      const result = cleanupTokens(tokens);
      expect(result[0]?.type).toBe("paragraph");
      expect(result[1]?.type).toBe("paragraph");
      expect(result[2]?.type).toBe("strong");
      expect(result[3]?.type).toBe("strong");
    });
  });

  describe("inline token flattening", () => {
    it("should flatten inline tokens and their children", () => {
      const tokens = [
        createToken({
          type: "inline",
          children: [
            createToken({ type: "text", content: "Hello" }),
            createToken({ type: "strong_open" }),
            createToken({ type: "text", content: "world" }),
            createToken({ type: "strong_close" }),
          ],
        }),
      ];

      const result = cleanupTokens(tokens);
      expect(result).toHaveLength(4);
      expect(result[0]?.type).toBe("text");
      expect(result[0]?.content).toBe("Hello");
      expect(result[1]?.type).toBe("strong");
      expect(result[2]?.type).toBe("text");
      expect(result[2]?.content).toBe("world");
      expect(result[3]?.type).toBe("strong");
    });

    it("should handle nested inline tokens", () => {
      const tokens = [
        createToken({
          type: "inline",
          children: [
            createToken({
              type: "inline",
              children: [createToken({ type: "text", content: "Nested" })],
            }),
            createToken({ type: "text", content: "Text" }),
          ],
        }),
      ];

      const result = cleanupTokens(tokens);
      expect(result).toHaveLength(2);
      expect(result[0]?.content).toBe("Nested");
      expect(result[1]?.content).toBe("Text");
    });
  });

  describe("stack clearing critical test", () => {
    it("should properly clear stack to prevent link contamination", () => {
      // This test specifically verifies that stack.length = 0 happens after acc.push(...stack)
      const tokens = [
        // First link with image (should become blocklink)
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "image", block: true }),
        createToken({ type: "link_close", nesting: -1 }),

        // Paragraph in between
        createToken({ type: "paragraph_open", nesting: 1 }),
        createToken({ type: "text", content: "Some text" }),
        createToken({ type: "paragraph_close", nesting: -1 }),

        // Second link with only text (should remain link)
        createToken({ type: "link_open", nesting: 1 }),
        createToken({ type: "text", content: "Link text", block: false }),
        createToken({ type: "link_close", nesting: -1 }),
      ];

      const result = cleanupTokens(tokens);

      // Verify first link became blocklink
      expect(result[0]?.type).toBe("blocklink");
      expect(result[2]?.type).toBe("blocklink");

      // Verify paragraph tokens are preserved
      expect(result[3]?.type).toBe("paragraph");
      expect(result[4]?.type).toBe("text");
      expect(result[5]?.type).toBe("paragraph");

      // Verify second link remained as link (this proves stack was cleared)
      expect(result[6]?.type).toBe("link");
      expect(result[8]?.type).toBe("link");

      // Verify we have all expected tokens
      expect(result).toHaveLength(9);
    });
  });
});
