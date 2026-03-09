import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 14,
    fontWeight: "300",
    color: theme.light.dark_grey,
  },
});
