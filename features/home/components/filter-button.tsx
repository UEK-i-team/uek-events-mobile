import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { FilterOption } from '@/shared/types/event';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FilterButtonProps {
  filter: FilterOption;
  isSelected: boolean;
  onPress: (filterId: string) => void;
}

export function FilterButton({ filter, isSelected, onPress }: FilterButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tintColor = isDark ? Colors.dark.tint :'#3DE60F';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isSelected
            ? tintColor
            : isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : '#EDFFE8',
        },
        isSelected && styles.buttonSelected,
      ]}
      onPress={() => onPress(filter.id)}
      activeOpacity={0.7}>
      <ThemedText
        style={[
          styles.text,
        ]}>
        {filter.label}
      </ThemedText>
    </TouchableOpacity>
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
    borderColor: '#3DE60F',
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
    fontWeight: '600',
  },
});

