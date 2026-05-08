import React, { createContext, ReactNode, useContext, useState } from 'react';

// Aliasy typów dla lepszego type-safety i czytelności (zamiast nagiego `string`)
export type FilterCategory = string;
export type FilterLocation = string;
export type FilterTag = string;

export interface FiltersContextType {
  isOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
  // Filtry robocze (Draft)
  selectedCategories: FilterCategory[];
  selectedLocations: FilterLocation[];
  selectedTags: FilterTag[];
  // Akcje
  toggleCategory: (category: FilterCategory) => void;
  toggleLocation: (location: FilterLocation) => void;
  toggleTag: (tag: FilterTag) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<FilterCategory[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<FilterLocation[]>([]);
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<FilterCategory[]>([]);
  const [appliedLocations, setAppliedLocations] = useState<FilterLocation[]>([]);
  const [appliedTags, setAppliedTags] = useState<FilterTag[]>([]);

  const openFilters = () => {
    // Przy otwieraniu, przywróć aktualnie zastosowane filtry
    setSelectedCategories([...appliedCategories]);
    setSelectedLocations([...appliedLocations]);
    setSelectedTags([...appliedTags]);
    
    // Jeśli isOpen jest już true (np. użytkownik kliknął 'filtry' podczas zamykania sheet'a)
    // Zmieniamy najpierw na false, by wymusić ponowne odpalenie useEffecta z present() po chwili
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 0);
    } else {
      setIsOpen(true);
    }
  };

  const closeFilters = () => {
    setIsOpen(false);
  };

  const toggleCategory = (category: FilterCategory) => {
    setSelectedCategories(prev => {
      return prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
    });
  };

  const toggleLocation = (location: FilterLocation) => {
    setSelectedLocations(prev => {
      return prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location];
    });
  };

  const toggleTag = (tag: FilterTag) => {
    setSelectedTags(prev => {
      return prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedTags([]);
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
export interface AppliedFiltersContextType {
  appliedCategories: FilterCategory[];
  appliedLocations: FilterLocation[];
  appliedTags: FilterTag[];
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


