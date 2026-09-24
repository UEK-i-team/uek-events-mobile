import { AxiosResponse } from "axios";

import { IHttpConnector } from "@/shared/connectors/http-connector";
import type { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { IScheduleGroupsResponse } from "@/shared/types/schedule";

import {
  InvalidScheduleResponseError,
  ScheduleRepository,
} from "./schedule-repository";

function createHttp(data: unknown, status = 200): IHttpConnector & { get: jest.Mock } {
  const response = { data, status } as AxiosResponse;
  const request = jest.fn().mockResolvedValue(response);
  return {
    get: request,
    post: request,
    put: request,
    patch: request,
    delete: request,
  };
}

function createCache(initial: IScheduleGroupsResponse | null = null) {
  let value = initial;
  return {
    get: jest.fn(async () => value),
    set: jest.fn(async (next: IScheduleGroupsResponse) => {
      value = next;
    }),
  } as unknown as AsyncStorageService<IScheduleGroupsResponse> & {
    set: jest.Mock;
  };
}

const validEvent = {
  group_id: 7,
  start_time: "2026-10-01T08:00:00Z",
  end_time: "2026-10-01T09:30:00Z",
  course: "Matematyka",
  type: "LECTURE",
};

describe("ScheduleRepository.fetchScheduleForGroup", () => {
  it("returns group versions and classes from a 200 response", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [{ id: 7, version: 3 }], classes: [validEvent] }),
      createCache(),
    );

    const result = await repository.fetchScheduleForGroup([7]);

    expect(result).toEqual({
      kind: "updated",
      groups: [{ id: 7, version: 3 }],
      events: [validEvent],
    });
  });

  it("defaults a missing version to 0 and skips groups without an id", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [{ id: 7 }, { version: 2 }], classes: [] }),
      createCache(),
    );

    await expect(repository.fetchScheduleForGroup([7])).resolves.toEqual({
      kind: "updated",
      groups: [{ id: 7, version: 0 }],
      events: [],
    });
  });

  it("treats 204 as an unchanged schedule", async () => {
    const repository = new ScheduleRepository(createHttp("", 204), createCache());

    await expect(repository.fetchScheduleForGroup([7], [3])).resolves.toEqual({
      kind: "unchanged",
    });
  });

  it("sends versions aligned with group ids", async () => {
    const http = createHttp("", 204);
    const repository = new ScheduleRepository(http, createCache());

    await repository.fetchScheduleForGroup([7, 9], [3, 5]);

    expect(http.get).toHaveBeenCalledWith(
      "api/schedules/groups/classes/?group_ids=7,9&versions=3,5",
    );
  });

  it("omits versions when none are given", async () => {
    const http = createHttp({ groups: [], classes: [] });
    const repository = new ScheduleRepository(http, createCache());

    await repository.fetchScheduleForGroup([7]);

    expect(http.get).toHaveBeenCalledWith("api/schedules/groups/classes/?group_ids=7");
  });

  it("throws when the response has no groups list", async () => {
    const repository = new ScheduleRepository(
      createHttp({ classes: [validEvent] }),
      createCache(),
    );

    await expect(repository.fetchScheduleForGroup([7])).rejects.toBeInstanceOf(
      InvalidScheduleResponseError,
    );
  });

  it("throws when the response has no classes list", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [], message: "unexpected" }),
      createCache(),
    );

    await expect(repository.fetchScheduleForGroup([7])).rejects.toBeInstanceOf(
      InvalidScheduleResponseError,
    );
  });

  it("throws when every returned class is malformed", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [], classes: [{ course: "X", start_time: "nope" }] }),
      createCache(),
    );

    await expect(repository.fetchScheduleForGroup([7])).rejects.toBeInstanceOf(
      InvalidScheduleResponseError,
    );
  });

  it("drops malformed classes but keeps valid ones", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [{ id: 7, version: 1 }], classes: [validEvent, { course: 1 }] }),
      createCache(),
    );

    const result = await repository.fetchScheduleForGroup([7]);

    expect(result.kind === "updated" && result.events).toHaveLength(1);
  });

  it("throws on an unexpected status", async () => {
    const repository = new ScheduleRepository(
      createHttp({ groups: [], classes: [validEvent] }, 202),
      createCache(),
    );

    await expect(repository.fetchScheduleForGroup([7])).rejects.toThrow();
  });
});

describe("ScheduleRepository.getAvailableGroups", () => {
  const planzajec = [{ id: 1, group_code: "A", name: "A", schedule_category: "c" }];

  it("does not overwrite cached groups with a malformed response", async () => {
    const cache = createCache();
    const repository = new ScheduleRepository(createHttp({ foo: 1 }), cache);

    await expect(repository.getAvailableGroups()).rejects.toBeInstanceOf(
      InvalidScheduleResponseError,
    );
    expect(cache.set).not.toHaveBeenCalled();
  });

  it("caches a valid response and fills missing lists", async () => {
    const cache = createCache();
    const repository = new ScheduleRepository(createHttp({ planzajec }), cache);

    const groups = await repository.getAvailableGroups();

    expect(groups).toEqual({ planzajec, usos: [] });
    expect(cache.set).toHaveBeenCalledWith({ planzajec, usos: [] });
  });

  it("returns fresh groups from the network even when groups are cached", async () => {
    const cache = createCache({ planzajec: [], usos: [] });
    const http = createHttp({ planzajec });
    const repository = new ScheduleRepository(http, cache);

    await expect(repository.getAvailableGroups()).resolves.toEqual({ planzajec, usos: [] });
    expect(http.get).toHaveBeenCalledWith("api/schedules/groups/");
  });
});
