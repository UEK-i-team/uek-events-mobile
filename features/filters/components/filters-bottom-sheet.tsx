import { useFilters } from "@/features/filters/contexts";
import { ThemedText } from "@/shared/components/themed-text";
import {
  EventCategory,
  EventLocation,
  EventTag,
  eventCategoryTranslations,
  eventTagTranslations,
} from "@/shared/types/event-enums";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({
  isOpen,
  onClose,
}: FiltersBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<any>(null);
  const backgroundColor = "#FFFFFF";
  const textColor = "#000000";
  const {
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    clearFilters,
  } = useFilters();

  // Snap points: 70% jako początkowy, 95% jako pełny ekran
  const snapPoints = useMemo(() => ["70%", "95%"], []);

  // Kontrolowany index - otwarty = 0, zamknięty = -1
  const sheetIndex = useMemo(() => (isOpen ? 0 : -1), [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 100);
    } else {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isOpen]);

  // Obsługa przycisku wstecz na Androidzie
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1 && isOpen) {
        onClose();
      }
    },
    [onClose, isOpen],
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
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={sheetIndex}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.bottomSheetBackground, { backgroundColor }]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: "#687076" },
      ]}
    >
      <BottomSheetScrollView
        ref={scrollViewRef}
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={[styles.headerTitle, { color: textColor }]}
          >
            Filtry
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Typ wydarzenia (EventCategory) */}
        <View style={styles.filterSection}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Typ wydarzenia
          </ThemedText>
          <View style={styles.checkboxList}>
            {Object.values(EventCategory).map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={styles.checkboxOption}
                  onPress={() => {
                    toggleCategory(category);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected ? "#0066FF" : "transparent",
                        borderColor: isSelected ? "#0066FF" : "#CCCCCC",
                      },
                    ]}
                  >
                    {isSelected && (
                      <MaterialIcons name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <ThemedText
                    style={[styles.checkboxLabel, { color: textColor }]}
                  >
                    {eventCategoryTranslations[category]}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Format (EventLocation) */}
        <View style={styles.filterSection}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Format
          </ThemedText>
          <View style={styles.checkboxList}>
            {[
              { location: EventLocation.OnUekCampus, label: "Stacjonarne" },
              { location: EventLocation.Online, label: "Online" },
              { location: EventLocation.Hybrid, label: "Hybrydowe" },
            ].map(({ location, label }) => {
              const isSelected = selectedLocations.includes(location);
              return (
                <TouchableOpacity
                  key={location}
                  style={styles.checkboxOption}
                  onPress={() => toggleLocation(location)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected ? "#0066FF" : "transparent",
                        borderColor: isSelected ? "#0066FF" : "#CCCCCC",
                      },
                    ]}
                  >
                    {isSelected && (
                      <MaterialIcons name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <ThemedText
                    style={[styles.checkboxLabel, { color: textColor }]}
                  >
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tematy (EventTag) */}
        <View style={styles.filterSection}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Tematy
          </ThemedText>
          <View style={styles.tagsContainer}>
            {Object.values(EventTag).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isSelected ? "#0066FF" : "#F5F5F5",
                      borderColor: isSelected ? "#0066FF" : "#CCCCCC",
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.tagText,
                      {
                        color: isSelected ? "#FFFFFF" : "#000000",
                      },
                    ]}
                  >
                    {eventTagTranslations[tag]}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Przycisk wyczyść */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: "#FFFFFF",
                borderColor: "#CCCCCC",
              },
            ]}
            onPress={clearFilters}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.clearButtonText, { color: textColor }]}>
              Wyczyść
            </ThemedText>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  bottomSheetBackground: {
    // backgroundColor will be set dynamically
  },
  handleIndicator: {
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  checkboxList: {
    gap: 12,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    marginBottom: 20,
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
