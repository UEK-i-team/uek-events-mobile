import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./schedule-empty-state.styles";

const illustration = require("@/assets/images/configure-schedule.png");

interface ScheduleEmptyStateProps {
  onConfigure: () => void;
}

export const ScheduleEmptyState: React.FC<ScheduleEmptyStateProps> = ({ onConfigure }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Image source={illustration} style={styles.illustration} resizeMode="contain" />
      <Text style={styles.title}>Skonfiguruj swój plan zajęć</Text>
      <Text style={styles.subtitle}>
        Wybierz grupę dziekańską, języki i WF, a Twoje zajęcia pojawią się tutaj.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onConfigure}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.buttonText}>Skonfiguruj plan zajęć</Text>
      </TouchableOpacity>
    </View>
  );
};
