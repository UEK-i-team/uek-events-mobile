import { IHttpConnector } from "../../../connectors/http-connector";
import {
  IScheduleEvent,
  IScheduleGroupsResponse,
  IScheduleGroupVersion,
  ScheduleFetchResult,
} from "@/shared/types/schedule";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";

export interface IScheduleRepository {
  getCachedGroups(): Promise<IScheduleGroupsResponse | null>;
  /** Always hits the network and updates the cache on success. */
  getAvailableGroups(): Promise<IScheduleGroupsResponse>;
  fetchScheduleForGroup(groupIds: number[], versions?: number[]): Promise<ScheduleFetchResult>;
}

export class InvalidScheduleResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidScheduleResponseError";
  }
}

export class ScheduleRepository implements IScheduleRepository {
  private readonly GROUPS_URL = "api/schedules/groups/";
  private readonly SCHEDULES_URL = "api/schedules/groups/classes/";

  constructor(
    private readonly http: IHttpConnector,
    private readonly cache: AsyncStorageService<IScheduleGroupsResponse>
  ) {}

  public async getCachedGroups(): Promise<IScheduleGroupsResponse | null> {
    return this.cache.get();
  }

  public async getAvailableGroups(): Promise<IScheduleGroupsResponse> {
    const response = await this.http.get<unknown>(this.GROUPS_URL);
    if (response.status !== 200) {
      throw new Error("Failed to fetch available schedule groups");
    }

    const groups = parseGroupsResponse(response.data);
    await this.cache.set(groups);
    return groups;
  }

  /**
   * `versions` must be index-aligned with `groupIds`. Omit it to always get the
   * full schedule; the backend answers 204 only when every version matches.
   */
  public async fetchScheduleForGroup(groupIds: number[], versions?: number[]): Promise<ScheduleFetchResult> {
    const queryParts = [`group_ids=${groupIds.join(",")}`];
    if (versions) {
      queryParts.push(`versions=${versions.join(",")}`);
    }


    console.log(queryParts.join("&"))
    const response = await this.http.get<unknown>(`${this.SCHEDULES_URL}?${queryParts.join("&")}`);
    console.log(response.status)
    console.log(response.data)

    if (response.status === 204) {
      return { kind: "unchanged" };
    }
    if (response.status !== 200) {
      throw new Error("Failed to fetch schedule for groups");
    }

    return parseScheduleResponse(response.data);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && !isNaN(new Date(value).getTime());
}

function isValidScheduleEvent(value: unknown): value is IScheduleEvent {
  return (
    isObject(value) &&
    isValidDateString(value.start_time) &&
    isValidDateString(value.end_time) &&
    typeof value.course === "string"
  );
}

/**
 * Throws instead of returning an empty list for malformed payloads, so a bad
 * backend response never overwrites a previously cached schedule.
 */
export function parseScheduleEvents(data: unknown): IScheduleEvent[] {
  // The backend wraps the response in { groups: [...], classes: [...] }
  const rawEvents = Array.isArray(data)
    ? data
    : isObject(data)
      ? (data.classes ?? data.data)
      : undefined;

  if (!Array.isArray(rawEvents)) {
    throw new InvalidScheduleResponseError("Schedule response has no classes list.");
  }

  const events = rawEvents.filter(isValidScheduleEvent);
  if (rawEvents.length > 0 && events.length === 0) {
    throw new InvalidScheduleResponseError("Schedule response contains no valid classes.");
  }

  return events;
}

function parseGroupVersion(value: unknown): IScheduleGroupVersion | null {
  if (!isObject(value) || !Number.isInteger(value.id)) return null;
  const version = Number.isInteger(value.version) ? (value.version as number) : 0;
  return { id: value.id as number, version };
}

export function parseScheduleResponse(data: unknown): ScheduleFetchResult {
  if (!isObject(data) || !Array.isArray(data.groups)) {
    // Without group versions the classes could not be cached consistently.
    throw new InvalidScheduleResponseError("Schedule response has no groups list.");
  }

  const groups = data.groups
    .map(parseGroupVersion)
    .filter((group): group is IScheduleGroupVersion => group !== null);

  return { kind: "updated", groups, events: parseScheduleEvents(data) };
}

export function parseGroupsResponse(data: unknown): IScheduleGroupsResponse {
  if (!isObject(data)) {
    throw new InvalidScheduleResponseError("Groups response is not an object.");
  }

  const { planzajec, usos } = data;
  if (!Array.isArray(planzajec) && !Array.isArray(usos)) {
    throw new InvalidScheduleResponseError("Groups response has no group lists.");
  }

  return {
    planzajec: Array.isArray(planzajec) ? planzajec : [],
    usos: Array.isArray(usos) ? usos : [],
  };
}
