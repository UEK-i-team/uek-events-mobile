import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./filters-bottom-sheet.styles";
import { useFiltersBottomSheet } from "../../home/hooks/use-filters-bottom-sheet";

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersBottomSheet({
  isOpen,
  onClose,
}: FiltersBottomSheetProps) {
  const {
    bottomSheetRef,
    scrollViewRef,
    snapPoints,
    handleSheetChanges,
    categoryCounts,
    locationCounts,
    tagCounts,
    renderCategories,
    renderLocations,
    renderTags,
    filtersContext,
  } = useFiltersBottomSheet(isOpen, onClose);

  const {
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    applyFilters,
    clearFilters,
  } = filtersContext;

  const backgroundColor = "#FFFFFF";
  const textColor = "#000000";

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

