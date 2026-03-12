import React from "react";
import { View, Text, ViewStyle, StyleProp } from "react-native";
import { SvgProps } from "react-native-svg";
import { styles } from "./info-row.styles";

export interface InfoRowProps {
  icon: React.FC<SvgProps>;
  text: string;
  label?: string;
  iconColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function InfoRow({
  icon: IconComponent,
  text,
  label,
  iconColor = "#2C2C2C",
  backgroundColor,
  style,
}: InfoRowProps) {
  return (
    <View
      style={[styles.container, backgroundColor && { backgroundColor }, style]}
    >
      <IconComponent
        width={24}
        height={24}
        fill={iconColor}
        color={iconColor}
      />
      <View style={styles.textContainer}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </View>
  );
}
