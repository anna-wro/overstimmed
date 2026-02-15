/**
 * @fileoverview Derived dashboard statistics and chart data from tracking entries.
 * @example const { latestEntry, recentEntries, stats } = useDashboardDerived(entries)
 */
import { useMemo } from "react"
import { subDays, format } from "date-fns"
import type { TrackingEntry } from "@/lib/entries"

export type DashboardStats = {
  totalEntries: number
  avgEnergy: number
  avgStimulation: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
}

export type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
}

const emptyStats: DashboardStats = {
  totalEntries: 0,
  avgEnergy: 0,
  avgStimulation: 0,
  positiveCount: 0,
  negativeCount: 0,
  neutralCount: 0,
}

export function useDashboardDerived(entries: TrackingEntry[]) {
  return useMemo(() => {
    if (entries.length === 0) {
      return {
        latestEntry: null as TrackingEntry | null,
        recentEntries: [] as ChartDataPoint[],
        stats: emptyStats,
      }
    }
    const sorted = [...entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const latestEntry = sorted[0]
    const totalEntries = entries.length
    const avgEnergy =
      Math.round((entries.reduce((sum, e) => sum + e.energyLevel, 0) / totalEntries) * 10) / 10
    const avgStimulation =
      Math.round((entries.reduce((sum, e) => sum + e.stimulationLevel, 0) / totalEntries) * 10) / 10
    const stats: DashboardStats = {
      totalEntries,
      avgEnergy,
      avgStimulation,
      positiveCount: entries.filter((e) => e.stimulationType === "positive").length,
      negativeCount: entries.filter((e) => e.stimulationType === "negative").length,
      neutralCount: entries.filter((e) => e.stimulationType === "neutral").length,
    }
    const sevenDaysAgo = subDays(new Date(), 7).getTime()
    const recentEntries: ChartDataPoint[] = sorted
      .filter((e) => new Date(e.timestamp).getTime() > sevenDaysAgo)
      .slice(0, 7)
      .reverse()
      .map((e) => ({
        date: format(new Date(e.timestamp), "MM/dd"),
        energy: e.energyLevel,
        stimulation: e.stimulationLevel,
      }))
    return { latestEntry, recentEntries, stats }
  }, [entries])
}
