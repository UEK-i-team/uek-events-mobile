import { StyleSheet } from "react-native";

import { AppThemeColors } from "@/shared/constants/theme";

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 24,
    },
    iconBadge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      backgroundColor: `${colors.primary}1F`,
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textMuted,
      textAlign: "center",
      marginBottom: 20,
    },
    emailHighlight: {
      color: colors.textPrimary,
      fontWeight: "700",
    },
    hintCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.mainBackgroundLighter,
      marginBottom: 24,
    },
    hintTextContainer: {
      flex: 1,
      gap: 4,
    },
    hintTitle: {
      fontSize: 14,
      lineHeight: 19,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    hintText: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted,
    },
    hintHighlight: {
      fontWeight: "700",
      color: colors.textSecondary,
    },
    codeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 16,
    },
    codeCell: {
      flex: 1,
      maxWidth: 56,
      aspectRatio: 0.82,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.mainBackgroundDarker,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    codeCellFilled: {
      borderColor: colors.textMuted,
    },
    codeCellActive: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    codeCellError: {
      borderColor: colors.red_regular,
    },
    codeDigit: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    hiddenInput: {
      ...StyleSheet.absoluteFillObject,
      color: "transparent",
      fontSize: 1,
    },
    button: {
      flexDirection: "row",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 17,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    secondaryActions: {
      marginTop: 20,
      alignItems: "center",
      gap: 4,
    },
    secondaryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: "600",
    },
    secondaryButtonTextAccent: {
      color: colors.primary,
    },
    secondaryButtonTextDisabled: {
      color: colors.textMuted,
      fontWeight: "500",
    },
    errorText: {
      color: colors.red_regular,
      fontSize: 14,
      textAlign: "center",
      marginBottom: 8,
    },
    infoText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginBottom: 8,
    },
  });
