import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/schedule.svg";
import { theme } from "@/shared/constants/theme";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./date-and-time.styles";

const DAYS_SHORT = ["niedz", "pon", "wt", "śr", "czw", "pt", "sob"];
const MONTHS_SHORT = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = DAYS_SHORT[date.getDay()];
  const dayNum = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} - ${dayNum} ${month}`;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

interface DateAndTimeProps {
  dateISO: string;
  style?: StyleProp<ViewStyle>;
}

export function DateAndTime({ dateISO, style }: DateAndTimeProps) {
  const date = formatDate(dateISO);
  const time = formatTime(dateISO);

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
