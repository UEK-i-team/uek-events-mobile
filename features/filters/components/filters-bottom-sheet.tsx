import { useFilters } from "@/features/filters/contexts";
import { createFiltersSheetController } from "@/features/filters/utils/filters-sheet-controller";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import {
  EventTag,
  eventTagTranslations,
} from "@/shared/types/event-enums";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@/shared/context/ThemeContext";
import { trackEvent } from "@/shared/services/analytics";

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({ isOpen, onClose }: FiltersBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<any>(null);
  const { colors } = useTheme();

  const {
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    clearFilters,
  } = useFilters();

  const { dictionaries } = React.useContext(EventContext);

  const availableCategories = useMemo(() => {
    if (!dictionaries?.event_types) return [];
    return Object.entries(dictionaries.event_types).map(([value, label]) => ({
      value,
      label,
    }));
  }, [dictionaries]);

  const availableLocations = useMemo(() => {
    if (!dictionaries?.event_location) return [];
    return Object.entries(dictionaries.event_location).map(([value, label]) => ({
      value,
      label,
    }));
  }, [dictionaries]);

  const snapPoints = useMemo(() => ["70%", "95%"], []);

  const handleClose = useCallback(
    (didDismiss: boolean) => {
      onClose();
      if (didDismiss) {
        trackEvent('filters_applied', {
          categories: selectedCategories.join(','),
          locations: selectedLocations.join(','),
          tags: selectedTags.join(',')
        });
      }
    },
    [onClose, selectedCategories, selectedLocations, selectedTags]
  );

  // Keep the controller stable while selections and the parent callback change.
  const handleCloseRef = useRef(handleClose);
  useLayoutEffect(() => {
    handleCloseRef.current = handleClose;
  }, [handleClose]);

  const [controller] = React.useState(() => createFiltersSheetController({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
    onClose: (didDismiss) => handleCloseRef.current(didDismiss),
  }));

  useFocusEffect(
    useCallback(() => {
      controller.setFocused(true);
      const sub = BackHandler.addEventListener("hardwareBackPress", controller.close);
      return () => {
        sub.remove();
        controller.setFocused(false);
      };
    }, [controller])
  );

  useEffect(() => {
    if (isOpen) {
      controller.open();
    } else {
      controller.close();
    }
  }, [controller, isOpen]);

  const handleChange = useCallback((index: number) => {
    controller.onChange(index);
    if (index >= 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [controller]);

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
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleChange}
      onAnimate={controller.onAnimate}
      onDismiss={controller.onDismiss}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.bg, { backgroundColor: colors.surface }]}
      handleIndicatorStyle={[styles.handle, { backgroundColor: colors.textSecondary }]}
    >
      <BottomSheetScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Filtry</ThemedText>
          <TouchableOpacity onPress={clearFilters}>
            <ThemedText style={{ color: colors.primary, fontSize: 14, fontWeight: "bold" }}>
              Wyczyść
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Section title="Typ wydarzenia">
          {availableCategories.map((c) => (
            <Checkbox
              key={c.value}
              label={c.label}
              value={c.value}
              selected={selectedCategories.includes(c.value)}
              onToggle={toggleCategory}
            />
          ))}
          {availableCategories.length === 0 && (
            <ThemedText style={{ color: colors.textSecondary, fontSize: 14 }}>
              Brak kategorii do wyboru
            </ThemedText>
          )}
        </Section>

        {/* LOCATION */}
        <Section title="Format">
          {availableLocations.map(({ value, label }) => (
            <Checkbox
              key={value}
              label={label}
              value={value}
              selected={selectedLocations.includes(value)}
              onToggle={toggleLocation}
            />
          ))}
          {availableLocations.length === 0 && (
            <ThemedText style={{ color: colors.textSecondary, fontSize: 14 }}>
              Brak formatów do wyboru
            </ThemedText>
          )}
        </Section>

        {/* TAGS */}
        <Section title="Tematy">
          <View style={styles.tags}>
            {Object.values(EventTag).map((tag) => (
              <FilterTag
                key={tag}
                tag={tag}
                selected={selectedTags.includes(tag)}
                onToggle={toggleTag}
              />
            ))}
          </View>
        </Section>

      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

// 🔥 UI helpers
function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

const Checkbox = React.memo(function Checkbox({ label, selected, onToggle, value }: any) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.row} onPress={() => onToggle(value)}>
      <View style={[styles.checkbox, { borderColor: colors.textSecondary }, selected && [styles.checkboxActive, { backgroundColor: colors.primary, borderColor: colors.primary }]]}>
        {selected && <MaterialIcons name="check" size={16} color="#fff" />}
      </View>
      <ThemedText>{label}</ThemedText>
    </TouchableOpacity>
  );
});

const FilterTag = React.memo(function FilterTag({ tag, selected, onToggle }: any) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onToggle(tag)}
      style={[
        styles.tag,
        { borderColor: colors.textSecondary },
        selected && [styles.tagActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
      ]}
    >
      <ThemedText style={{ color: selected ? "#fff" : colors.textPrimary }}>
        {eventTagTranslations[tag as EventTag]}
      </ThemedText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  bg: { backgroundColor: "#fff" },
  handle: { width: 40, height: 4, backgroundColor: "#687076" },

  title: { fontSize: 24, fontWeight: "700" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, marginBottom: 10 },

  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: theme.light.primary,
    borderColor: theme.light.primary,
  },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tagActive: {
    backgroundColor: "#0066FF",
    borderColor: "#0066FF",
  },
});
