import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden", // Ensures the left strip matches border radius
      minHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
    },
    leftStrip: {
      width: 16,
      height: "100%",
    },
    content: {
      flex: 1,
      padding: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    timeText: {
      flexShrink: 0,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    // Takes the space left by the time range, so a long room name is cut
    // with an ellipsis on any screen width instead of pushing the time away.
    roomContainer: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8,
      marginLeft: 12,
    },
    roomText: {
      flexShrink: 1,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "400",
    },
    roomDot: {
      flexShrink: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    titleText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.textPrimary,
      marginBottom: 4,
      lineHeight: 24,
    },
    groupNameText: {
      fontSize: 14,
      color: colors.primary, // Highlight the group visually
      fontWeight: "500",
      marginBottom: 12,
    },
    footerContainer: {
      marginTop: "auto",
    },
    typeText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
      marginBottom: 2,
    },
    professorText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
  });
