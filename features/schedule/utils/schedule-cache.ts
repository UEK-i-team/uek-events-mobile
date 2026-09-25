import { IScheduleEvent, ScheduleFetchResult } from "@/shared/types/schedule";

export interface ScheduleGroupCache {
  /** Null when the version is unknown, which forces a full fetch. */
  version: number | null;
  events: IScheduleEvent[];
}

export interface ScheduleCache {
  groups: Record<number, ScheduleGroupCache>;
  fetchedAt: string | null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function groupLegacyEvents(events: unknown[], fetchedAt: string | null): ScheduleCache {
  const groups: Record<number, ScheduleGroupCache> = {};
  for (const event of events) {
    if (!isObject(event) || !Number.isInteger(event.group_id)) continue;
    const groupId = event.group_id as number;
    groups[groupId] ??= { version: null, events: [] };
    groups[groupId].events.push(event as unknown as IScheduleEvent);
  }
  return { groups, fetchedAt };
}

/**
 * Reads the stored cache, including formats written by older app versions
 * (a plain events array or `{ events, fetchedAt }`) that had no group versions.
 */
export function migrateScheduleCache(stored: unknown): ScheduleCache | null {
  if (Array.isArray(stored)) return groupLegacyEvents(stored, null);
  if (!isObject(stored)) return null;

  const fetchedAt = typeof stored.fetchedAt === "string" ? stored.fetchedAt : null;

  if (Array.isArray(stored.events)) return groupLegacyEvents(stored.events, fetchedAt);
  if (!isObject(stored.groups)) return null;

  const groups: Record<number, ScheduleGroupCache> = {};
  for (const [key, entry] of Object.entries(stored.groups)) {
    const groupId = Number(key);
    if (!Number.isInteger(groupId) || !isObject(entry) || !Array.isArray(entry.events)) continue;
    groups[groupId] = {
      version: Number.isInteger(entry.version) ? (entry.version as number) : null,
      events: entry.events as IScheduleEvent[],
    };
  }
  return { groups, fetchedAt };
}

/**
 * Versions are sent only when every group is cached with a known version and at
 * least one class, so a 204 response can never leave a group without classes.
 * The backend never publishes a version for an empty group, so a cached group
 * with a version but no classes is stale and needs a full fetch.
 */
export function buildVersionsParam(
  cache: ScheduleCache | null,
  groupIds: number[],
): number[] | undefined {
  if (!cache) return undefined;

  const versions: number[] = [];
  for (const groupId of groupIds) {
    const cached = cache.groups[groupId];
    if (!cached || cached.version === null || cached.events.length === 0) return undefined;
    versions.push(cached.version);
  }
  return versions;
}

/**
 * Only groups present in the response are replaced, so this works whether the
 * backend returns every requested group or only the changed ones. When no
 * versions were sent the response is the full schedule, so requested groups it
 * does not mention have no classes.
 */
export function mergeScheduleResult(
  cache: ScheduleCache | null,
  groupIds: number[],
  result: ScheduleFetchResult,
  options: { sentVersions: boolean; fetchedAt: string },
): ScheduleCache {
  const requested = new Set(groupIds);
  const groups: Record<number, ScheduleGroupCache> = {};

  for (const groupId of groupIds) {
    const cached = cache?.groups[groupId];
    if (cached) groups[groupId] = cached;
  }

  if (result.kind === "updated") {
    const updated: Record<number, ScheduleGroupCache> = {};

    if (!options.sentVersions) {
      for (const groupId of groupIds) {
        updated[groupId] = { version: null, events: [] };
      }
    }
    for (const group of result.groups) {
      if (requested.has(group.id)) {
        updated[group.id] = { version: group.version, events: [] };
      }
    }
    for (const event of result.events) {
      const groupId = event.group_id;
      if (groupId === undefined || !requested.has(groupId)) continue;
      // A class for a group missing from `groups` still replaces that group,
      // but with an unknown version so the next request is a full fetch.
      updated[groupId] ??= { version: null, events: [] };
      updated[groupId].events.push(event);
    }

    Object.assign(groups, updated);
  }

  return { groups, fetchedAt: options.fetchedAt };
}

export function flattenScheduleEvents(
  cache: ScheduleCache | null,
  groupIds: number[],
): IScheduleEvent[] {
  if (!cache) return [];

  return groupIds
    .flatMap((groupId) => cache.groups[groupId]?.events ?? [])
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    // The API has no class IDs; unique keys are needed for rendering.
    .map((event, index) => ({ ...event, id: index + 1 }));
}
