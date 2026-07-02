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
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
    paddingRight: 15,
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
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 8,
    rowGap: 8,
    marginBottom: 14,
    width: "100%",
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
    flexShrink: 1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 14,
    rowGap: 15,
    marginTop: 16,
    marginBottom: 16,
    overflow: "hidden",
  },

  remainingBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  borderWidth: 1,
  bordeeColor: '#11111',
  borderRadius: 16,
  },

  remainingText: {
  fontSize: 12,
  fontWeight: '700',
  color: '#666666',
  lineHeight: 16,
  },

  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    bordeeColor: '#11111',
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
