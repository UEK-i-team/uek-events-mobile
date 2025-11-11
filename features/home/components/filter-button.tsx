import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { FilterOption } from '@/shared/types/event';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface FilterButtonProps {
  filter: FilterOption;
  isSelected: boolean;
  onPress: (filterId: string) => void;
}

export function FilterButton({ filter, isSelected, onPress }: FilterButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tintColor = isDark ? Colors.dark.tint :'#0053F4';

  // Animacja scale
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 100,
    });
  };

  return (
    <Animated.View style={[animatedStyle, { flexShrink: 0, alignSelf: 'flex-start' }]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isSelected
              ? tintColor
              : isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : '#FBFBFB',
          },
          isSelected && styles.buttonSelected,
        ]}
        onPress={() => onPress(filter.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}>
        <ThemedText
          style={[
            styles.text,
            {
              color: isSelected
                ? '#fff' : '#111'
            },
          ]}>
          {filter.label}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 0,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '',
    borderColor: '#ECECEC',
    flexShrink: 0,
    alignSelf: 'flex-start',
    flexWrap: 'nowrap',
  },
  buttonSelected: {
    shadowColor: '#0a7ea4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
});

