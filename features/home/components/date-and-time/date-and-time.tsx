import {
  formatEventDate,
  formatEventTime,
} from "@/utils/functions/date-utils";
import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import { theme } from "@/shared/constants/theme";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./date-and-time.styles";

interface DateAndTimeProps {
  dateISO: string;
  style?: StyleProp<ViewStyle>;
}

export function DateAndTime({ dateISO, style }: DateAndTimeProps) {
  const date = formatEventDate(dateISO);
  const time = formatEventTime(dateISO);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.section}>
        <CalendarIcon
          width={22}
          height={22}
          fill={theme.light.dark_grey}
          color={theme.light.dark_grey}
        />
        <Text style={styles.text}>{date}</Text>
      </View>
      <View style={styles.section}>
        <ClockIcon
          width={22}
          height={22}
          fill={theme.light.dark_grey}
          color={theme.light.dark_grey}
        />
        <Text style={styles.text}>{time}</Text>
      </View>
    </View>
  );
}
