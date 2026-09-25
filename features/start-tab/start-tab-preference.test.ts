import { parseStartTabPreference, resolveStartTab } from "./start-tab-preference";

describe("resolveStartTab", () => {
  it("opens the schedule for logged-in users by default", () => {
    expect(resolveStartTab("auto", true)).toBe("schedule");
  });

  it("opens events for logged-out users by default", () => {
    expect(resolveStartTab("auto", false)).toBe("events");
  });

  it("follows an explicit choice regardless of the session", () => {
    expect(resolveStartTab("schedule", false)).toBe("schedule");
    expect(resolveStartTab("events", true)).toBe("events");
  });
});

describe("parseStartTabPreference", () => {
  it("falls back to auto for missing or unknown values", () => {
    expect(parseStartTabPreference(null)).toBe("auto");
    expect(parseStartTabPreference("home")).toBe("auto");
    expect(parseStartTabPreference(1)).toBe("auto");
  });

  it("keeps valid values", () => {
    expect(parseStartTabPreference("schedule")).toBe("schedule");
    expect(parseStartTabPreference("events")).toBe("events");
  });
});
