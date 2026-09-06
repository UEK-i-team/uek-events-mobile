import { useFilters } from "@/features/filters/contexts";
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
import React, { useCallback, useEffect, useMemo, useRef } from "react";
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

  const isClosingRef = useRef(false);
  const sheetIndexRef = useRef<number>(-1);

  const {
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    clearFilters,
  } = useFilters();

  const { events, dictionaries } = React.useContext(EventContext);

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

  // ✅ OPEN / CLOSE
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      bottomSheetRef.current?.present();
    } else {
      if (sheetIndexRef.current !== -1 && !isClosingRef.current) {
        isClosingRef.current = true;
        bottomSheetRef.current?.dismiss();
      }
    }
  }, [isOpen]);

  // ✅ BACK BUTTON
  useFocusEffect(
    useCallback(() => {
      if (!isOpen) return;

      const onBackPress = () => {
        if (sheetIndexRef.current === -1) return true;

        if (isClosingRef.current) return true;

        isClosingRef.current = true;
        bottomSheetRef.current?.dismiss();

        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [isOpen])
  );

  // ✅ SYNC STATE
  const handleChange = useCallback(
    (index: number) => {
      sheetIndexRef.current = index;

      if (index === -1) {
        isClosingRef.current = false;
        trackEvent('filters_applied', {
          categories: selectedCategories.join(','),
          locations: selectedLocations.join(','),
          tags: selectedTags.join(',')
        });
        onClose();
      } else {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    },
    [onClose, selectedCategories, selectedLocations, selectedTags]
  );

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

const Checkbox = React.memo(({ label, selected, onToggle, value }: any) => {
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

const FilterTag = React.memo(({ tag, selected, onToggle }: any) => {
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
