import type { TextStyle, ViewStyle, ImageStyle } from "react-native";
import { TEXT_STYLE_ONLY_PROPS, type TextOnlyStyle } from "../data";

type FailSafe = Record<keyof TextOnlyStyle, unknown>;

/**
 * Extracts only the properties that are valid for TextStyle from a given style object.
 *
 * @param style A style object that may contain properties from various style types.
 * @returns A new object containing only the properties that belong to TextStyle.
 */
export const getTextOnlyStyle = (
  style: ViewStyle | TextStyle | ImageStyle,
): TextOnlyStyle => {
  const result: TextOnlyStyle = {};

  // We iterate through a known list of valid keys.
  for (const key of TEXT_STYLE_ONLY_PROPS) {
    if (key in style) {
      const value = (style as TextStyle)[key];
      if (value != null) {
        (result as FailSafe)[key] = value;
      }
    }
  }

  return result;
};
