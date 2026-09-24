import { EventTag } from '@/shared/types/event-enums';
import React, { createContext, ReactNode, useContext, useState, useCallback, useMemo, useEffect } from 'react';

interface FiltersContextType {
  // Filtry
  selectedCategories: string[];
  selectedLocations: string[];
  selectedTags: EventTag[];
  // Akcje
  toggleCategory: (category: string) => void;
  toggleLocation: (location: string) => void;
  toggleTag: (tag: EventTag) => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedLocations, setAppliedLocations] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<EventTag[]>([]);

  // Debounce the application of filters so the UI doesn't freeze when toggling checkboxes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedCategories(selectedCategories);
      setAppliedLocations(selectedLocations);
      setAppliedTags(selectedTags);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategories, selectedLocations, selectedTags]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      return prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
    });
  }, []);

  const toggleLocation = useCallback((location: string) => {
    setSelectedLocations(prev => {
      return prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location];
    });
  }, []);

  const toggleTag = useCallback((tag: EventTag) => {
    setSelectedTags(prev => {
      return prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedTags([]);
    // Automatycznie zapisz wyczyszczone filtry
    setAppliedCategories([]);
    setAppliedLocations([]);
    setAppliedTags([]);
  }, []);

  const contextValue = useMemo(() => ({
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    clearFilters,
  }), [
    selectedCategories,
    selectedLocations,
    selectedTags,
    toggleCategory,
    toggleLocation,
    toggleTag,
    clearFilters,
  ]);

  const appliedContextValue = useMemo(() => ({
    appliedCategories,
    appliedLocations,
    appliedTags,
  }), [appliedCategories, appliedLocations, appliedTags]);

  return (
    <FiltersContext.Provider value={contextValue}>
      <AppliedFiltersContext.Provider value={appliedContextValue}>
        {children}
      </AppliedFiltersContext.Provider>
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}

// Hook do uzyskania zastosowanych filtrów (dla filtrowania wydarzeń)
// Musimy dodać to do kontekstu
interface AppliedFiltersContextType {
  appliedCategories: string[];
  appliedLocations: string[];
  appliedTags: EventTag[];
}

const AppliedFiltersContext = createContext<AppliedFiltersContextType | undefined>(undefined);

export function useAppliedFilters() {
  const context = useContext(AppliedFiltersContext);
  // Zwróć domyślne wartości jeśli kontekst nie jest jeszcze gotowy
  if (context === undefined) {
    return {
      appliedCategories: [],
      appliedLocations: [],
      appliedTags: [],
    };
  }
  return context;
}
