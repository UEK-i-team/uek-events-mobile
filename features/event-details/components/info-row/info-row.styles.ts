import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12, 
    backgroundColor: "#EAEAEA",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    color: theme.light.dark_grey,
    marginBottom: 2,
    fontWeight: "300",
  },
  text: {
    fontSize: 16,
    color: theme.light.dark_grey,
    fontWeight: "300",
  },
});

