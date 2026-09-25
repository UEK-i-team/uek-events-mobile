import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingBottom: 24,
    },
    illustration: {
      width: "100%",
      maxWidth: 280,
      height: undefined,
      aspectRatio: 1.2,
      marginBottom: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 21,
      color: colors.textMuted,
      textAlign: "center",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      alignSelf: "stretch",
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      marginBottom: 14,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    nearestLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
    nearestValue: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      textAlign: "center",
    },
    nearestDistance: {
      fontWeight: "400",
      color: colors.textMuted,
    },
  });
