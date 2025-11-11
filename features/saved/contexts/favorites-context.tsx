import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = '@uek_events_favorites';

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (eventId: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Załaduj ulubione przy starcie
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Błąd podczas ładowania ulubionych:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Błąd podczas zapisywania ulubionych:', error);
    }
  };

  const isFavorite = useCallback((eventId: string) => {
    return favoriteIds.includes(eventId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (eventId: string) => {
    setFavoriteIds((prev) => {
      const newFavorites = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      
      // Zapisz asynchronicznie
      saveFavorites(newFavorites);
      
      return newFavorites;
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        isLoading,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites musi być użyty wewnątrz FavoritesProvider');
  }
  return context;
}

