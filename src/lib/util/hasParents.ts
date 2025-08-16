import type { AstNode } from "../../types";

export function hasParents(parents: AstNode[], type: string) {
  return parents.findIndex((el) => el.type === type) > -1;
}
