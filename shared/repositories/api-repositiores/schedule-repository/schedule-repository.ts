import { IHttpConnector } from "../../../connectors/http-connector";
import { IScheduleGroupsResponse, IScheduleEvent } from "@/shared/types/schedule";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";

export interface IScheduleRepository {
  getAvailableGroups(forceRefresh?: boolean): Promise<IScheduleGroupsResponse>;
  fetchScheduleForGroup(groupIds: number[], versions?: number[]): Promise<IScheduleEvent[]>;
}

export class ScheduleRepository implements IScheduleRepository {
  private readonly GROUPS_URL = "api/schedules/groups/";
  private readonly SCHEDULES_URL = "api/schedules/groups/classes/";

  constructor(
    private readonly http: IHttpConnector,
    private readonly cache: AsyncStorageService<IScheduleGroupsResponse>
  ) {}

  public async getAvailableGroups(forceRefresh = false): Promise<IScheduleGroupsResponse> {
    if (!forceRefresh) {
      const cached = await this.cache.get();
      if (cached) {
        // Fetch in background to update cache without blocking
        this.fetchAndCacheGroups().catch(console.error);
        return cached;
      }
    }
    return this.fetchAndCacheGroups();
  }

  private async fetchAndCacheGroups(): Promise<IScheduleGroupsResponse> {
    const response = await this.http.get<IScheduleGroupsResponse>(this.GROUPS_URL);
    if (response.status === 200) {
      await this.cache.set(response.data);
      return response.data;
    }
    throw new Error("Failed to fetch available schedule groups");
  }

  public async fetchScheduleForGroup(groupIds: number[], versions?: number[]): Promise<IScheduleEvent[]> {
    // According to apidog: group_ids, versions (could be single number or array, we'll send it as array if possible or single if it's multiple requests, we'll just send array for now and assume it works)
    const queryParts: string[] = [];
    if (groupIds && groupIds.length > 0) {
      queryParts.push(`group_ids=${groupIds.join(",")}`);
    }
    if (versions && versions.length > 0) {
      queryParts.push(`versions=${versions.join(",")}`);
    }
    
    const queryString = queryParts.join("&");
    const url = queryString ? `${this.SCHEDULES_URL}?${queryString}` : this.SCHEDULES_URL;

    const response = await this.http.get<any>(url);
    
    if (response.status === 200) {
      // The backend wraps the response in { groups: [...], classes: [...] }
      const rawData = response.data.classes || response.data.data || response.data;
      const data = Array.isArray(rawData) ? rawData : [];

      // Inject fake IDs so React rendering (keys, dots) works correctly since API doesn't provide event IDs
      const events = (data as IScheduleEvent[]).map((e, index) => ({
        ...e,
        id: e.id || (e.group_id ? Number(`${e.group_id}${index}`) : index + Date.now()),
      }));

      return events;
    }
    
    throw new Error("Failed to fetch schedule for groups");
  }
}
