import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useFilters } from "@/features/filters/contexts/filters-context";
import { HapticTab } from "@/shared/components/haptic-tab/haptic-tab";
import { SvgIcon } from "@/shared/components/svg-icon/svg-icon";
import { useTheme } from "@/shared/context/ThemeContext";

// import icons
import FilterIconOutline from "@/assets/icons/filter-icon-outline.svg";
import HeartIconFilled from "@/assets/icons/heart-icon-filled.svg";
import HeartIconOutline from "@/assets/icons/heart-icon-outline.svg";
import HomeIconFilled from "@/assets/icons/home-icon-filled.svg";
import HomeIconOutline from "@/assets/icons/home-icon-outline.svg";
import InfoIconFilled from "@/assets/icons/info-icon-filled.svg";
import InfoIconOutline from "@/assets/icons/info-icon-outline.svg";

const AnimatedPressable = Animated.createAnimatedComponent(PlatformPressable);

function FiltersTabButton(props: BottomTabBarButtonProps) {
  const { openFilters } = useFilters();
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
    if (process.env.EXPO_OS === "ios") {
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
      onPress={() => {
        openFilters();
      }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {
          fontWeight: "300",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Strona główna",
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              Icon={focused ? HomeIconFilled : HomeIconOutline}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Zapisane",
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              Icon={focused ? HeartIconFilled : HeartIconOutline}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          title: "Filtry",
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon Icon={FilterIconOutline} size={24} color={color} />
          ),
          tabBarButton: FiltersTabButton,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              Icon={focused ? InfoIconFilled : InfoIconOutline}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
