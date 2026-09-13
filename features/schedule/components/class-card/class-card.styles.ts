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
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    roomContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    roomText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "400",
    },
    roomDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    titleText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.textPrimary,
      marginBottom: 16,
      lineHeight: 24,
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
