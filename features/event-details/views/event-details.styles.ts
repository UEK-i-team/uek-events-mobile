import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light.mainBackground,
    // alignItems: "center",
    // justifyContent: "center",
  },
  imageContainer: {
    paddingHorizontal: 14,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 30,
    borderWidth: 1,
    bordeeColor: '#11111',
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
    left: 40,
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
  },
  dateAndTimeRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  locationRowContainerAndOrganizerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.light.dark_grey,
    marginTop: 30,
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
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: theme.light.dark_grey,
    marginTop: 7,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    color: theme.light.dark_grey,
    fontWeight: "300",
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    bordeeColor: '#11111',
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
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",       
    lineHeight: 22,          
},
  scrollContent: {
    paddingBottom: 140,
  },
});
