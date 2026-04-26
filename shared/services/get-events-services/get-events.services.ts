import NetInfo from "@react-native-community/netinfo";

import { IDictionariesRepository } from "@/shared/repositories/api-repositiores/dictionaries-repository/dictionaries-repository";
import { IEventsRepository } from "@/shared/repositories/api-repositiores/events-repository/events-repository";
import { IFavoriteEventsRepository } from "@/shared/repositories/favorite-events-repository/favorite-events-repository";
import { IDictionaries } from "@/shared/types/dictionaries";
import { IEvent } from "@/shared/types/event";

export interface GetAllEventsOptions {
  onLateUpdate?: (events: IEvent[]) => void;
}

export interface IEventsService {
  getAllEvents(options?: GetAllEventsOptions): Promise<IEvent[]>;
}

export class OfflineNoCacheError extends Error {
  constructor() {
    super("Brak połączenia z internetem i brak danych offline");
    this.name = "OfflineNoCacheError";
    Object.setPrototypeOf(this, OfflineNoCacheError.prototype);
  }
}

const FETCH_TIMEOUT_MS = 4000;
const TIMEOUT_SYMBOL = Symbol("network-bundle-timeout");

interface EventsBundle {
  events: IEvent[] | null;
  dictionaries: IDictionaries | null;
  favoriteEventsIds: number[] | null;
}

export class EventsService implements IEventsService {
  constructor(
    private readonly eventsRepository: IEventsRepository,
    private readonly dictionariesRepository: IDictionariesRepository,
    private readonly favoriteEventsRepository: IFavoriteEventsRepository,
  ) {}

  public async getAllEvents(
    options?: GetAllEventsOptions,
  ): Promise<IEvent[]> {
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.isConnected === false) {
      const cachedBundle = await this.loadCachedBundle();
      if (!this.isCompleteCachedBundle(cachedBundle)) {
        throw new OfflineNoCacheError();
      }
      return this.mapBundle(cachedBundle);
    }

    const networkBundlePromise = this.loadNetworkBundle();
    networkBundlePromise.catch(() => {});

    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<typeof TIMEOUT_SYMBOL>((resolve) => {
      timeoutHandle = setTimeout(() => resolve(TIMEOUT_SYMBOL), FETCH_TIMEOUT_MS);
    });

    let raceResult: EventsBundle | typeof TIMEOUT_SYMBOL;
    try {
      raceResult = await Promise.race([networkBundlePromise, timeoutPromise]);
    } catch (error) {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      console.error("[EventsService] Online race failed", {
        message: (error as Error)?.message,
        status: (error as { response?: { status?: number } })?.response?.status,
      });
      const cachedBundle = await this.loadCachedBundle();
      if (this.isCompleteCachedBundle(cachedBundle)) {
        return this.mapBundle(cachedBundle);
      }
      throw error;
    }

    if (raceResult !== TIMEOUT_SYMBOL) {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      return this.mapBundle(raceResult);
    }

    const cachedBundle = await this.loadCachedBundle();
    if (!this.isCompleteCachedBundle(cachedBundle)) {
      const networkBundle = await networkBundlePromise;
      return this.mapBundle(networkBundle);
    }

    networkBundlePromise
      .then((networkBundle) => {
        options?.onLateUpdate?.(this.mapBundle(networkBundle));
      })
      .catch((err) => {
        console.error("Late bundle fetch failed", err);
      });

    return this.mapBundle(cachedBundle);
  }

  private async loadCachedBundle(): Promise<EventsBundle> {
    const [events, dictionaries, favoriteEventsIds] = await Promise.all([
      this.eventsRepository.getEventsFromCache(),
      this.dictionariesRepository.getDictionariesFromCache(),
      this.favoriteEventsRepository.getFavoriteEvents(),
    ]);

    return { events, dictionaries, favoriteEventsIds };
  }

  private async loadNetworkBundle(): Promise<EventsBundle> {
    const [events, dictionaries, favoriteEventsIds] = await Promise.all([
      this.eventsRepository.fetchAndSyncEvents(),
      this.dictionariesRepository.fetchAndSyncDictionaries(),
      this.favoriteEventsRepository.getFavoriteEvents(),
    ]);

    return { events, dictionaries, favoriteEventsIds };
  }

  private isCompleteCachedBundle(bundle: EventsBundle): boolean {
    return !!bundle.events?.length && !!bundle.dictionaries;
  }

  private mapBundle(bundle: EventsBundle): IEvent[] {
    if (!bundle.events?.length || !bundle.dictionaries) {
      throw new Error("Brak pełnych danych do mapowania wydarzeń");
    }

    const favoriteEventsIdsSet = new Set(bundle.favoriteEventsIds ?? []);
    return this.mapEvents(bundle.events, bundle.dictionaries, favoriteEventsIdsSet);
  }

  private mapEvents(
    events: IEvent[],
    dictionaries: IDictionaries,
    favoriteEventsIdsSet: Set<number>,
  ): IEvent[] {
    return events.map((event) => ({
      ...event,
      event_type: dictionaries.event_types[event.event_type] || "",
      location_category:
        dictionaries.event_location[event.location_category] || "",
      organisators_category:
        dictionaries.organizer_types[event.organisators_category] || "",
      tags: event.tags?.map((tag) => dictionaries.tags[tag] || "") ?? [],
      registration_type:
        dictionaries.registration_types[event.registration_type] || "",
      isFavorite: favoriteEventsIdsSet.has(event.id),
    }));
  }
}
