import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { AuthRepository } from "@/features/auth/api/auth-repository";
import { AuthRepositoryMock } from "@/features/auth/api/auth-repository.mock";
import { AuthSessionService } from "@/features/auth/services/auth-session.service";
import { SecureAuthTokenStore } from "@/features/auth/storage/auth-token-store";
import { authConnector } from "@/shared/connectors/auth-connector/auth-connector";
import { apiConnector } from "@/shared/connectors/api-connector/api-connector";

import { cacheService } from "@/shared/storage/cache-service/cache-service";

import { EventsRepository } from "@/shared/repositories/api-repositiores/events-repository/events-repository";
import { FavoriteEventsRepository } from "@/shared/repositories/favorite-events-repository/favorite-events-repository";

import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { DictionariesCacheService } from "@/shared/storage/dictionaries-cache-service/dictionaries-cache-service";
import { EventsCacheService } from "@/shared/storage/events-cache-service/events-cache-service";

import { EventsService } from "@/shared/services/get-events-services/get-events.services";

import { NotificationsService } from "@/shared/services/notifications-service/notifications-service";

import { DictionariesRepository } from "../repositories/api-repositiores/dictionaries-repository/dictionaries-repository";
import { DictionariesRepositoryMock } from "../repositories/api-repositiores/dictionaries-repository/dictionaries-repository.mock";
import { EventsRepositoryMock } from "../repositories/api-repositiores/events-repository/events-repository.mock";
import { ScheduleRepository } from "@/shared/repositories/api-repositiores/schedule-repository/schedule-repository";

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
const scheduleGroupsStorage = new AsyncStorageService<any>("schedule-groups-cache");

// Repositories

let eventsRepository;
let dictionariesRepository;
const scheduleRepository = new ScheduleRepository(apiConnector, scheduleGroupsStorage);

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

const notificationsService = new NotificationsService();

// Auth
const authTokenStore = new SecureAuthTokenStore();
const authRepository = IS_API_MOCK_ENABLED
  ? new AuthRepositoryMock()
  : new AuthRepository(authConnector);
const authSessionService = new AuthSessionService(
  authRepository,
  authTokenStore,
);

// React part
interface AppDependencies {
  eventsService: EventsService;
  favoriteEventsRepository: FavoriteEventsRepository;
  notificationsService: NotificationsService;
  scheduleRepository: ScheduleRepository;
  authSessionService: AuthSessionService;
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
      notificationsService,
      scheduleRepository,
      authSessionService,
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
