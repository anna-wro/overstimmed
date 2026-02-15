import { renderHook } from "@testing-library/react";
import { usePatternDetection } from "@/hooks/features/insights/usePatternDetection";
import type { TrackingEntry } from "@/lib/entries";

const createMockEntry = (overrides: Partial<TrackingEntry> = {}): TrackingEntry => ({
  id: "entry-1",
  timestamp: "2024-06-15T10:00:00.000Z",
  energyLevel: 5,
  stimulationLevel: 5,
  stimulationType: "neutral",
  triggers: "noise",
  activities: "working",
  notes: "",
  ...overrides,
});

describe("usePatternDetection", () => {
  it("returns empty patterns for fewer than 5 entries", () => {
    const entries = Array.from({ length: 4 }, (_, i) =>
      createMockEntry({ id: `entry-${i}` })
    );
    const { result } = renderHook(() => usePatternDetection(entries));

    expect(result.current.patterns).toEqual([]);
  });

  it("detects high-stimulation-negative pattern", () => {
    const baseEntries = Array.from({ length: 5 }, (_, i) =>
      createMockEntry({ id: `base-${i}` })
    );
    const highStimNeg = Array.from({ length: 3 }, (_, i) =>
      createMockEntry({
        id: `high-${i}`,
        stimulationLevel: 8,
        stimulationType: "negative",
        triggers: "noise, crowds",
      })
    );
    const { result } = renderHook(() =>
      usePatternDetection([...baseEntries, ...highStimNeg])
    );

    const pattern = result.current.patterns.find(
      (p) => p.type === "high-stimulation-negative"
    );
    expect(pattern).toBeDefined();
    expect(pattern?.severity).toBe("warning");
    expect(pattern?.description).toContain("noise");
  });

  it("detects high-stimulation-positive pattern", () => {
    const baseEntries = Array.from({ length: 5 }, (_, i) =>
      createMockEntry({ id: `base-${i}` })
    );
    const highStimPos = Array.from({ length: 3 }, (_, i) =>
      createMockEntry({
        id: `high-pos-${i}`,
        stimulationLevel: 8,
        stimulationType: "positive",
        triggers: "music, dancing",
      })
    );
    const { result } = renderHook(() =>
      usePatternDetection([...baseEntries, ...highStimPos])
    );

    const pattern = result.current.patterns.find(
      (p) => p.type === "high-stimulation-positive"
    );
    expect(pattern).toBeDefined();
    expect(pattern?.severity).toBe("success");
  });

  it("detects low-energy pattern", () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      createMockEntry({
        id: `low-${i}`,
        energyLevel: 2,
        timestamp: `2024-06-15T09:0${i}:00.000Z`, // all morning
      })
    );
    const { result } = renderHook(() => usePatternDetection(entries));

    const pattern = result.current.patterns.find((p) => p.type === "low-energy");
    expect(pattern).toBeDefined();
    expect(pattern?.severity).toBe("info");
    expect(pattern?.description).toContain("morning");
  });

  it("detects positive-experience pattern", () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      createMockEntry({
        id: `pos-${i}`,
        stimulationType: "positive",
        activities: "reading, walking",
      })
    );
    const { result } = renderHook(() => usePatternDetection(entries));

    const pattern = result.current.patterns.find(
      (p) => p.type === "positive-experience"
    );
    expect(pattern).toBeDefined();
    expect(pattern?.severity).toBe("success");
    expect(pattern?.description).toContain("reading");
  });

  it("does not detect patterns when thresholds are not met", () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      createMockEntry({
        id: `neutral-${i}`,
        energyLevel: 5,
        stimulationLevel: 5,
        stimulationType: "neutral",
        triggers: `unique-trigger-${i}`,
        activities: `unique-activity-${i}`,
      })
    );
    const { result } = renderHook(() => usePatternDetection(entries));

    expect(result.current.patterns).toHaveLength(0);
  });
});
