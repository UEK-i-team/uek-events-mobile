import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./break-divider.styles";

interface BreakDividerProps {
  durationMinutes: number;
}

const LONG_BREAK_MINUTES = 60;

export function formatBreakDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} godz.`;
  return `${hours} godz. ${minutes} min`;
}

export const BreakDivider: React.FC<BreakDividerProps> = ({ durationMinutes }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const isLongBreak = durationMinutes >= LONG_BREAK_MINUTES;
  const label = isLongBreak ? "Okienko" : "Przerwa";
  const duration = formatBreakDuration(durationMinutes);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${label}, ${duration}`}
    >
      <View style={styles.line} />
      <View style={styles.pill}>
        <Ionicons
          name={isLongBreak ? "hourglass-outline" : "cafe-outline"}
          size={14}
          color={colors.textSecondary}
        />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.dot} />
        <Text style={styles.duration}>{duration}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};
