import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
  },
  imageWrapper: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    marginTop: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  metaPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "600",
  },
  countdownBar: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 16,
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  countdownValue: {
    fontSize: 18,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 14,
  },
  detailRow: {
    marginBottom: 14,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  ctaRow: {
    marginTop: "auto",
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "italic",
  },
});
