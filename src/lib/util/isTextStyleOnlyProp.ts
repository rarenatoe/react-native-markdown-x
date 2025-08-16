import { TEXT_STYLE_ONLY_PROPS, type TextOnlyStyle } from "../data";

export function isTextStyleOnlyProp(key: string): key is keyof TextOnlyStyle {
  return TEXT_STYLE_ONLY_PROPS.includes(
    key as (typeof TEXT_STYLE_ONLY_PROPS)[number],
  );
}
