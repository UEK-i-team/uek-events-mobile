import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FiltersContextType {
  isOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openFilters = () => setIsOpen(true);
  const closeFilters = () => setIsOpen(false);

  return (
    <FiltersContext.Provider value={{ isOpen, openFilters, closeFilters }}>
      {children}
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

