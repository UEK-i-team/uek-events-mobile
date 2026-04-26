import { EventsCacheService } from "@/shared/storage/events-cache-service/events-cache-service";
import { IEvent } from "@/shared/types/event";
import { IHttpConnector } from "../../../connectors/http-connector";

interface ApiEventsMetaData {
  last_update_date_event: string;
  deleted_events: number[];
}

interface ApiEventsResponse {
  data: IEvent[];
  meta_data: ApiEventsMetaData;
}

export interface IEventsRepository {
  getEventsFromCache(): Promise<IEvent[] | null>;
  fetchAndSyncEvents(): Promise<IEvent[]>;
}

export class EventsRepository implements IEventsRepository {
  private readonly URL = "api/events";

  constructor(
    private readonly http: IHttpConnector,
    private readonly eventsCache: EventsCacheService,
  ) {}



  public async getEventsFromCache(): Promise<IEvent[] | null> {
    return this.eventsCache.getEvents();
  }

  public async fetchAndSyncEvents(): Promise<IEvent[]> {
    const lastUpdateDateEvent =
      await this.eventsCache.getLastUpdateDateEvent();

    const response = await this.http.get<ApiEventsResponse>(this.URL, {
      params: {
        last_update_date_event: lastUpdateDateEvent,
      },
    });

    if (response.status === 200) {
      const apiResponse = response.data;

      const lastUpdateDateEvent = new Date(
        response.data.meta_data.last_update_date_event,
      );

      const isLastUpdateDateEventValid = !isNaN(
        lastUpdateDateEvent.getTime(),
      );

      if (isLastUpdateDateEventValid) {
        await this.eventsCache.appendEvents(
          apiResponse.data,
          lastUpdateDateEvent,
        );
      }

      const deletedEvents = response.data.meta_data.deleted_events;
      if (deletedEvents?.length > 0) {
        await this.eventsCache.deleteEvents(deletedEvents);
      }
    }

    if (response.status === 204 || response.status === 200) {
      const events = await this.eventsCache.getEvents();
      if (!events) throw new Error("Events not found");

      return events;
    }

    throw new Error("Something went wrong during events fetching");
  }
}
