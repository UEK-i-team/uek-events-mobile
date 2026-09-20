import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.mainBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "85%",
      paddingTop: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 16,
      color: colors.primary,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textPrimary,
      marginTop: 16,
      marginBottom: 8,
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    groupCode: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 16,
    },
    checkboxSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    innerCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.mainBackground,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 20,
      marginBottom: 16,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      flex: 1,
    },
    categoryBadge: {
      backgroundColor: colors.primary + "33", // 20% opacity
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "bold",
    },
  });
