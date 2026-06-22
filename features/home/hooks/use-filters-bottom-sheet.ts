import { useFilters } from "@/features/filters/contexts";
import { EventContext } from "@/shared/context/EventContext/EventContext";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { BackHandler } from "react-native";

export const useFiltersBottomSheet = (isOpen: boolean, onClose: () => void) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollViewRef = useRef<any>(null);

  const filtersContext = useFilters();
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

  const { events, dictionaries } = useContext(EventContext);

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

  const availableCategories = useMemo(() => Object.keys(categoryCounts), [categoryCounts]);
  const availableLocations = useMemo(() => Object.keys(locationCounts), [locationCounts]);
  const availableTags = useMemo(() => Object.keys(tagCounts), [tagCounts]);

  const allCategories = useMemo(() => Object.values(dictionaries?.event_types || {}), [dictionaries?.event_types]);
  const allLocations = useMemo(() => Object.values(dictionaries?.event_location || {}), [dictionaries?.event_location]);
  const allTags = useMemo(() => Object.values(dictionaries?.tags || {}), [dictionaries?.tags]);

  const renderCategories = useMemo(() => Array.from(new Set([
    ...availableCategories,
    ...allCategories.filter((c) => !availableCategories.includes(c)),
  ])), [availableCategories, allCategories]);

  const renderLocations = useMemo(() => Array.from(new Set([
    ...availableLocations,
    ...allLocations.filter((l) => !availableLocations.includes(l)),
  ])), [availableLocations, allLocations]);

  const renderTags = useMemo(() => Array.from(new Set([
    ...availableTags,
    ...allTags.filter((t) => !availableTags.includes(t)),
  ])), [availableTags, allTags]);

  const snapPoints = useMemo(() => ["70%", "95%"], []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOpen) {
      // Minimalne opóźnienie wymusza poprawną zmianę w trakcie wewnętrznych animacji
      timeout = setTimeout(() => {
        bottomSheetRef.current?.present();
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 50);
    } else {
      bottomSheetRef.current?.dismiss();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
    return () => clearTimeout(timeout);
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
      // index === -1 is usually handled by onDismiss, but we can keep it for safety if we want.
      // However, relying on onDismiss is better.
    },
    [],
  );

  const handleDismiss = useCallback(() => {
    if (isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  return {
    bottomSheetRef,
    scrollViewRef,
    snapPoints,
    handleSheetChanges,
    handleDismiss,
    categoryCounts,
    locationCounts,
    tagCounts,
    renderCategories,
    renderLocations,
    renderTags,
    filtersContext,
  };
};
