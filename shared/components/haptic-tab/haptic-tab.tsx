import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(PlatformPressable);

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (ev: any) => {
    scale.value = withTiming(0.95, {
      duration: 100,
    });
    if (process.env.EXPO_OS === 'ios') {
      // Add a soft haptic feedback when pressing down on the tabs.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    props.onPressIn?.(ev);
  };

  const handlePressOut = (ev: any) => {
    scale.value = withTiming(1, {
      duration: 100,
    });
    props.onPressOut?.(ev);
  };

  return (
    <AnimatedPressable
      {...props}
      style={[props.style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  );
}
