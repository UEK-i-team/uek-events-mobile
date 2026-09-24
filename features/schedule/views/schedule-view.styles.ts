import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mainBackground,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 16,
      marginBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    iconButton: {
      padding: 6,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    iconButtonDisabled: {
      opacity: 0.5,
    },
    iconButtonSpinner: {
      width: 20,
      height: 20,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    offlineBanner: {
      gap: 8,
      marginHorizontal: 20,
      marginBottom: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: colors.mainBackgroundLighter,
    },
    offlineBannerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    offlineBannerText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    offlineBannerButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      minWidth: 72,
      alignItems: "center",
    },
    offlineBannerButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
    },
    offlineBannerSecondaryButton: {
      alignSelf: "flex-end",
      paddingVertical: 4,
      minHeight: 24,
      justifyContent: "center",
    },
    offlineBannerSecondaryButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      textDecorationLine: "underline",
    },
  });
