import { StyleSheet } from "react-native";

import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    hero: {
      width: "100%",
      height: undefined,
      aspectRatio: 1.5,
      borderRadius: 24,
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    lead: {
      fontSize: 16,
      lineHeight: 23,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    features: {
      gap: 10,
      marginBottom: 24,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.mainBackgroundLighter,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.primary}1F`,
    },
    featureText: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    featureDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted,
    },
    featureDescriptionStrong: {
      fontWeight: "700",
      color: colors.textPrimary,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: colors.mainBackgroundDarker,
      borderRadius: 16,
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
    },
    inputWrapperError: {
      borderColor: colors.red_regular,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.textPrimary,
    },
    button: {
      flexDirection: "row",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 17,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    errorText: {
      color: colors.red_regular,
      fontSize: 14,
      marginBottom: 8,
      marginLeft: 4,
    },
    infoText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 8,
      marginLeft: 4,
    },
  });
