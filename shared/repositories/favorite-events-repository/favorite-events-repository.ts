import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";

export interface IFavoriteEventsRepository {
  getFavoriteEvents(): Promise<string[] | null>;
  addFavoriteEvent(eventId: string): Promise<void>;
  removeFavoriteEvent(eventId: string): Promise<void>;
}

export class FavoriteEventsRepository implements IFavoriteEventsRepository {
  constructor(
    private readonly asyncStorageFavoriteService: AsyncStorageService<string[]>,
  ) {}

  async getFavoriteEvents(): Promise<string[] | null> {
    return await this.asyncStorageFavoriteService.get();
  }

  async addFavoriteEvent(eventId: string) {
    const favoriteEvents = await this.getFavoriteEvents();
    if (favoriteEvents) {
      favoriteEvents.push(eventId);
      await this.asyncStorageFavoriteService.set(favoriteEvents);
    } else {
      await this.asyncStorageFavoriteService.set([eventId]);
    }
  }

  async removeFavoriteEvent(eventId: string) {
    const favoriteEvents = await this.getFavoriteEvents();
    if (favoriteEvents) {
      const updatedFavoriteEvents = favoriteEvents.filter(
        (event) => event !== eventId,
      );
      await this.asyncStorageFavoriteService.set(updatedFavoriteEvents);
    }
  }
}
