import { StyleSheet } from "react-native";

import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mainBackground,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 32,
    },
    loaderContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.mainBackground,
    },
    retryContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    retryIconBadge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.primary}1F`,
      marginBottom: 20,
    },
    retryTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 10,
      textAlign: "center",
    },
    retryMessage: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textMuted,
      marginBottom: 28,
      textAlign: "center",
      maxWidth: 320,
    },
    retryButton: {
      alignSelf: "stretch",
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    retryButtonDisabled: {
      opacity: 0.6,
    },
    retryButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    secondaryButton: {
      alignSelf: "stretch",
      backgroundColor: "transparent",
      borderRadius: 16,
      paddingVertical: 14,
      marginTop: 8,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    secondaryButtonDisabled: {
      opacity: 0.6,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: "600",
    },
  });
