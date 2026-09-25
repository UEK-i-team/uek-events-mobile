import { getDaySwipePull, getScrollEdges, resolveDaySwipe } from "./day-swipe";

const top = { isAtTop: true, isAtBottom: false };
const middle = { isAtTop: false, isAtBottom: false };
const bottom = { isAtTop: false, isAtBottom: true };
const both = { isAtTop: true, isAtBottom: true };

describe("getScrollEdges", () => {
  it("treats content shorter than the screen as both edges", () => {
    expect(getScrollEdges(0, 600, 400)).toEqual(both);
  });

  it("detects the bottom despite fractional Android offsets", () => {
    expect(getScrollEdges(399.6, 600, 1000)).toEqual(bottom);
  });

  it("detects the middle of a long day", () => {
    expect(getScrollEdges(200, 600, 1000)).toEqual(middle);
  });
});

describe("getDaySwipePull", () => {
  it("pulls toward the next day only from the bottom", () => {
    expect(getDaySwipePull(-40, bottom)).toBe(-40);
    expect(getDaySwipePull(-40, middle)).toBe(0);
  });

  it("pulls toward the previous day only from the top", () => {
    expect(getDaySwipePull(40, top)).toBe(40);
    expect(getDaySwipePull(40, bottom)).toBe(0);
  });
});

describe("resolveDaySwipe", () => {
  it("goes to the next day when pulling up past the bottom", () => {
    expect(resolveDaySwipe(-80, bottom, bottom)).toBe(1);
  });

  it("goes to the previous day when pulling down past the top", () => {
    expect(resolveDaySwipe(80, top, top)).toBe(-1);
  });

  it("ignores a drag that only scrolled to the edge", () => {
    expect(resolveDaySwipe(-300, middle, bottom)).toBe(0);
    expect(resolveDaySwipe(300, middle, top)).toBe(0);
  });

  it("ignores short drags", () => {
    expect(resolveDaySwipe(-30, bottom, bottom)).toBe(0);
  });

  it("switches both ways on a day that does not scroll", () => {
    expect(resolveDaySwipe(-80, both, both)).toBe(1);
    expect(resolveDaySwipe(80, both, both)).toBe(-1);
  });
});
