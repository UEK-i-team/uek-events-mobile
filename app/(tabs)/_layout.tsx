import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';

import { BookmarkIcon, FilterIcon, HomeIcon, ProfileIcon } from '@/assets/icons';
import { HapticTab } from '@/components/haptic-tab';
import { SvgIcon } from '@/components/ui/svg-icon';
import { Colors } from '@/constants/theme';
import { useFilters } from '@/contexts/filters-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function FiltersTabButton(props: BottomTabBarButtonProps) {
  const { openFilters } = useFilters();

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPress={() => {
        openFilters();
      }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Strona główna',
          tabBarIcon: ({ color }) => <SvgIcon Icon={HomeIcon} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Zapisane',
          tabBarIcon: ({ color }) => <SvgIcon Icon={BookmarkIcon} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          title: 'Filtry',
          tabBarIcon: ({ color }) => <SvgIcon Icon={FilterIcon} size={28} color={color} />,
          tabBarButton: FiltersTabButton,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <SvgIcon Icon={ProfileIcon} size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
