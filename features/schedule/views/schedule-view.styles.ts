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
      marginTop: 4,
      marginBottom: 16,
    },
    headerTitleRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginRight: 12,
    },
    headerText: {
      flexShrink: 1,
      fontSize: 20,
      lineHeight: 24,
      includeFontPadding: false,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    relativeDayBadge: {
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.mainBackgroundLighter,
    },
    relativeDayBadgeToday: {
      backgroundColor: colors.primary,
    },
    relativeDayBadgeText: {
      fontSize: 12,
      lineHeight: 16,
      includeFontPadding: false,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    relativeDayBadgeTextToday: {
      color: "#FFFFFF",
    },
    refreshButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.mainBackgroundLighter,
    },
    refreshSpinner: {
      width: 18,
      height: 18,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    groupsButton: {
      height: 36,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingLeft: 12,
      paddingRight: 10,
      borderRadius: 18,
      backgroundColor: colors.primary,
    },
    groupsButtonCount: {
      minWidth: 10,
      fontSize: 15,
      lineHeight: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
      includeFontPadding: false,
    },
    groupsButtonChevron: {
      marginLeft: -2,
      opacity: 0.85,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    listWrapper: {
      flex: 1,
    },
    listContent: {
      // Short days fill the screen so the empty state centers and swipes land.
      flexGrow: 1,
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
