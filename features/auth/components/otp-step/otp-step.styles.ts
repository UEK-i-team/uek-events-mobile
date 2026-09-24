import { StyleSheet } from "react-native";

import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    emailHighlight: {
      color: colors.textPrimary,
      fontWeight: "600",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 24,
      letterSpacing: 8,
      textAlign: "center",
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButton: {
      marginTop: 16,
      alignItems: "center",
      paddingVertical: 8,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    resendText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 8,
    },
    errorText: {
      color: colors.red_regular,
      fontSize: 14,
      marginBottom: 8,
    },
    infoText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 8,
    },
  });
