import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const VIEWED_EVENTS_STORAGE_KEY = '@uek_events_viewed';

interface ViewedEventData {
  eventId: string;
  viewedAt: string; // ISO timestamp
}

interface ViewedEventsContextType {
  viewedEventIds: string[];
  viewedEventsData: ViewedEventData[];
  markAsViewed: (eventId: string) => Promise<void>;
  isViewed: (eventId: string) => boolean;
  getViewedTimestamp: (eventId: string) => string | null;
  clearViewed: () => Promise<void>;
  isLoading: boolean;
}

const ViewedEventsContext = createContext<ViewedEventsContextType | undefined>(undefined);

export function ViewedEventsProvider({ children }: { children: React.ReactNode }) {
  // Aktualny stan z AsyncStorage (zapisywany na bieżąco)
  const [viewedEventsData, setViewedEventsData] = useState<ViewedEventData[]>([]);
  
  // "Zamrożony" stan z momentu startu aplikacji - TYLKO do sortowania
  const [initialViewedIds, setInitialViewedIds] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Załaduj zobaczone przy starcie
  useEffect(() => {
    loadViewedEvents(true); // true = pierwsze załadowanie
  }, []);

  // Odśwież dane przy powrocie do aplikacji (aby mieć aktualne dane)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [isInitialLoadDone]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // Gdy aplikacja wraca na pierwszy plan - odśwież dane (ale bez zmiany initialViewedIds!)
    if (nextAppState === 'active' && isInitialLoadDone) {
      console.log('🔄 Aplikacja aktywna - odświeżam dane zobaczonych eventów');
      await loadViewedEvents(false); // false = nie zmieniaj initialViewedIds
    }
  };

  const loadViewedEvents = async (isInitialLoad: boolean = false) => {
    try {
      const stored = await AsyncStorage.getItem(VIEWED_EVENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ViewedEventData[];
        setViewedEventsData(parsed);
        
        // Zapisz początkowy stan TYLKO przy pierwszym załadowaniu - będzie używany do sortowania
        if (isInitialLoad) {
          const ids = parsed.map((item) => item.eventId);
          setInitialViewedIds(ids);
          console.log('📋 Początkowe zobaczone wydarzenia:', ids.length, 'IDs:', ids);
          setIsInitialLoadDone(true);
        } else {
          console.log('🔄 Odświeżono dane zobaczonych (bez zmiany sortowania):', parsed.length);
        }
      } else {
        console.log('Brak zapisanych zobaczonych wydarzeń');
        if (isInitialLoad) {
          setIsInitialLoadDone(true);
        }
      }
    } catch (error) {
      console.error('Błąd podczas ładowania zobaczonych wydarzeń:', error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  const saveViewedEvents = async (data: ViewedEventData[]) => {
    try {
      await AsyncStorage.setItem(VIEWED_EVENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Błąd podczas zapisywania zobaczonych wydarzeń:', error);
    }
  };

  const isViewed = useCallback((eventId: string) => {
    // Sprawdź w aktualnych danych (dla ikony ✓)
    return viewedEventsData.some((item) => item.eventId === eventId);
  }, [viewedEventsData]);

  const getViewedTimestamp = useCallback((eventId: string) => {
    const found = viewedEventsData.find((item) => item.eventId === eventId);
    return found ? found.viewedAt : null;
  }, [viewedEventsData]);

  const markAsViewed = useCallback(async (eventId: string) => {
    try {
      // ZAWSZE wczytaj aktualne dane z AsyncStorage przed zapisem
      // żeby nie nadpisać danych z poprzednich sesji
      const stored = await AsyncStorage.getItem(VIEWED_EVENTS_STORAGE_KEY);
      let currentData: ViewedEventData[] = [];
      
      if (stored) {
        currentData = JSON.parse(stored) as ViewedEventData[];
        console.log('📥 Wczytano aktualne dane z AsyncStorage:', currentData.length);
      }
      
      // Sprawdź czy już nie jest oznaczony w danych z AsyncStorage
      const alreadyViewed = currentData.some((item) => item.eventId === eventId);
      if (alreadyViewed) {
        console.log('👁️ Event już zobaczony:', eventId);
        
        // Zaktualizuj stan lokalny jeśli się różni
        if (!viewedEventsData.some((item) => item.eventId === eventId)) {
          setViewedEventsData(currentData);
        }
        return;
      }

      console.log('👀 Oznaczam event jako zobaczony:', eventId);

      const newViewedData: ViewedEventData = {
        eventId,
        viewedAt: new Date().toISOString(),
      };

      // Dodaj do AKTUALNYCH danych z AsyncStorage
      const updatedData = [...currentData, newViewedData];
      
      // Zaktualizuj stan lokalny
      setViewedEventsData(updatedData);
      
      // Zapisz do AsyncStorage
      await saveViewedEvents(updatedData);
      
      console.log('✅ Zapisano zobaczony event. Total zobaczonych:', updatedData.length);
    } catch (error) {
      console.error('❌ Błąd podczas oznaczania eventu jako zobaczony:', error);
    }
  }, [viewedEventsData]);

  const clearViewed = useCallback(async () => {
    setViewedEventsData([]);
    setInitialViewedIds([]);
    await saveViewedEvents([]);
  }, []);

  // Zwróć POCZĄTKOWE ID (z momentu startu) - dla sortowania
  // NIE zmieniaj tego podczas sesji!
  const viewedEventIds = initialViewedIds;

  return (
    <ViewedEventsContext.Provider
      value={{
        viewedEventIds,
        viewedEventsData,
        isViewed,
        getViewedTimestamp,
        markAsViewed,
        clearViewed,
        isLoading,
      }}>
      {children}
    </ViewedEventsContext.Provider>
  );
}

export function useViewedEvents() {
  const context = useContext(ViewedEventsContext);
  if (!context) {
    throw new Error('useViewedEvents must be used within ViewedEventsProvider');
  }
  return context;
}

