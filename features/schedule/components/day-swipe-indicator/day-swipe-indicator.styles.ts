import { StyleSheet } from "react-native";
import { AppThemeColors } from "@/shared/constants/theme";

export const RING_SIZE = 30;
export const RING_STROKE = 3;

export const getStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
    },
    containerPrevious: {
      top: 12,
    },
    containerNext: {
      bottom: 16,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
      paddingLeft: 8,
      paddingRight: 16,
      borderRadius: 999,
      backgroundColor: colors.mainBackgroundLighter,
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    ring: {
      width: RING_SIZE,
      height: RING_SIZE,
      alignItems: "center",
      justifyContent: "center",
    },
    ringIcon: {
      position: "absolute",
    },
    title: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
