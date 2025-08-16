import cssToReactNative from "css-to-react-native";

export function convertAdditionalStyles(style: string) {
  const rules = style.split(";");

  const tuples = rules.reduce<[string, string][]>((acc, rule) => {
    const [key, value] = rule.split(":").map((part) => part.trim());
    if (key && value) acc.push([key, value]);
    return acc;
  }, []);

  const conv = cssToReactNative(tuples);

  return conv;
}
