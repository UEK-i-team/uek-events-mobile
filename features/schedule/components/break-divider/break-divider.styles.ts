import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
      opacity: 0.15,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: colors.mainBackgroundLighter,
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.textMuted,
    },
    duration: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
