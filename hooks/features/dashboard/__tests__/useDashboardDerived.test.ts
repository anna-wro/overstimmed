import { renderHook } from "@testing-library/react";
import { useDashboardDerived } from "@/hooks/features/dashboard/useDashboardDerived";
import type { TrackingEntry } from "@/lib/entries";

const createMockEntry = (overrides: Partial<TrackingEntry> = {}): TrackingEntry => ({
  id: "entry-1",
  timestamp: new Date().toISOString(),
  energyLevel: 5,
  stimulationLevel: 5,
  stimulationType: "neutral",
  triggers: "noise",
  activities: "working",
  notes: "",
  ...overrides,
});

describe("useDashboardDerived", () => {
  it("returns empty state for no entries", () => {
    const { result } = renderHook(() => useDashboardDerived([]));

    expect(result.current.latestEntry).toBeNull();
    expect(result.current.recentEntries).toEqual([]);
    expect(result.current.stats.totalEntries).toBe(0);
    expect(result.current.stats.avgEnergy).toBe(0);
    expect(result.current.stats.avgStimulation).toBe(0);
  });

  it("calculates correct stats for single entry", () => {
    const entry = createMockEntry({ energyLevel: 7, stimulationLevel: 3, stimulationType: "positive" });
    const { result } = renderHook(() => useDashboardDerived([entry]));

    expect(result.current.stats.totalEntries).toBe(1);
    expect(result.current.stats.avgEnergy).toBe(7);
    expect(result.current.stats.avgStimulation).toBe(3);
    expect(result.current.stats.positiveCount).toBe(1);
    expect(result.current.stats.negativeCount).toBe(0);
    expect(result.current.stats.neutralCount).toBe(0);
  });

  it("calculates averages correctly for multiple entries", () => {
    const entries = [
      createMockEntry({ energyLevel: 4, stimulationLevel: 6 }),
      createMockEntry({ energyLevel: 8, stimulationLevel: 2 }),
    ];
    const { result } = renderHook(() => useDashboardDerived(entries));

    expect(result.current.stats.avgEnergy).toBe(6);
    expect(result.current.stats.avgStimulation).toBe(4);
  });

  it("picks the most recent entry as latestEntry", () => {
    const older = createMockEntry({ id: "old", timestamp: "2024-01-01T10:00:00.000Z" });
    const newer = createMockEntry({ id: "new", timestamp: "2024-06-15T10:00:00.000Z" });
    const { result } = renderHook(() => useDashboardDerived([older, newer]));

    expect(result.current.latestEntry?.id).toBe("new");
  });

  it("counts stimulation types correctly", () => {
    const entries = [
      createMockEntry({ stimulationType: "positive" }),
      createMockEntry({ stimulationType: "positive" }),
      createMockEntry({ stimulationType: "negative" }),
      createMockEntry({ stimulationType: "neutral" }),
    ];
    const { result } = renderHook(() => useDashboardDerived(entries));

    expect(result.current.stats.positiveCount).toBe(2);
    expect(result.current.stats.negativeCount).toBe(1);
    expect(result.current.stats.neutralCount).toBe(1);
  });

  it("only includes entries from the last 7 days in recentEntries", () => {
    const now = new Date();
    const recent = createMockEntry({ timestamp: now.toISOString(), energyLevel: 8 });
    const old = createMockEntry({
      timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      energyLevel: 2,
    });
    const { result } = renderHook(() => useDashboardDerived([recent, old]));

    expect(result.current.recentEntries).toHaveLength(1);
    expect(result.current.recentEntries[0].energy).toBe(8);
  });
});
