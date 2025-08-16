import { StyleSheet } from "react-native";
import { isTextStyleOnlyProp } from "./isTextStyleOnlyProp";
import { TEXT_STYLE_ONLY_PROPS } from "../data";

export function removeTextStyleProps<T extends StyleSheet.NamedStyles<T>>(
  style: T,
): Omit<T, (typeof TEXT_STYLE_ONLY_PROPS)[number]> {
  const newStyle: Record<string, unknown> = {};

  for (const key in style) {
    if (
      Object.prototype.hasOwnProperty.call(style, key) &&
      !isTextStyleOnlyProp(key)
    ) {
      newStyle[key] = style[key];
    }
  }

  return newStyle as Omit<T, (typeof TEXT_STYLE_ONLY_PROPS)[number]>;
}
