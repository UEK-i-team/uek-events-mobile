import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { eventsRepository } from '../repositories/eventsRepository';
import { mockEventsRepository } from '../repositoriesMocks/eventsRepository';
import type { IEventsRepository } from '../types';

/**
 * Interface dla wartości kontekstu z wszystkimi repozytoriami
 */
interface RepositoriesContextValue {
  eventsRepository: IEventsRepository;
  isMockEnabled: boolean;
}

/**
 * Context do zarządzania repozytoriami (prawdziwe API vs mocki)
 */
const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined);

/**
 * Props dla RepositoriesProvider
 */
interface RepositoriesProviderProps {
  children: ReactNode;
}

/**
 * Provider który dostarcza repozytoria na podstawie zmiennej środowiskowej
 */
export function RepositoriesProvider({ children }: RepositoriesProviderProps) {
  const repositories = useMemo(() => {
    // Sprawdź zmienną środowiskową EXPO_PUBLIC_IS_API_MOCK_ENABLED z pliku .env
    // W Expo SDK 50+ zmienne z prefiksem EXPO_PUBLIC_ są automatycznie dostępne
    const isMockEnabled = process.env.EXPO_PUBLIC_IS_API_MOCK_ENABLED === 'true';
    
    console.log('EXPO_PUBLIC_IS_API_MOCK_ENABLED from .env:', process.env.EXPO_PUBLIC_IS_API_MOCK_ENABLED);
    console.log('isMockEnabled:', isMockEnabled);

    if (isMockEnabled) {
      console.log('🎭 Using MOCKED repositories');
    } else {
      console.log('🌐 Using REAL API repositories');
    }

    return {
      eventsRepository: isMockEnabled ? mockEventsRepository : eventsRepository,
      isMockEnabled,
    };
  }, []);

  return (
    <RepositoriesContext.Provider value={repositories}>
      {children}
    </RepositoriesContext.Provider>
  );
}

/**
 * Hook do pobierania repozytoriów z kontekstu
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { eventsRepository } = useRepositories();
 *   
 *   useEffect(() => {
 *     const fetchEvents = async () => {
 *       const events = await eventsRepository.getEvents();
 *       console.log(events);
 *     };
 *     fetchEvents();
 *   }, []);
 * }
 * ```
 */
export function useRepositories(): RepositoriesContextValue {
  const context = useContext(RepositoriesContext);

  if (context === undefined) {
    throw new Error('useRepositories must be used within a RepositoriesProvider');
  }

  return context;
}

/**
 * Hook do pobierania tylko eventsRepository (wygodniejszy)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const eventsRepo = useEventsRepository();
 *   
 *   const events = await eventsRepo.getEvents();
 * }
 * ```
 */
export function useEventsRepository(): IEventsRepository {
  const { eventsRepository } = useRepositories();
  return eventsRepository;
}

