import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E8E8E8",
    borderRadius: 26,
    marginHorizontal: 14,
    marginBottom: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 26,
    marginTop: 4,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingRight: 42,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: theme.light.dark_grey,
    lineHeight: 24,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "300",
    color: "#111111",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingVertical: 16,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "300",
    color: "#111111",
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  topPartContainer: {
    flexDirection: "row",
    gap: 14,
    flex: 1,
  }
});
