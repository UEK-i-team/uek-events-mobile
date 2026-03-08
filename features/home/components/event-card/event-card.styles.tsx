import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
    borderRadius: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  title: {
    color: theme.light.dark_grey,
    fontSize: 28,
    fontWeight: "600",
    marginTop: 12,
  },
  description: {
    color: theme.light.dark_grey,
    fontSize: 18,
    fontWeight: "300",
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  infoContainer: {
    paddingHorizontal: 10,
  },
});
