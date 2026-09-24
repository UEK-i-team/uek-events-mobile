import { StyleSheet } from "react-native";

import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 28,
      fontWeight: "700",
      paddingHorizontal: 20,
      color: colors.textPrimary,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    itemText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
