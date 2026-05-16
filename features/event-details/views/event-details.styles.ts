import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    paddingHorizontal: 14,
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: 240,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  passedImage: {
    opacity: 0.82,
  },
  passedOverlayGray: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(110, 110, 110, 0.5)",
  },
  passedOverlayDark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  passedEventMarker: {
    position: "absolute",
    top: 26,
    right: 24,
    backgroundColor: "#424242",
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
  sampleImageBadge: {
    position: "absolute",
    bottom: 12,
    left: 26,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  sampleImageBadgeText: {
    fontSize: 10,
    fontWeight: "400",
  },
  positionButtons: {
    position: "absolute",
    bottom: -20,
    right: 34,
    gap: 12,
    flexDirection: "row",
  },
  positionBackButton: {
    position: "absolute",
    top: 26,
    left: 26,
  },
  detailsContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginTop: 40,
  },
  shortDesc: {
    fontSize: 16,
    fontWeight: 300,
    marginTop: 8,
    lineHeight: 22,
  },
  dateAndTimeRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 24,
  },
  locationRowContainerAndOrganizerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 34,
    marginBottom: 16,
  },
  bulletListContainer: {
    marginBottom: 0,
  },
  bulletListItem: {
    flexDirection: "row",
    marginBottom: 14,
    paddingRight: 16,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 15,
    fontWeight: "300",
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 30
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#11111',
  },
  tagChipText: {
    fontSize: 14,
    fontWeight: "400",
  },
  stickyBottomContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  actionButton: {
    backgroundColor: theme.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    
    justifyContent: "center",
    minHeight: 56,
    width: '100%',
},
    actionButtonText: {
    color: theme.light.dark_grey,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",       
    lineHeight: 22,          
  },
  scrollContent: {
    paddingBottom: 140,
  },
});
