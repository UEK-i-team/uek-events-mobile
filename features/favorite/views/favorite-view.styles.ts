import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 20,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    height: 55,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E9E9",
    borderWidth: 2,
    borderColor: "transparent",
  },
  tabActive: {
    borderColor: theme.light.primary,
  },
  tabInactive: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.13)",
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.light.primary,
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000000",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#000000",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    color: "#666666",
  },
});
