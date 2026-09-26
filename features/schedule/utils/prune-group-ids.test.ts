import { IScheduleGroupsResponse } from "@/shared/types/schedule";

import { pruneUnknownGroupIds } from "./prune-group-ids";

const groups: IScheduleGroupsResponse = {
  planzajec: [
    { id: 1, group_code: "A", name: "A", schedule_category: "c" },
    { id: 2, group_code: "B", name: "B", schedule_category: "c" },
  ],
  usos: [
    {
      group_code: "WF",
      name: "WF",
      schedule_category: "wf",
      sub_groups: [{ id: 10, group_number: 1 }],
    },
  ],
};

describe("pruneUnknownGroupIds", () => {
  it("drops ids missing from both group lists", () => {
    expect(pruneUnknownGroupIds([1, 99, 10, 42], groups)).toEqual([1, 10]);
  });

  it("returns the same array when every id is known", () => {
    const ids = [2, 10];
    expect(pruneUnknownGroupIds(ids, groups)).toBe(ids);
  });

  it("keeps the selection when the response has no groups", () => {
    const ids = [1, 99];
    expect(pruneUnknownGroupIds(ids, { planzajec: [], usos: [] })).toBe(ids);
  });
});
