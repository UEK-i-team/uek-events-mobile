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
    subtitleLead: {
      fontSize: 17,
      lineHeight: 24,
      color: '#111',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    subtitleWithoutMargin: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    subtitleBold: {
      fontWeight: "700",
      color: colors.textPrimary,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      letterSpacing: 0,
      textAlign: "left",
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
