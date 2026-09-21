import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

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

// FLOATING FILTER BUTTON
filterFab: {
  position: "absolute",
  bottom: 24,
  right: 16,
  width: 44,
  height: 44,
  borderRadius: 16,
  backgroundColor: "#ECEAE6",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
  zIndex: 10,
},
  activeBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 9.5,
    height: 9.5,
    borderRadius: 4.5,
    backgroundColor: "#E25822",
},
});
