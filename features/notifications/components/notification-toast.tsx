import React, { useContext, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationContext } from '../contexts/notification-context';
import { NotificationType } from '../types';
import { useTheme } from '@/shared/context/ThemeContext';

const notificationIcons: Record<NotificationType, string | null> = {
  info: null,
  success: '✓',
  error: '✕',
  loading: '⟳',
};

const iconColors: Record<NotificationType, { light: string; dark: string }> = {
  info: { light: '#3B82F6', dark: '#60A5FA' },
  success: { light: '#059669', dark: '#34D399' },
  error: { light: '#DC2626', dark: '#F87171' },
  loading: { light: '#7C3AED', dark: '#A78BFA' },
};

export const NotificationToastContainer: React.FC = () => {
  const context = useContext(NotificationContext);
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const currentNotification = context?.currentNotification;

  useEffect(() => {
    if (currentNotification) {
      // Animate in - szybka, wyskakująca, subtelna
      translateY.value = withSpring(0, {
        damping: 8,
        stiffness: 180,
        mass: 0.3,
      });
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Animate out
      translateY.value = withTiming(-100, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [currentNotification]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!currentNotification) return null;

  const icon = notificationIcons[currentNotification.type];
  const iconColor = isDarkMode
    ? iconColors[currentNotification.type].dark
    : iconColors[currentNotification.type].light;
  const topOffset = insets.top + 10;

  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: colors.mainBackground,
            borderColor: isDarkMode ? colors.textMuted : colors.border,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.content}>
          {icon && (
            <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
          )}
          <Text style={[styles.message, { color: colors.textPrimary }]} numberOfLines={2}>
            {currentNotification.message}
          </Text>
        </View>
        {currentNotification.type === 'loading' && (
          <View style={styles.loadingIndicator}>
            <View style={[styles.spinner, { borderColor: colors.textPrimary, borderTopColor: 'transparent' }]} />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    ...Platform.select({
      web: {
        position: 'fixed' as any,
      },
    }),
  },
  toast: {
    maxWidth: '90%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    flexShrink: 1,
  },
  loadingIndicator: {
    marginTop: 8,
    alignItems: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});

