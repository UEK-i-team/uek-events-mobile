import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: 12,
    },
    text: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "400",
      marginBottom: 8,
    },
    line: {
      height: 1,
      backgroundColor: colors.border,
      width: "100%",
    },
  });
