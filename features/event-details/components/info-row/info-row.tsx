import React from "react";
import { View, Text, ViewStyle, StyleProp } from "react-native";
import { SvgProps } from "react-native-svg";
import { styles } from "./info-row.styles";
import { useTheme } from "@/shared/context/ThemeContext";

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
  iconColor,
  backgroundColor,
  style,
}: InfoRowProps) {
  const { isDarkMode, colors } = useTheme();
  const effectiveIconColor = iconColor || colors.textPrimary;
  const effectiveBgColor = backgroundColor || colors.light_grey;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: effectiveBgColor },
        style
      ]}
    >
      <IconComponent
        width={24}
        height={24}
        fill={effectiveIconColor}
        color={effectiveIconColor}
        style={{ color: effectiveIconColor }}
      />
      <View style={styles.textContainer}>
        {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : null}
        <Text style={[styles.text, { color: colors.textPrimary }]} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </View>
  );
}
