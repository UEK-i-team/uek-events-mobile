import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeHeaderProps {
  headerHeight: number;
}

export function HomeHeader({ headerHeight }: HomeHeaderProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          paddingTop: insets.top > 0 ? 8 : 12,
        },
      ]}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText
          type="title"
          style={[
            styles.appName,
            {
              color: textColor,
            },
          ]}>
          UEK Events
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: 60
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

