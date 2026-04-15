import { useFilters } from "@/features/filters/contexts";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import {
  EventCategory,
  EventLocation,
  EventTag,
  eventCategoryTranslations,
  eventTagTranslations,
} from "@/shared/types/event-enums";
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

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({ isOpen, onClose }: FiltersBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<any>(null);

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
        onClose();
      } else {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    },
    [onClose]
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
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>Filtry</ThemedText>

        {/* CATEGORY */}
        <Section title="Typ wydarzenia">
          {Object.values(EventCategory).map((c) => (
            <Checkbox
              key={c}
              label={eventCategoryTranslations[c]}
              selected={selectedCategories.includes(c)}
              onPress={() => toggleCategory(c)}
            />
          ))}
        </Section>

        {/* LOCATION */}
        <Section title="Format">
          {[
            { value: EventLocation.OnUekCampus, label: "Stacjonarne" },
            { value: EventLocation.Online, label: "Online" },
            { value: EventLocation.Hybrid, label: "Hybrydowe" },
          ].map(({ value, label }) => (
            <Checkbox
              key={value}
              label={label}
              selected={selectedLocations.includes(value)}
              onPress={() => toggleLocation(value)}
            />
          ))}
        </Section>

        {/* TAGS */}
        <Section title="Tematy">
          <View style={styles.tags}>
            {Object.values(EventTag).map((tag) => {
              const selected = selectedTags.includes(tag);

              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tag, selected && styles.tagActive]}
                >
                  <ThemedText style={{ color: selected ? "#fff" : "#000" }}>
                    {eventTagTranslations[tag]}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <TouchableOpacity style={styles.clear} onPress={clearFilters}>
          <ThemedText>Wyczyść</ThemedText>
        </TouchableOpacity>
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

function Checkbox({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.checkbox, selected && styles.checkboxActive]}>
        {selected && <MaterialIcons name="check" size={16} color="#fff" />}
      </View>
      <ThemedText>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  bg: { backgroundColor: "#fff" },
  handle: { width: 40, height: 4, backgroundColor: "#687076" },

  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
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

  clear: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
  },
});
