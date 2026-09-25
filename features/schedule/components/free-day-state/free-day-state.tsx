import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { differenceInCalendarDays, format } from "date-fns";
import { pl } from "date-fns/locale";
import { useTheme } from "@/shared/context/ThemeContext";
import { IScheduleEvent } from "@/shared/types/schedule";
import { getStyles } from "./free-day-state.styles";

const illustration = require("@/assets/images/free-day.png");

interface FreeDayStateProps {
  /** The next class from the real current time, regardless of the selected day. */
  nextClass: IScheduleEvent | null;
  onJumpToClass: (date: Date) => void;
}

const describeDistance = (date: Date) => {
  const days = differenceInCalendarDays(date, new Date());
  if (days <= 0) return "dziś";
  if (days === 1) return "jutro";
  return `za ${days} dni`;
};

export const FreeDayState: React.FC<FreeDayStateProps> = ({ nextClass, onJumpToClass }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const start = nextClass ? new Date(nextClass.start_time) : null;
  const dateLabel = start ? format(start, "EEEE, d MMMM", { locale: pl }) : "";

  return (
    <View style={styles.container}>
      <Image source={illustration} style={styles.illustration} resizeMode="contain" />
      <Text style={styles.title}>Dzień wolny od zajęć</Text>

      {start ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onJumpToClass(start)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Przeskocz do najbliższych zajęć</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.nearestLabel}>Najbliższe zajęcia</Text>
          <Text style={styles.nearestValue}>
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} · {format(start, "H:mm")}
            <Text style={styles.nearestDistance}>  ({describeDistance(start)})</Text>
          </Text>
        </>
      ) : (
        <Text style={styles.subtitle}>Nie masz żadnych nadchodzących zajęć.</Text>
      )}
    </View>
  );
};
