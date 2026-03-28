import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";

export interface IFavoriteEventsRepository {
  getFavoriteEvents(): Promise<number[] | null>;
  addFavoriteEvent(eventId: number): Promise<void>;
  removeFavoriteEvent(eventId: number): Promise<void>;
}

export class FavoriteEventsRepository implements IFavoriteEventsRepository {
  constructor(
    private readonly asyncStorageFavoriteService: AsyncStorageService<number[]>,
  ) {}

  async getFavoriteEvents(): Promise<number[] | null> {
    return await this.asyncStorageFavoriteService.get();
  }

  async addFavoriteEvent(eventId: number) {
    const favoriteEvents = await this.getFavoriteEvents();
    if (favoriteEvents) {
      favoriteEvents.push(eventId);
      await this.asyncStorageFavoriteService.set(favoriteEvents);
    } else {
      await this.asyncStorageFavoriteService.set([eventId]);
    }
  }

  async removeFavoriteEvent(eventId: number) {
    const favoriteEvents = await this.getFavoriteEvents();
    if (favoriteEvents) {
      const updatedFavoriteEvents = favoriteEvents.filter(
        (event) => event !== eventId,
      );
      await this.asyncStorageFavoriteService.set(updatedFavoriteEvents);
    }
  }
}
