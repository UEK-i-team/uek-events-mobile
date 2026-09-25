import { resolveDaySwipe } from "./day-swipe";

describe("resolveDaySwipe", () => {
  it("goes to the next day when swiping left", () => {
    expect(resolveDaySwipe(-120, 0)).toBe(1);
  });

  it("goes to the previous day when swiping right", () => {
    expect(resolveDaySwipe(120, 0)).toBe(-1);
  });

  it("stays on the day after a short slow drag", () => {
    expect(resolveDaySwipe(-40, -100)).toBe(0);
    expect(resolveDaySwipe(40, 100)).toBe(0);
  });

  it("switches on a short quick flick", () => {
    expect(resolveDaySwipe(-40, -900)).toBe(1);
    expect(resolveDaySwipe(40, 900)).toBe(-1);
  });

  it("ignores a flick back against the drag", () => {
    expect(resolveDaySwipe(-40, 900)).toBe(0);
  });

  it("ignores a drag without horizontal movement", () => {
    expect(resolveDaySwipe(0, 0)).toBe(0);
  });
});
