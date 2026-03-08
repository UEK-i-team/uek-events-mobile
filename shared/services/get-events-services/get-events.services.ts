import { IDictionariesRepository } from "@/shared/repositories/api-repositiores/dictionaries-repository/dictionaries-repository";
import { IEventsRepository } from "@/shared/repositories/api-repositiores/events-repository/events-repository";
import { IFavoriteEventsRepository } from "@/shared/repositories/favorite-events-repository/favorite-events-repository";
import { IEvent } from "@/shared/types/event";

export interface IEventsService {
  getAllEvents(): Promise<IEvent[]>;
}

export class EventsService implements IEventsService {
  constructor(
    private readonly eventsRepository: IEventsRepository,
    private readonly dictionariesRepository: IDictionariesRepository,
    private readonly favoriteEventsRepository: IFavoriteEventsRepository,
  ) {}

  public async getAllEvents(): Promise<IEvent[]> {
    const [events, dictionaries, favoriteEventsIds] = await Promise.all([
      this.eventsRepository.getEvents(),
      this.dictionariesRepository.getDictionaries(),
      this.favoriteEventsRepository.getFavoriteEvents(),
    ]);

    const favoriteEventsIdsSet = new Set(favoriteEventsIds);

    return events.map((event) => ({
      ...event,
      event_category: dictionaries.categories[event.event_category] || "",
      location_category:
        dictionaries.location_categories[event.location_category] || "",
      organisators_category:
        dictionaries.organizer_categories[event.organisators_category] || "",
      tags: event.tags.map((tag) => dictionaries.tags[tag] || ""),
      registration_type:
        dictionaries.registration_categories[event.registration_type] || "",
      isFavorite: favoriteEventsIdsSet.has(event.id),
    }));
  }
}
