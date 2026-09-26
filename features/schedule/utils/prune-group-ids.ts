import { IScheduleGroupsResponse } from "@/shared/types/schedule";

/**
 * Drops selected IDs the backend no longer offers, e.g. after switching to a
 * backend with a different database. Returns the same array when nothing is
 * dropped, and keeps the selection intact when the response lists no groups at
 * all, since that says nothing about which IDs are valid.
 */
export function pruneUnknownGroupIds(
  groupIds: number[],
  groups: IScheduleGroupsResponse,
): number[] {
  const knownIds = new Set<number>();
  for (const group of groups.planzajec) knownIds.add(group.id);
  for (const group of groups.usos) {
    for (const subGroup of group.sub_groups ?? []) knownIds.add(subGroup.id);
  }
  if (knownIds.size === 0) return groupIds;

  const pruned = groupIds.filter((id) => knownIds.has(id));
  return pruned.length === groupIds.length ? groupIds : pruned;
}
