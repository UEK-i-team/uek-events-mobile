import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./class-card.styles";

interface ClassCardProps {
  timeRange: string;
  room: string;
  title: string;
  type: string;
  professor: string;
  borderColor: string;
  roomDotColor: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  timeRange,
  room,
  title,
  type,
  professor,
  borderColor,
  roomDotColor,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.leftStrip, { backgroundColor: borderColor }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.timeText}>{timeRange}</Text>
          <View style={styles.roomContainer}>
            <Text style={styles.roomText}>{room}</Text>
            <View style={[styles.roomDot, { backgroundColor: roomDotColor }]} />
          </View>
        </View>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.footerContainer}>
          <Text style={styles.typeText}>{type}</Text>
          <Text style={styles.professorText}>{professor}</Text>
        </View>
      </View>
    </View>
  );
};
