import type { TextStyle, ViewStyle } from "react-native";

export type TextOnlyStyle = Omit<TextStyle, keyof ViewStyle>;

// --- helpers ---
type HasDuplicates<T extends readonly unknown[]> = T extends readonly [
  infer F,
  ...infer R,
]
  ? F extends R[number]
    ? true
    : HasDuplicates<R>
  : false;

type Unique<T extends readonly unknown[]> =
  HasDuplicates<T> extends true ? never : T;

type ExactKeySet<T extends readonly string[], Keys extends string> =
  Exclude<Keys, T[number]> extends never // no missing keys
    ? Exclude<T[number], Keys> extends never // no foreign keys
      ? Unique<T> // no duplicates
      : never
    : never;

// curried checker so the value is validated at the call site
const exactKeys =
  <Keys extends string>() =>
  <T extends readonly Keys[]>(t: ExactKeySet<T, Keys>) =>
    t;

const exactKeysTextOnlyStyle = exactKeys<keyof TextOnlyStyle>();

export const TEXT_STYLE_ONLY_PROPS: (keyof TextOnlyStyle)[] =
  exactKeysTextOnlyStyle([
    "color",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontWeight",
    "letterSpacing",
    "lineHeight",
    "textAlign",
    "textDecorationLine",
    "textDecorationStyle",
    "textDecorationColor",
    "textShadowColor",
    "textShadowOffset",
    "textShadowRadius",
    "textTransform",
    "userSelect",
    "fontVariant",
    "writingDirection",
    "textAlignVertical",
    "verticalAlign",
    "includeFontPadding",
  ] as const);
