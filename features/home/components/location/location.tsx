import LocationIcon from "@/assets/icons/location.svg";
import { theme } from "@/shared/constants/theme";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./location.styles";

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
  return (
    <View style={[styles.container, style]}>
      <LocationIcon
        width={22}
        height={22}
        fill={theme.light.dark_grey}
        color={theme.light.dark_grey}
      />
      <Text style={styles.text}>
        {locationCategory} - {registrationType}
      </Text>
    </View>
  );
}
