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
      padding: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  });
