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

interface NotificationConfig {
  backgroundColor: string;
  textColor: string;
  icon: string | null;
}

const notificationConfigs: Record<NotificationType, NotificationConfig> = {
  info: {
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    icon: null,
  },
  success: {
    backgroundColor: '#10B981',
    textColor: '#FFFFFF',
    icon: '✓',
  },
  error: {
    backgroundColor: '#EF4444',
    textColor: '#FFFFFF',
    icon: '✕',
  },
  loading: {
    backgroundColor: '#8B5CF6',
    textColor: '#FFFFFF',
    icon: '⟳',
  },
};

export const NotificationToastContainer: React.FC = () => {
  const context = useContext(NotificationContext);
  const insets = useSafeAreaInsets();

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

  const config = notificationConfigs[currentNotification.type];
  const topOffset = insets.top + 10;

  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: config.backgroundColor },
          animatedStyle,
        ]}
      >
        <View style={styles.content}>
          {config.icon && (
            <Text style={styles.icon}>{config.icon}</Text>
          )}
          <Text style={[styles.message, { color: config.textColor }]} numberOfLines={2}>
            {currentNotification.message}
          </Text>
        </View>
        {currentNotification.type === 'loading' && (
          <View style={styles.loadingIndicator}>
            <View style={styles.spinner} />
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
    borderRadius: 12,
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
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
  },
});

