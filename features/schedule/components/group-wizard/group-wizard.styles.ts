import { StyleSheet, Platform } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.mainBackground,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginLeft: 12,
    },
    headerBack: {
      padding: 4,
    },
    headerBackText: {
      fontSize: 20,
      color: colors.textPrimary,
    },
    stepperContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    stepPill: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    stepPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    stepNumberWrapper: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.textSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 6,
    },
    stepNumberWrapperActive: {
      backgroundColor: colors.mainBackground,
    },
    stepNumber: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.mainBackground,
    },
    stepNumberActive: {
      color: colors.primary,
    },
    stepText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    stepTextActive: {
      color: colors.mainBackground,
    },
    content: {
      flex: 1,
    },
    titleSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    mainTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      height: 48,
    },
    searchIcon: {
      fontSize: 18,
      color: colors.textSecondary,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      height: "100%",
    },
    clearIcon: {
      padding: 4,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
    clearIconText: {
      fontSize: 10,
      fontWeight: "bold",
      color: colors.textSecondary,
    },
    listSectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginLeft: 20,
      marginBottom: 8,
    },
    listCategoryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listCategoryTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      flex: 1,
    },
    listCategoryBadge: {
      backgroundColor: colors.primary + "33", // 20% opacity
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    listCategoryBadgeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "bold",
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      marginBottom: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "transparent",
    },
    groupItemActive: {
      borderColor: colors.primary,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    groupNameActive: {
      // Optional highlight style
    },
    groupSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    radioCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    radioCircleActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkIcon: {
      color: colors.mainBackground,
      fontSize: 14,
      fontWeight: "bold",
    },
    checkboxSquare: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    checkboxSquareActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    bottomNav: {
      flexDirection: "row",
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
      backgroundColor: colors.mainBackground,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 16,
    },
    buttonSecondary: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondaryText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    buttonPrimary: {
      flex: 2,
      backgroundColor: colors.textPrimary,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    buttonPrimaryFull: {
      flex: 1,
    },
    buttonPrimaryText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.mainBackground,
    },
    arrowIcon: {
      fontSize: 16,
      color: colors.mainBackground,
      marginLeft: 8,
    },
    emptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: 20,
    }
  });
