import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    handleIndicator: {
      width: 40,
      height: 4,
      backgroundColor: colors.textMuted,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    typeBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 12,
    },
    typeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    typeBadgeText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      lineHeight: 28,
      color: colors.textPrimary,
      marginBottom: 20,
    },
    infoCard: {
      backgroundColor: colors.mainBackgroundLighter,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 14,
    },
    infoRowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.textMuted,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    infoTrailing: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textMuted,
    },
    notesCard: {
      marginTop: 12,
      backgroundColor: colors.mainBackgroundLighter,
      borderRadius: 16,
      padding: 16,
    },
    notesLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    notesText: {
      fontSize: 15,
      lineHeight: 21,
      color: colors.textPrimary,
    },
  });
