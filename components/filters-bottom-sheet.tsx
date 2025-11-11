import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({ isOpen, onClose }: FiltersBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  React.useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.bottomSheetBackground, { backgroundColor }]}
      handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colorScheme === 'dark' ? '#9BA1A6' : '#687076' }]}
    >
      <BottomSheetScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Filtry</ThemedText>
        </ThemedView>

        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Kategoria</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Wszystkie kategorie</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Data</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Wszystkie daty</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Lokalizacja</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Wszystkie lokalizacje</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Typ wydarzenia</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Wszystkie typy</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>

        {/* Dodatkowa zawartość do testowania scrollowania */}
        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Dodatkowe opcje</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Opcja 1</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Opcja 2</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Opcja 3</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle">Więcej opcji</ThemedText>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Opcja 4</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
          <ThemedView style={styles.filterOption}>
            <ThemedText>Opcja 5</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#808080" />
          </ThemedView>
        </ThemedView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 20,
  },
  bottomSheetBackground: {
    // backgroundColor will be set dynamically
  },
  handleIndicator: {
    // backgroundColor will be set dynamically
    width: 40,
    height: 4,
  },
  header: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
    gap: 12,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
});

