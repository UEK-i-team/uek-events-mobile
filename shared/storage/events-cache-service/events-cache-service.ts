import { CacheService } from "@/shared/storage/cache-service/cache-service";
import type { IEvent } from "@/shared/types/event";

interface CacheMetadata {
  lastCached: number;
  last_update_date_event: Date;
  eventsCount: number;
}

export class EventsCacheService {
  private readonly eventsFileName = "events-data.json";
  private readonly metadataFileName = "events-metadata.json";

  constructor(private readonly disk: CacheService) {}

  public async saveEvents(
    events: IEvent[],
    last_update_date_event: Date,
  ): Promise<void> {
    await this.disk.set(this.eventsFileName, events);

    await this.disk.set<CacheMetadata>(this.metadataFileName, {
      lastCached: Date.now(),
      last_update_date_event,
      eventsCount: events.length,
    });
  }

  public async getEvents(): Promise<IEvent[] | null> {
    return await this.disk.get<IEvent[]>(this.eventsFileName);
  }

  public async appendEvents(
    newEvents: IEvent[],
    last_update_date_event: Date,
  ): Promise<void> {
    const existingEvents = (await this.getEvents()) || [];

    const eventsMap = new Map(existingEvents.map((e) => [e.id, e]));

    for (const newEvent of newEvents) {
      eventsMap.set(newEvent.id, newEvent);
    }

    if (newEvents.length > 0) {
      const allEvents = Array.from(eventsMap.values());
      await this.saveEvents(allEvents, last_update_date_event);
    }
  }

  public async deleteEvents(eventIds: string[]): Promise<void> {
    const existingEvents = (await this.getEvents()) || [];

    const eventsMap = new Map(existingEvents.map((e) => [e.id, e]));

    for (const eventId of eventIds) {
      eventsMap.delete(eventId);
    }

    const allEvents = Array.from(eventsMap.values());
    await this.saveEvents(allEvents, new Date());
  }

  public async getLastUpdateDateEvent(): Promise<Date | null> {
    const metadata = await this.disk.get<CacheMetadata>(this.metadataFileName);
    return metadata?.last_update_date_event || null;
  }

  public async clearEventsCache(): Promise<void> {
    await this.disk.remove(this.eventsFileName);
    await this.disk.remove(this.metadataFileName);
  }
}
