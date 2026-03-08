import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 0,
  },
  sortContainer: {
    paddingVertical: 12,
    paddingBottom: 4,
  },
  sortButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -80,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
