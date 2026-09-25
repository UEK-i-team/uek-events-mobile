import { startOfDay } from "date-fns";

/** Sorted, unique starts (local midnight, ms) of the days that have classes. */
export function getClassDayStarts(events: readonly { start_time: string }[]): number[] {
  const days = new Set<number>();
  for (const event of events) {
    days.add(startOfDay(new Date(event.start_time)).getTime());
  }
  return [...days].sort((a, b) => a - b);
}

/** The nearest day with classes strictly before (-1) or after (1) the given one. */
export function findAdjacentClassDay(classDayStarts: readonly number[], from: Date, direction: -1 | 1): Date | null {
  const fromStart = startOfDay(from).getTime();
  if (direction === 1) {
    const next = classDayStarts.find((day) => day > fromStart);
    return next === undefined ? null : new Date(next);
  }
  for (let i = classDayStarts.length - 1; i >= 0; i--) {
    if (classDayStarts[i] < fromStart) return new Date(classDayStarts[i]);
  }
  return null;
}
