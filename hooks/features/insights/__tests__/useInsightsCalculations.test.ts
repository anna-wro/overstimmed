import { renderHook } from "@testing-library/react";
import { useInsightsCalculations } from "@/hooks/features/insights/useInsightsCalculations";
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

describe("useInsightsCalculations", () => {
  describe("averages", () => {
    it("returns 0 for empty entries", () => {
      const { result } = renderHook(() => useInsightsCalculations([]));

      expect(result.current.avgEnergyLevel).toBe(0);
      expect(result.current.avgStimulationLevel).toBe(0);
    });

    it("calculates correct averages", () => {
      const entries = [
        createMockEntry({ energyLevel: 4, stimulationLevel: 6 }),
        createMockEntry({ energyLevel: 8, stimulationLevel: 2 }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.avgEnergyLevel).toBe(6);
      expect(result.current.avgStimulationLevel).toBe(4);
    });

    it("rounds to one decimal place", () => {
      const entries = [
        createMockEntry({ energyLevel: 3 }),
        createMockEntry({ energyLevel: 4 }),
        createMockEntry({ energyLevel: 5 }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.avgEnergyLevel).toBe(4);
    });
  });

  describe("stimulationTypes", () => {
    it("counts stimulation types", () => {
      const entries = [
        createMockEntry({ stimulationType: "positive" }),
        createMockEntry({ stimulationType: "positive" }),
        createMockEntry({ stimulationType: "negative" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.stimulationTypes.positive).toBe(2);
      expect(result.current.stimulationTypes.negative).toBe(1);
    });
  });

  describe("chartData", () => {
    it("sorts by timestamp ascending", () => {
      const entries = [
        createMockEntry({ timestamp: "2024-06-15T10:00:00.000Z" }),
        createMockEntry({ timestamp: "2024-06-14T10:00:00.000Z" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.chartData[0].date).toBe("06/14");
      expect(result.current.chartData[1].date).toBe("06/15");
    });
  });

  describe("topTriggers", () => {
    it("returns triggers sorted by frequency", () => {
      const entries = [
        createMockEntry({ triggers: "noise, lights" }),
        createMockEntry({ triggers: "noise, crowds" }),
        createMockEntry({ triggers: "lights" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.topTriggers[0].trigger).toBe("noise");
      expect(result.current.topTriggers[0].count).toBe(2);
      expect(result.current.topTriggers[1].trigger).toBe("lights");
      expect(result.current.topTriggers[1].count).toBe(2);
    });

    it("returns empty for no triggers", () => {
      const entries = [createMockEntry({ triggers: "" })];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.topTriggers).toHaveLength(0);
    });
  });

  describe("timeOfDayData", () => {
    it("groups entries by time of day", () => {
      const entries = [
        createMockEntry({ timestamp: "2024-06-15T09:00:00.000Z", energyLevel: 8 }), // morning
        createMockEntry({ timestamp: "2024-06-15T14:00:00.000Z", energyLevel: 4 }), // afternoon
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      const morning = result.current.timeOfDayData.find((d) => d.time === "morning");
      const afternoon = result.current.timeOfDayData.find((d) => d.time === "afternoon");

      expect(morning?.count).toBe(1);
      expect(morning?.energy).toBe(8);
      expect(afternoon?.count).toBe(1);
      expect(afternoon?.energy).toBe(4);
    });

    it("returns all four time periods", () => {
      const { result } = renderHook(() => useInsightsCalculations([]));

      expect(result.current.timeOfDayData).toHaveLength(4);
      expect(result.current.timeOfDayData.map((d) => d.time)).toEqual([
        "morning", "afternoon", "evening", "night",
      ]);
    });
  });

  describe("dayOfWeekData", () => {
    it("returns all seven days", () => {
      const { result } = renderHook(() => useInsightsCalculations([]));

      expect(result.current.dayOfWeekData).toHaveLength(7);
    });
  });

  describe("correlationData", () => {
    it("maps entries to correlation points", () => {
      const entries = [
        createMockEntry({ energyLevel: 8, stimulationLevel: 3, stimulationType: "positive" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.correlationData[0]).toEqual({
        energy: 8,
        stimulation: 3,
        type: "positive",
        comfortable: true,
      });
    });
  });

  describe("balancedStatesData", () => {
    it("returns empty data when no balanced entries", () => {
      const entries = [
        createMockEntry({ energyLevel: 1, stimulationLevel: 9, stimulationType: "negative" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.balancedStatesData.count).toBe(0);
    });

    it("identifies balanced states (energy 4-7, moderate stim or positive)", () => {
      const entries = [
        createMockEntry({
          energyLevel: 5,
          stimulationLevel: 5,
          stimulationType: "neutral",
          timestamp: "2024-06-15T09:00:00.000Z",
          activities: "reading",
        }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.balancedStatesData.count).toBe(1);
    });
  });

  describe("recoveryPatternsData", () => {
    it("returns empty when no recovery patterns", () => {
      const entries = [createMockEntry()];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.recoveryPatternsData.count).toBe(0);
    });

    it("detects recovery after high negative stimulation", () => {
      const entries = [
        createMockEntry({
          timestamp: "2024-06-15T10:00:00.000Z",
          stimulationLevel: 9,
          stimulationType: "negative",
          activities: "crowds",
        }),
        createMockEntry({
          timestamp: "2024-06-15T12:00:00.000Z",
          stimulationLevel: 3,
          stimulationType: "positive",
          activities: "resting",
        }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.recoveryPatternsData.count).toBe(1);
    });
  });

  describe("environmentalFactorsData", () => {
    it("detects environment keywords in activities/notes", () => {
      const entries = [
        createMockEntry({ activities: "working at home", notes: "quiet", energyLevel: 7 }),
        createMockEntry({ activities: "home office", notes: "relaxing", energyLevel: 6 }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      const homeEnv = result.current.environmentalFactorsData.find((e) => e.environment === "home");
      expect(homeEnv).toBeDefined();
      expect(homeEnv?.count).toBe(2);
    });

    it("filters out environments with less than 2 occurrences", () => {
      const entries = [
        createMockEntry({ activities: "park walk", notes: "" }),
      ];
      const { result } = renderHook(() => useInsightsCalculations(entries));

      expect(result.current.environmentalFactorsData).toHaveLength(0);
    });
  });
});
