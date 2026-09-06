import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import { styles } from "./badge.styles";

interface BadgeProps {
  name: string;
  color: string;
  textColor?: string;
  icon?: React.FC<SvgProps>;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  size?: "small" | "medium";
}

export function Badge({
  name,
  color,
  textColor = "#FFFFFF",
  icon: Icon,
  iconColor,
  style,
  size = "medium",
}: BadgeProps) {
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        isSmall && styles.badgeSmall,
        { backgroundColor: color },
        style,
      ]}
    >
      {Icon && (
        <Icon
          width={isSmall ? 13 : 14}
          height={isSmall ? 13 : 14}
          color={iconColor || textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          isSmall && styles.textSmall,
          { color: textColor },
        ]}
      >
        {name}
      </Text>
    </View>
  );
}
