import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  header: {
    paddingHorizontal: 26,
    paddingTop: 8,
    alignItems: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
  },
  accentLine: {
    height: 5,
    width: 90,
    borderRadius: 999,
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  dragContainer: {
    flex: 1,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 56,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingBottom: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
    width: 22,
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  skipButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  skipButtonPressed: {
    opacity: 0.7,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
