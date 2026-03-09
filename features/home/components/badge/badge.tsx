import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./badge.styles";

interface BadgeProps {
  name: string;
  color: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({
  name,
  color,
  textColor = "#FFFFFF",
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{name}</Text>
    </View>
  );
}
