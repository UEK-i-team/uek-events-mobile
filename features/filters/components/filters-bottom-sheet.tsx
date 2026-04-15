import { useFilters } from "@/features/filters/contexts";
import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({
  isOpen,
  onClose,
}: FiltersBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
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
    applyFilters,
    clearFilters,
  } = useFilters();

  const { events, dictionaries } = useContext(EventContext);

  // Zbieranie opcji z dostępnych eventów i ich liczenie z uwzględnieniem aktywnych filtrów
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events?.forEach(e => {
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(e.location_category);
      const matchTag = selectedTags.length === 0 || selectedTags.some(t => e.tags?.includes(t));
      if (matchLocation && matchTag && e.event_type) {
        counts[e.event_type] = (counts[e.event_type] || 0) + 1;
      }
    });
    return counts;
  }, [events, selectedLocations, selectedTags]);

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events?.forEach(e => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(e.event_type);
      const matchTag = selectedTags.length === 0 || selectedTags.some(t => e.tags?.includes(t));
      if (matchCategory && matchTag && e.location_category) {
        counts[e.location_category] = (counts[e.location_category] || 0) + 1;
      }
    });
    return counts;
  }, [events, selectedCategories, selectedTags]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events?.forEach(e => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(e.event_type);
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(e.location_category);
      if (matchCategory && matchLocation && e.tags) {
        e.tags.forEach(tag => {
          if (tag) counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return counts;
  }, [events, selectedCategories, selectedLocations]);

  const availableCategories = Object.keys(categoryCounts);
  const availableLocations = Object.keys(locationCounts);
  const availableTags = Object.keys(tagCounts);

  // Pobieranie wszystkich opcji ze słowników
  const allCategories = Object.values(dictionaries?.event_types || {});
  const allLocations = Object.values(dictionaries?.event_location || {});
  const allTags = Object.values(dictionaries?.tags || {});

  // Sortowanie: najpierw dostępne, potem niedostępne
  const renderCategories = [
    ...availableCategories,
    ...allCategories.filter((c) => !availableCategories.includes(c)),
  ];

  const renderLocations = [
    ...availableLocations,
    ...allLocations.filter((l) => !availableLocations.includes(l)),
  ];

  const renderTags = [
    ...availableTags,
    ...allTags.filter((t) => !availableTags.includes(t)),
  ];

  // Snap points: 70% jako początkowy, 95% jako pełny ekran
  const snapPoints = useMemo(() => ["70%", "95%"], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      bottomSheetRef.current?.dismiss();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
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
    <BottomSheetModal
      ref={bottomSheetRef}
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
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={[styles.headerTitle, { color: textColor }]}
          >
            Filtry
          </ThemedText>
        </View>
        
        {renderCategories.length > 0 && (
          <View style={styles.filterSection}>
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Typ wydarzenia
            </ThemedText>
            <View style={styles.checkboxList}>
              {renderCategories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const count = categoryCounts[category] || 0;
                const isAvailable = count > 0;
                
                return (
                  <TouchableOpacity
                    key={category}
                    style={[styles.checkboxOption, !isAvailable && { opacity: 0.5 }]}
                    onPress={() => isAvailable && toggleCategory(category)}
                    activeOpacity={isAvailable ? 0.7 : 1}
                    disabled={!isAvailable}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected
                              ? theme.light.primary
                              : "transparent",
                          borderColor: isSelected
                              ? theme.light.primary
                              : "#CCCCCC",
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
                      {category} ({count})
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {renderLocations.length > 0 && (
          <View style={styles.filterSection}>
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Format
            </ThemedText>
            <View style={styles.checkboxList}>
              {renderLocations.map((location) => {
                const isSelected = selectedLocations.includes(location);
                const count = locationCounts[location] || 0;
                const isAvailable = count > 0;

                return (
                  <TouchableOpacity
                    key={location}
                    style={[styles.checkboxOption, !isAvailable && { opacity: 0.5 }]}
                    onPress={() => isAvailable && toggleLocation(location)}
                    activeOpacity={isAvailable ? 0.7 : 1}
                    disabled={!isAvailable}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected 
                              ? theme.light.primary 
                              : "transparent",
                          borderColor: isSelected 
                              ? theme.light.primary 
                              : "#CCCCCC",
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
                      {location} ({count})
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {renderTags.length > 0 && (
          <View style={styles.filterSection}>
            <ThemedText
              type="subtitle"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Tematy
            </ThemedText>
            <View style={styles.tagsContainer}>
              {renderTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const count = tagCounts[tag] || 0;
                const isAvailable = count > 0;

                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => isAvailable && toggleTag(tag)}
                    activeOpacity={isAvailable ? 0.7 : 1}
                    disabled={!isAvailable}
                    style={[
                      styles.tag,
                      !isAvailable && { opacity: 0.5 },
                      {
                        backgroundColor: isSelected 
                            ? theme.light.primary 
                            : "#F5F5F5",
                        borderColor: isSelected 
                            ? theme.light.primary 
                            : "#CCCCCC",
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
                      {tag} ({count})
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

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

          <TouchableOpacity
            style={[
              styles.applyButton,
              {
                backgroundColor: theme.light.primary,
                borderColor: theme.light.primary,
              },
            ]}
            onPress={applyFilters}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.applyButtonText, { color: "#FFFFFF" }]}>
              Zastosuj filtry
            </ThemedText>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
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
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
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
  applyButton: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  expandButton: {
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
});
