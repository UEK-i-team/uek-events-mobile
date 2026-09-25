import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingBottom: 32,
    },
    illustration: {
      width: "100%",
      maxWidth: 320,
      height: undefined,
      aspectRatio: 1.2,
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 21,
      color: colors.textMuted,
      textAlign: "center",
      maxWidth: 300,
      marginBottom: 28,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      alignSelf: "stretch",
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
    },
  });
