import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarMock: {
    height: 120,
    backgroundColor: "#d0d0d0ff",
  },
  eventsContainer: {
    flex: 1,
    // paddingHorizontal: 14,
  },

  // past
  eventsContent: {
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
