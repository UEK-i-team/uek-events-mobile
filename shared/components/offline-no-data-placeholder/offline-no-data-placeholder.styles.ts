import { StyleSheet } from "react-native";

import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: theme.light.dark_grey,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    color: theme.light.textMuted,
  },
});
