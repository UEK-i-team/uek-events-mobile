import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { apiConnector } from "@/shared/connectors/api-connector/api-connector";

import { cacheService } from "@/shared/storage/cache-service/cache-service";

import { EventsRepository } from "@/shared/repositories/api-repositiores/events-repository/events-repository";
import { FavoriteEventsRepository } from "@/shared/repositories/favorite-events-repository/favorite-events-repository";

import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { DictionariesCacheService } from "@/shared/storage/dictionaries-cache-service/dictionaries-cache-service";
import { EventsCacheService } from "@/shared/storage/events-cache-service/events-cache-service";

import { EventsService } from "@/shared/services/get-events-services/get-events.services";

import { DictionariesRepository } from "../repositories/api-repositiores/dictionaries-repository/dictionaries-repository";
import { DictionariesRepositoryMock } from "../repositories/api-repositiores/dictionaries-repository/dictionaries-repository.mock";
import { EventsRepositoryMock } from "../repositories/api-repositiores/events-repository/events-repository.mock";

const IS_API_MOCK_ENABLED =
  process.env.EXPO_PUBLIC_IS_API_MOCK_ENABLED === "true" || false;

// storage
const eventsCache = new EventsCacheService(cacheService);
const dictionariesCache = new DictionariesCacheService(cacheService);
const favoriteEventsStorage = new AsyncStorageService<number[]>(
  "favorite-events",
);
const favoriteEventsRepository = new FavoriteEventsRepository(
  favoriteEventsStorage,
);

// Repositories

let eventsRepository;
let dictionariesRepository;

if (IS_API_MOCK_ENABLED) {
  eventsRepository = new EventsRepositoryMock();
  dictionariesRepository = new DictionariesRepositoryMock();
} else {
  eventsRepository = new EventsRepository(apiConnector, eventsCache);
  dictionariesRepository = new DictionariesRepository(
    apiConnector,
    dictionariesCache,
  );
}

// Services
const eventsService = new EventsService(
  eventsRepository,
  dictionariesRepository,
  favoriteEventsRepository,
);

// React part
interface AppDependencies {
  eventsService: EventsService;
  favoriteEventsRepository: FavoriteEventsRepository;
}

const DependencyContext = createContext<AppDependencies | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export const DependencyProvider = ({ children }: ProviderProps) => {
  const dependencies = useMemo<AppDependencies>(
    () => ({
      eventsService,
      favoriteEventsRepository,
    }),
    [],
  );

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependencies = (): AppDependencies => {
  const context = useContext(DependencyContext);

  if (!context) {
    throw new Error(
      "Hook useDependencies must be used inside <DependencyProvider>",
    );
  }

  return context;
};
