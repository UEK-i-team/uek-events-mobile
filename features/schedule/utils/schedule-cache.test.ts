import { IScheduleEvent } from "@/shared/types/schedule";

import {
  buildVersionsParam,
  flattenScheduleEvents,
  mergeScheduleResult,
  migrateScheduleCache,
  ScheduleCache,
} from "./schedule-cache";

function event(groupId: number, course: string, startTime = "2026-10-01T08:00:00Z"): IScheduleEvent {
  return {
    group_id: groupId,
    start_time: startTime,
    end_time: "2026-10-01T09:30:00Z",
    course,
    type: "LECTURE",
  };
}

const fetchedAt = "2026-09-24T12:00:00.000Z";

const cachedTwoGroups: ScheduleCache = {
  groups: {
    1: { version: 3, events: [event(1, "Stare A")] },
    2: { version: 5, events: [event(2, "Stare B")] },
  },
  fetchedAt: "2026-09-20T12:00:00.000Z",
};

describe("buildVersionsParam", () => {
  it("returns versions aligned with group ids when every group is cached", () => {
    expect(buildVersionsParam(cachedTwoGroups, [2, 1])).toEqual([5, 3]);
  });

  it("returns undefined when a group is not cached", () => {
    expect(buildVersionsParam(cachedTwoGroups, [1, 2, 3])).toBeUndefined();
  });

  it("returns undefined when a version is unknown", () => {
    const cache: ScheduleCache = { groups: { 1: { version: null, events: [] } }, fetchedAt: null };
    expect(buildVersionsParam(cache, [1])).toBeUndefined();
  });

  it("returns undefined without a cache", () => {
    expect(buildVersionsParam(null, [1])).toBeUndefined();
  });

  it("returns undefined when a versioned group has no cached classes", () => {
    const cache: ScheduleCache = {
      groups: { ...cachedTwoGroups.groups, 4612: { version: 1, events: [] } },
      fetchedAt: null,
    };
    expect(buildVersionsParam(cache, [1, 4612])).toBeUndefined();
  });
});

describe("mergeScheduleResult", () => {
  it("keeps unchanged groups when a partial 200 response only contains changed ones", () => {
    const merged = mergeScheduleResult(
      cachedTwoGroups,
      [1, 2],
      { kind: "updated", groups: [{ id: 2, version: 6 }], events: [event(2, "Nowe B")] },
      { sentVersions: true, fetchedAt },
    );

    expect(merged.groups[1]).toEqual(cachedTwoGroups.groups[1]);
    expect(merged.groups[2]).toEqual({ version: 6, events: [event(2, "Nowe B")] });
    expect(merged.fetchedAt).toBe(fetchedAt);
  });

  it("replaces every group returned by a full 200 response", () => {
    const merged = mergeScheduleResult(
      cachedTwoGroups,
      [1, 2],
      {
        kind: "updated",
        groups: [{ id: 1, version: 4 }, { id: 2, version: 6 }],
        events: [event(1, "Nowe A")],
      },
      { sentVersions: true, fetchedAt },
    );

    expect(merged.groups).toEqual({
      1: { version: 4, events: [event(1, "Nowe A")] },
      2: { version: 6, events: [] },
    });
  });

  it("keeps classes on 204 and only updates fetchedAt", () => {
    const merged = mergeScheduleResult(cachedTwoGroups, [1, 2], { kind: "unchanged" }, {
      sentVersions: true,
      fetchedAt,
    });

    expect(merged).toEqual({ groups: cachedTwoGroups.groups, fetchedAt });
  });

  it("drops groups that are no longer selected", () => {
    const merged = mergeScheduleResult(cachedTwoGroups, [1], { kind: "unchanged" }, {
      sentVersions: true,
      fetchedAt,
    });

    expect(Object.keys(merged.groups)).toEqual(["1"]);
  });

  it("treats requested groups missing from a full fetch as empty with an unknown version", () => {
    const merged = mergeScheduleResult(
      null,
      [1, 2],
      { kind: "updated", groups: [{ id: 1, version: 2 }], events: [event(1, "A")] },
      { sentVersions: false, fetchedAt },
    );

    expect(merged.groups).toEqual({
      1: { version: 2, events: [event(1, "A")] },
      2: { version: null, events: [] },
    });
  });

  it("stores classes of a group missing from the groups list with an unknown version", () => {
    const merged = mergeScheduleResult(
      cachedTwoGroups,
      [1, 2],
      { kind: "updated", groups: [], events: [event(1, "Nowe A")] },
      { sentVersions: true, fetchedAt },
    );

    expect(merged.groups[1]).toEqual({ version: null, events: [event(1, "Nowe A")] });
    expect(merged.groups[2]).toEqual(cachedTwoGroups.groups[2]);
  });

  it("ignores data for groups that were not requested", () => {
    const merged = mergeScheduleResult(
      null,
      [1],
      { kind: "updated", groups: [{ id: 1, version: 1 }, { id: 9, version: 1 }], events: [event(9, "X")] },
      { sentVersions: false, fetchedAt },
    );

    expect(merged.groups).toEqual({ 1: { version: 1, events: [] } });
  });
});

describe("flattenScheduleEvents", () => {
  it("returns classes of selected groups sorted by start time with unique ids", () => {
    const cache: ScheduleCache = {
      groups: {
        1: { version: 1, events: [event(1, "Późne", "2026-10-01T12:00:00Z")] },
        12: { version: 1, events: [event(12, "Wczesne", "2026-10-01T08:00:00Z")] },
        3: { version: 1, events: [event(3, "Niewybrane")] },
      },
      fetchedAt,
    };

    const events = flattenScheduleEvents(cache, [1, 12]);

    expect(events.map((e) => e.course)).toEqual(["Wczesne", "Późne"]);
    expect(new Set(events.map((e) => e.id)).size).toBe(2);
  });
});

describe("migrateScheduleCache", () => {
  it("groups a legacy plain array by group without versions", () => {
    expect(migrateScheduleCache([event(1, "A"), event(2, "B")])).toEqual({
      groups: {
        1: { version: null, events: [event(1, "A")] },
        2: { version: null, events: [event(2, "B")] },
      },
      fetchedAt: null,
    });
  });

  it("keeps fetchedAt from the legacy { events, fetchedAt } format", () => {
    const migrated = migrateScheduleCache({ events: [event(1, "A")], fetchedAt });

    expect(migrated?.fetchedAt).toBe(fetchedAt);
    expect(buildVersionsParam(migrated, [1])).toBeUndefined();
  });

  it("reads the current format after a JSON round trip", () => {
    const stored = JSON.parse(JSON.stringify(cachedTwoGroups));

    expect(migrateScheduleCache(stored)).toEqual(cachedTwoGroups);
  });

  it("returns null for unknown data", () => {
    expect(migrateScheduleCache(null)).toBeNull();
    expect(migrateScheduleCache({ foo: 1 })).toBeNull();
  });
});
