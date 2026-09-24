import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/shared/components/haptic-tab/haptic-tab";
import { SvgIcon } from "@/shared/components/svg-icon/svg-icon";
import { useTheme } from "@/shared/context/ThemeContext";

// import icons
import HeartIconFilled from "@/assets/icons/heart-icon-filled.svg";
import HeartIconOutline from "@/assets/icons/heart-icon-outline.svg";
import HomeIconFilled from "@/assets/icons/home-icon-filled.svg";
import HomeIconOutline from "@/assets/icons/home-icon-outline.svg";
import InfoIconFilled from "@/assets/icons/info-icon-filled.svg";
import InfoIconOutline from "@/assets/icons/info-icon-outline.svg";
import ScheduleIconFilled from "@/assets/icons/schedule-icon-filled.svg";
import ScheduleIconOutline from "@/assets/icons/schedule-icon-outline.svg";

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
        name="schedule"
        options={{
          title: "Plan zajęć",
          tabBarIcon: ({ color, focused }) => (
            <SvgIcon
              Icon={focused ? ScheduleIconFilled : ScheduleIconOutline}
              size={24}
              color={color}
            />
          ),
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
