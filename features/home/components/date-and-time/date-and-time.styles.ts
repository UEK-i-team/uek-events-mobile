import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    alignSelf: "flex-start",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "300",
    color: theme.light.dark_grey,
  },
});
