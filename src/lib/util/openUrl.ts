import { Linking } from "react-native";

export function openUrl(
  url: string,
  customCallback?: (url: string) => unknown,
) {
  if (!url) return;

  if (customCallback) {
    const result = customCallback(url);
    if (result && typeof result === "boolean") {
      void Linking.openURL(url);
    }
  } else {
    void Linking.openURL(url);
  }
}
