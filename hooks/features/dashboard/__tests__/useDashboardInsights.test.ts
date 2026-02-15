import { renderHook } from "@testing-library/react";
import { useDashboardInsights } from "@/hooks/features/dashboard/useDashboardInsights";
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

describe("useDashboardInsights", () => {
  describe("getTimeOfDayInsight", () => {
    it("returns insight about highest-energy time period", () => {
      const entries = [
        createMockEntry({ timestamp: "2024-06-15T09:00:00.000Z", energyLevel: 9 }), // morning
        createMockEntry({ timestamp: "2024-06-15T14:00:00.000Z", energyLevel: 3 }), // afternoon
      ];
      const { result } = renderHook(() => useDashboardInsights(entries));
      const insight = result.current.getTimeOfDayInsight();

      expect(insight).toContain("morning");
    });

    it("returns fallback when no entries exist", () => {
      const { result } = renderHook(() => useDashboardInsights([]));
      const insight = result.current.getTimeOfDayInsight();

      expect(insight).toContain("Track more entries");
    });
  });

  describe("getCommonTriggersInsight", () => {
    it("returns insight with top triggers", () => {
      const entries = [
        createMockEntry({ triggers: "noise, lights" }),
        createMockEntry({ triggers: "noise, crowds" }),
        createMockEntry({ triggers: "lights" }),
      ];
      const { result } = renderHook(() => useDashboardInsights(entries));
      const insight = result.current.getCommonTriggersInsight();

      expect(insight).toContain("noise");
    });

    it("returns fallback when no triggers exist", () => {
      const entries = [createMockEntry({ triggers: "" })];
      const { result } = renderHook(() => useDashboardInsights(entries));
      const insight = result.current.getCommonTriggersInsight();

      expect(insight).toContain("Add triggers");
    });
  });
});
