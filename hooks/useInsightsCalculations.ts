import { useMemo } from "react"
import { format } from "date-fns"
import type { TrackingEntry } from "./useInsightsData"
import { insightsPageCopy } from "@/copy/insights"

// Helper functions
const getTimeOfDay = (date: Date): string => {
  const hours = date.getHours()
  if (hours >= 5 && hours < 12) return "morning"
  if (hours >= 12 && hours < 17) return "afternoon"
  if (hours >= 17 && hours < 21) return "evening"
  return "night"
}

const getDayOfWeek = (date: Date): string => {
  return format(date, "EEEE").toLowerCase()
}

const isComfortableStimulation = (entry: TrackingEntry): boolean => {
  if (entry.stimulationLevel <= 3) {
    return entry.stimulationType === "positive"
  }
  if (entry.stimulationLevel <= 6) {
    return entry.stimulationType !== "negative"
  }
  return entry.stimulationType === "positive"
}

const getBalancedStates = (entries: TrackingEntry[]) => {
  return entries.filter(
    (entry) =>
      entry.energyLevel >= 4 &&
      entry.energyLevel <= 7 &&
      ((entry.stimulationLevel >= 4 && entry.stimulationLevel <= 6) || entry.stimulationType === "positive"),
  )
}

const getRecoveryPatterns = (entries: TrackingEntry[]) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  const patterns = []

  for (let i = 0; i < sortedEntries.length - 1; i++) {
    const current = sortedEntries[i]
    const next = sortedEntries[i + 1]

    if (
      current.stimulationLevel >= 7 &&
      current.stimulationType === "negative" &&
      (next.stimulationLevel < current.stimulationLevel - 2 || next.stimulationType === "positive")
    ) {
      patterns.push({
        highStimEntry: current,
        recoveryEntry: next,
        timeDiff: new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime(),
        activities: next.activities,
      })
    }
  }

  return patterns
}

const getEnvironmentalFactors = (entries: TrackingEntry[]) => {
  const environmentKeywords = [
    "home", "work", "office", "school", "outdoors", "nature", "park", "store", 
    "shopping", "restaurant", "cafe", "library", "quiet", "noisy", "loud", 
    "bright", "dark", "crowded",
  ]

  const environments: Record<string, {
    count: number
    energy: number
    stimulation: number
    positiveCount: number
    neutralCount: number
    negativeCount: number
  }> = {}

  entries.forEach((entry) => {
    const text = `${entry.activities} ${entry.notes}`.toLowerCase()

    environmentKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        if (!environments[keyword]) {
          environments[keyword] = {
            count: 0, energy: 0, stimulation: 0,
            positiveCount: 0, neutralCount: 0, negativeCount: 0,
          }
        }

        environments[keyword].count += 1
        environments[keyword].energy += entry.energyLevel
        environments[keyword].stimulation += entry.stimulationLevel

        if (entry.stimulationType === "positive") {
          environments[keyword].positiveCount += 1
        } else if (entry.stimulationType === "neutral") {
          environments[keyword].neutralCount += 1
        } else if (entry.stimulationType === "negative") {
          environments[keyword].negativeCount += 1
        }
      }
    })
  })

  Object.keys(environments).forEach((key) => {
    const env = environments[key]
    if (env.count > 0) {
      env.energy = Math.round((env.energy / env.count) * 10) / 10
      env.stimulation = Math.round((env.stimulation / env.count) * 10) / 10
    }
  })

  return Object.entries(environments)
    .filter(([_, data]) => data.count >= 2)
    .map(([environment, data]) => ({
      environment,
      ...data,
      positivePercent: Math.round((data.positiveCount / data.count) * 100),
      neutralPercent: Math.round((data.neutralCount / data.count) * 100),
      negativePercent: Math.round((data.negativeCount / data.count) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

export function useInsightsCalculations(filteredEntries: TrackingEntry[]) {
  // Basic statistics
  const avgEnergyLevel = useMemo(() => {
    return filteredEntries.length > 0
      ? Math.round((filteredEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / filteredEntries.length) * 10) / 10
      : 0
  }, [filteredEntries])

  const avgStimulationLevel = useMemo(() => {
    return filteredEntries.length > 0
      ? Math.round((filteredEntries.reduce((sum, entry) => sum + entry.stimulationLevel, 0) / filteredEntries.length) * 10) / 10
      : 0
  }, [filteredEntries])

  // Stimulation types count
  const stimulationTypes = useMemo(() => {
    return filteredEntries.reduce((acc, entry) => {
      acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [filteredEntries])

  // Chart data
  const chartData = useMemo(() => {
    return filteredEntries
      .map((entry) => ({
        date: format(new Date(entry.timestamp), "MM/dd"),
        energy: entry.energyLevel,
        stimulation: entry.stimulationLevel,
        timestamp: entry.timestamp,
        type: entry.stimulationType,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [filteredEntries])

  // Triggers analysis
  const topTriggers = useMemo(() => {
    const allTriggers = filteredEntries
      .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
      .filter((t) => t.length > 0)

    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([trigger, count]) => ({ trigger, count }))
  }, [filteredEntries])

  // Time of day analysis
  const timeOfDayData = useMemo(() => {
    const data = {
      morning: { energy: 0, stimulation: 0, count: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0, comfortableStimCount: 0 },
      afternoon: { energy: 0, stimulation: 0, count: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0, comfortableStimCount: 0 },
      evening: { energy: 0, stimulation: 0, count: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0, comfortableStimCount: 0 },
      night: { energy: 0, stimulation: 0, count: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0, comfortableStimCount: 0 },
    }

    filteredEntries.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const timeOfDay = getTimeOfDay(date) as keyof typeof data

      data[timeOfDay].energy += entry.energyLevel
      data[timeOfDay].stimulation += entry.stimulationLevel
      data[timeOfDay].count += 1

      if (entry.stimulationType === "positive") {
        data[timeOfDay].positiveCount += 1
      } else if (entry.stimulationType === "neutral") {
        data[timeOfDay].neutralCount += 1
      } else if (entry.stimulationType === "negative") {
        data[timeOfDay].negativeCount += 1
      }

      if (isComfortableStimulation(entry)) {
        data[timeOfDay].comfortableStimCount += 1
      }
    })

    Object.keys(data).forEach((key) => {
      const timeData = data[key as keyof typeof data]
      if (timeData.count > 0) {
        timeData.energy = Math.round((timeData.energy / timeData.count) * 10) / 10
        timeData.stimulation = Math.round((timeData.stimulation / timeData.count) * 10) / 10
      }
    })

    return Object.entries(data).map(([time, values]) => ({
      time,
      energy: values.count > 0 ? values.energy : 0,
      stimulation: values.count > 0 ? values.stimulation : 0,
      count: values.count,
      positivePercent: values.count > 0 ? Math.round((values.positiveCount / values.count) * 100) : 0,
      comfortableStimPercent: values.count > 0 ? Math.round((values.comfortableStimCount / values.count) * 100) : 0,
    }))
  }, [filteredEntries])

  // Day of week analysis
  const dayOfWeekData = useMemo(() => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const data = days.reduce((acc, day) => {
      acc[day] = { energy: 0, stimulation: 0, count: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0, comfortableStimCount: 0 }
      return acc
    }, {} as Record<string, { energy: number; stimulation: number; count: number; positiveCount: number; neutralCount: number; negativeCount: number; comfortableStimCount: number }>)

    filteredEntries.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const day = getDayOfWeek(date)

      data[day].energy += entry.energyLevel
      data[day].stimulation += entry.stimulationLevel
      data[day].count += 1

      if (entry.stimulationType === "positive") {
        data[day].positiveCount += 1
      } else if (entry.stimulationType === "neutral") {
        data[day].neutralCount += 1
      } else if (entry.stimulationType === "negative") {
        data[day].negativeCount += 1
      }

      if (isComfortableStimulation(entry)) {
        data[day].comfortableStimCount += 1
      }
    })

    Object.keys(data).forEach((key) => {
      const dayData = data[key]
      if (dayData.count > 0) {
        dayData.energy = Math.round((dayData.energy / dayData.count) * 10) / 10
        dayData.stimulation = Math.round((dayData.stimulation / dayData.count) * 10) / 10
      }
    })

    return days.map((day) => ({
      day,
      energy: data[day].count > 0 ? data[day].energy : 0,
      stimulation: data[day].count > 0 ? data[day].stimulation : 0,
      count: data[day].count,
      positivePercent: data[day].count > 0 ? Math.round((data[day].positiveCount / data[day].count) * 100) : 0,
      comfortableStimPercent: data[day].count > 0 ? Math.round((data[day].comfortableStimCount / data[day].count) * 100) : 0,
    }))
  }, [filteredEntries])

  // Correlation data
  const correlationData = useMemo(() => {
    return filteredEntries.map((entry) => ({
      energy: entry.energyLevel,
      stimulation: entry.stimulationLevel,
      type: entry.stimulationType,
      comfortable: isComfortableStimulation(entry),
    }))
  }, [filteredEntries])

  // Balanced states analysis
  const balancedStatesData = useMemo(() => {
    const balancedEntries = getBalancedStates(filteredEntries)

    if (balancedEntries.length === 0) {
      return { count: 0, timeOfDay: null, dayOfWeek: null, activities: [] }
    }

    const timeOfDayCounts: Record<string, number> = {}
    balancedEntries.forEach((entry) => {
      const timeOfDay = getTimeOfDay(new Date(entry.timestamp))
      timeOfDayCounts[timeOfDay] = (timeOfDayCounts[timeOfDay] || 0) + 1
    })

    const dayOfWeekCounts: Record<string, number> = {}
    balancedEntries.forEach((entry) => {
      const dayOfWeek = getDayOfWeek(new Date(entry.timestamp))
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1
    })

    const activities = balancedEntries
      .flatMap((entry) => entry.activities.split(",").map((a) => a.trim()))
      .filter((a) => a.length > 0)

    const activityCounts: Record<string, number> = {}
    activities.forEach((activity) => {
      activityCounts[activity] = (activityCounts[activity] || 0) + 1
    })

    const commonActivities = Object.entries(activityCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }))

    return {
      count: balancedEntries.length,
      timeOfDay: Object.entries(timeOfDayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      dayOfWeek: Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      activities: commonActivities,
    }
  }, [filteredEntries])

  // Recovery patterns analysis
  const recoveryPatternsData = useMemo(() => {
    const patterns = getRecoveryPatterns(filteredEntries)

    if (patterns.length === 0) {
      return { count: 0, avgRecoveryTime: 0, activities: [] }
    }

    const avgRecoveryTime = patterns.reduce((sum, p) => sum + p.timeDiff, 0) / patterns.length / (1000 * 60 * 60)

    const activities = patterns
      .flatMap((p) => p.recoveryEntry.activities.split(",").map((a) => a.trim()))
      .filter((a) => a.length > 0)

    const activityCounts: Record<string, number> = {}
    activities.forEach((activity) => {
      activityCounts[activity] = (activityCounts[activity] || 0) + 1
    })

    const commonActivities = Object.entries(activityCounts)
      .filter(([_, count]) => count >= 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }))

    return {
      count: patterns.length,
      avgRecoveryTime: Math.round(avgRecoveryTime * 10) / 10,
      activities: commonActivities,
    }
  }, [filteredEntries])

  // Environmental factors analysis
  const environmentalFactorsData = useMemo(() => {
    return getEnvironmentalFactors(filteredEntries)
  }, [filteredEntries])

  return {
    avgEnergyLevel,
    avgStimulationLevel,
    stimulationTypes,
    chartData,
    topTriggers,
    timeOfDayData,
    dayOfWeekData,
    correlationData,
    balancedStatesData,
    recoveryPatternsData,
    environmentalFactorsData,
  }
} 