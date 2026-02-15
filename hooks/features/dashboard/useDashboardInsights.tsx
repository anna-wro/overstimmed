/** @fileoverview Quick insight generators for dashboard time-of-day and trigger patterns. */
import { dashboardCopy } from '@/copy/dashboard'
import type { TrackingEntry } from '@/lib/entries'

export const useDashboardInsights = (entries: TrackingEntry[]) => {
  const getTimeOfDayInsight = () => {
    // Group entries by time of day
    const timeGroups = entries.reduce(
      (acc, entry) => {
        const date = new Date(entry.timestamp)
        const hours = date.getHours()
        let timeOfDay = "morning"
        if (hours >= 12 && hours < 17) timeOfDay = "afternoon"
        else if (hours >= 17 && hours < 21) timeOfDay = "evening"
        else if (hours >= 21 || hours < 5) timeOfDay = "night"

        if (!acc[timeOfDay]) acc[timeOfDay] = []
        acc[timeOfDay].push(entry)
        return acc
      },
      {} as Record<string, TrackingEntry[]>,
    )

    // Find time of day with highest average energy
    let highestEnergyTime = ""
    let highestEnergyAvg = 0

    Object.entries(timeGroups).forEach(([time, entries]) => {
      if (entries.length === 0) return
      const avg = entries.reduce((sum, e) => sum + e.energyLevel, 0) / entries.length
      if (avg > highestEnergyAvg) {
        highestEnergyAvg = avg
        highestEnergyTime = time
      }
    })

    return highestEnergyTime
      ? dashboardCopy.insights.timeOfDayInsight(highestEnergyTime)
      : dashboardCopy.insights.timeOfDayFallback
  }

  const getCommonTriggersInsight = () => {
    // Extract all triggers
    const allTriggers = entries
      .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
      .filter((t) => t.length > 0)

    // Count occurrences
    const triggerCounts = allTriggers.reduce(
      (acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get top triggers
    const topTriggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([trigger]) => trigger)

    return topTriggers.length > 0
      ? dashboardCopy.insights.commonTriggersInsight(topTriggers)
      : dashboardCopy.insights.commonTriggersFallback
  }

  return {
    getTimeOfDayInsight,
    getCommonTriggersInsight,
  }
} 