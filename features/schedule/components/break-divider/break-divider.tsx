import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./break-divider.styles";

interface BreakDividerProps {
  durationText: string;
}

export const BreakDivider: React.FC<BreakDividerProps> = ({ durationText }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{durationText}</Text>
      <View style={styles.line} />
    </View>
  );
};
