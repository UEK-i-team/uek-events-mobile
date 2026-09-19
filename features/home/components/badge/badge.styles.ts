import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: .5,
    borderColor: '#111111',
    alignSelf: "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 16, 
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "300",
  },
  textSmall: {
    fontSize: 13,
  },
});
