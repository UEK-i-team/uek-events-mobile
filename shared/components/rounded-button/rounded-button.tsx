import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";
import {
  getSizeConfig,
  RoundedButtonSize,
  styles,
} from "./rounded-button.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RoundedButtonProps extends Omit<PressableProps, "style"> {
  /** SVG component imported from assets/icons/ */
  icon: React.FC<SvgProps>;
  /** Icon color (passed as fill/stroke to SVG) */
  iconColor?: string;
  /** Button background color */
  backgroundColor?: string;
  /** Predefined size variant */
  size?: RoundedButtonSize;
  /** Custom styles */
  style?: StyleProp<ViewStyle>;
}

export function RoundedButton({
  icon: IconComponent,
  iconColor = "#2C2C2C",
  backgroundColor = "#F0EDEA",
  size = "medium",
  style: customStyle,
  onPress,
  ...rest
}: RoundedButtonProps) {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sizeConfig = getSizeConfig(size);

  const timingConfig = {
    duration: 100,
    easing: Easing.out(Easing.ease),
  };

  const handlePressIn = () => {
    opacity.value = withTiming(0.5, timingConfig);
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.borderRadius,
          backgroundColor,
        },
        animatedStyle,
        customStyle,
      ]}
      {...rest}
    >
      <IconComponent
        width={sizeConfig.icon}
        height={sizeConfig.icon}
        fill={iconColor}
        color={iconColor}
      />
    </AnimatedPressable>
  );
}
