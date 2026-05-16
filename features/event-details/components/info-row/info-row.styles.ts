import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12, 
    backgroundColor: theme.light.mainBackgroundLighter,
    borderWidth: 1,
    borderColor: '#11111',
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: "300",
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
  },
});

