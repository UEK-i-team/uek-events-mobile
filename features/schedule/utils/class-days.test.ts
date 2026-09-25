import { findAdjacentClassDay, getClassDayStarts } from "./class-days";

const at = (month: number, day: number, hour = 10) => new Date(2026, month - 1, day, hour);
const event = (date: Date) => ({ start_time: date.toISOString() });

describe("getClassDayStarts", () => {
  it("returns each class day once, sorted", () => {
    const days = getClassDayStarts([event(at(10, 7, 8)), event(at(10, 1, 8)), event(at(10, 1, 16))]);
    expect(days).toEqual([at(10, 1, 0).getTime(), at(10, 7, 0).getTime()]);
  });
});

describe("findAdjacentClassDay", () => {
  const days = getClassDayStarts([event(at(10, 1)), event(at(10, 5)), event(at(10, 8))]);

  it("skips free days going forward", () => {
    expect(findAdjacentClassDay(days, at(10, 1), 1)).toEqual(at(10, 5, 0));
  });

  it("skips free days going back", () => {
    expect(findAdjacentClassDay(days, at(10, 8), -1)).toEqual(at(10, 5, 0));
  });

  it("finds the nearest class day from a free day", () => {
    expect(findAdjacentClassDay(days, at(10, 3), 1)).toEqual(at(10, 5, 0));
    expect(findAdjacentClassDay(days, at(10, 3), -1)).toEqual(at(10, 1, 0));
  });

  it("returns null past the first and the last class day", () => {
    expect(findAdjacentClassDay(days, at(10, 8), 1)).toBeNull();
    expect(findAdjacentClassDay(days, at(10, 1), -1)).toBeNull();
    expect(findAdjacentClassDay([], at(10, 1), 1)).toBeNull();
  });
});
