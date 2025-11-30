import { EventCategory, EventLocation, EventTag } from '@/shared/types/event-enums';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FiltersContextType {
  isOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
  // Filtry
  selectedCategories: EventCategory[];
  selectedLocations: EventLocation[];
  selectedTags: EventTag[];
  // Akcje
  toggleCategory: (category: EventCategory) => void;
  toggleLocation: (location: EventLocation) => void;
  toggleTag: (tag: EventTag) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<EventLocation[]>([]);
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<EventCategory[]>([]);
  const [appliedLocations, setAppliedLocations] = useState<EventLocation[]>([]);
  const [appliedTags, setAppliedTags] = useState<EventTag[]>([]);

  const openFilters = () => {
    // Przy otwieraniu, przywróć aktualnie zastosowane filtry
    setSelectedCategories([...appliedCategories]);
    setSelectedLocations([...appliedLocations]);
    setSelectedTags([...appliedTags]);
    setIsOpen(true);
  };

  const closeFilters = () => {
    setIsOpen(false);
  };

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      // Automatycznie zapisz filtry
      setAppliedCategories(newCategories);
      return newCategories;
    });
  };

  const toggleLocation = (location: EventLocation) => {
    setSelectedLocations(prev => {
      const newLocations = prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location];
      // Automatycznie zapisz filtry
      setAppliedLocations(newLocations);
      return newLocations;
    });
  };

  const toggleTag = (tag: EventTag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      // Automatycznie zapisz filtry
      setAppliedTags(newTags);
      return newTags;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedTags([]);
    // Automatycznie zapisz wyczyszczone filtry
    setAppliedCategories([]);
    setAppliedLocations([]);
    setAppliedTags([]);
  };

  const applyFilters = () => {
    setAppliedCategories([...selectedCategories]);
    setAppliedLocations([...selectedLocations]);
    setAppliedTags([...selectedTags]);
    closeFilters();
  };

   

  return (
    <FiltersContext.Provider
      value={{
        isOpen,
        openFilters,
        closeFilters,
        selectedCategories,
        selectedLocations,
        selectedTags,
        toggleCategory,
        toggleLocation,
        toggleTag,
        clearFilters,
        applyFilters,
      }}>
      <AppliedFiltersContext.Provider
        value={{
          appliedCategories,
          appliedLocations,
          appliedTags,
        }}>
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
  appliedCategories: EventCategory[];
  appliedLocations: EventLocation[];
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

