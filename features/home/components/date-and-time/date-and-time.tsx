import {
  formatEventDate,
  formatEventTime,
} from "@/utils/functions/date-utils";
import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./date-and-time.styles";
import { useTheme } from "@/shared/context/ThemeContext";

interface DateAndTimeProps {
  dateISO: string;
  style?: StyleProp<ViewStyle>;
}

export function DateAndTime({ dateISO, style }: DateAndTimeProps) {
  const { colors } = useTheme();
  const date = formatEventDate(dateISO);
  const time = formatEventTime(dateISO);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.section}>
        <CalendarIcon
          width={22}
          height={22}
          fill={colors.textSecondary}
          color={colors.textSecondary}
        />
        <Text style={[styles.text, { color: colors.textSecondary }]}>{date}</Text>
      </View>
      <View style={styles.section}>
        <ClockIcon
          width={22}
          height={22}
          fill={colors.textSecondary}
          color={colors.textSecondary}
        />
        <Text style={[styles.text, { color: colors.textSecondary }]}>{time}</Text>
      </View>
    </View>
  );
}
