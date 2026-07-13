import NetInfo from "@react-native-community/netinfo";

import { IDictionariesRepository } from "@/shared/repositories/api-repositiores/dictionaries-repository/dictionaries-repository";
import { IEventsRepository } from "@/shared/repositories/api-repositiores/events-repository/events-repository";
import { IFavoriteEventsRepository } from "@/shared/repositories/favorite-events-repository/favorite-events-repository";
import { IDictionaries } from "@/shared/types/dictionaries";
import { IEvent } from "@/shared/types/event";

export interface GetAllEventsOptions {
  onLateUpdate?: (data: { events: IEvent[]; dictionaries: IDictionaries }) => void;
}

export interface IEventsService {
  getAllEvents(options?: GetAllEventsOptions): Promise<{ events: IEvent[]; dictionaries: IDictionaries }>;
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
  ) { }

  public async getAllEvents(
    options?: GetAllEventsOptions,
  ): Promise<{ events: IEvent[]; dictionaries: IDictionaries }> {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected === false) {
      const cachedBundle = await this.loadCachedBundle();
      if (!this.isCompleteCachedBundle(cachedBundle)) {
        throw new OfflineNoCacheError();
      }
      return { events: this.mapBundle(cachedBundle), dictionaries: cachedBundle.dictionaries! };
    }

    const networkBundlePromise = this.loadNetworkBundle();
    networkBundlePromise.catch(() => { });

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
        return { events: this.mapBundle(cachedBundle), dictionaries: cachedBundle.dictionaries! };
      }
      throw error;
    }

    if (raceResult !== TIMEOUT_SYMBOL) {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      return { events: this.mapBundle(raceResult), dictionaries: raceResult.dictionaries! };
    }

    const cachedBundle = await this.loadCachedBundle();
    if (!this.isCompleteCachedBundle(cachedBundle)) {
      const networkBundle = await networkBundlePromise;
      return { events: this.mapBundle(networkBundle), dictionaries: networkBundle.dictionaries! };
    }

    networkBundlePromise
      .then((networkBundle) => {
        options?.onLateUpdate?.({ events: this.mapBundle(networkBundle), dictionaries: networkBundle.dictionaries! });
      })
      .catch((err) => {
        console.error("Late bundle fetch failed", err);
      });


    const result = this.mapBundle(cachedBundle);
    return { events: result, dictionaries: cachedBundle.dictionaries! };
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
    // Missing events (null) or missing dictionaries means the data could not be
    // loaded/structured correctly - that is a real error. An empty events array
    // is a valid response (no events available) and must not throw.
    if (!bundle.events || !bundle.dictionaries) {
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
      event_type_raw: event.event_type,
      event_type: dictionaries.event_types[event.event_type] || "",
      location_category_raw: event.location_category,
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
