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
    paddingHorizontal: 16,
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
  // passedOverlay: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: "#333",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 30,
  //   opacity: 0.6,
  // },

passedImage: {
  opacity: 0.82,
},

passedOverlayGray: {
  backgroundColor: "rgba(110, 110, 110, 0.5)",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 30,
},

passedOverlayDark: {
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 30,
},
  passedEventMarker: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#424242",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 39,
  },
  multiDayEventMarker: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: theme.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 39,
  },
  passedText: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
  },
});
