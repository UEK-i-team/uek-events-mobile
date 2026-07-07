import LocationIcon from "@/assets/icons/location.svg";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./location.styles";
import { useTheme } from "@/shared/context/ThemeContext";

interface LocationProps {
  locationCategory: string;
  registrationType: string;
  style?: StyleProp<ViewStyle>;
}

export function Location({
  locationCategory,
  registrationType,
  style,
}: LocationProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <LocationIcon
        width={22}
        height={22}
        fill={colors.textSecondary}
        color={colors.textSecondary}
      />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {locationCategory} - {registrationType}
      </Text>
    </View>
  );
}
