import { useMemo } from "react"
import type { TrackingEntry } from "@/lib/entries"
import { insightsPageCopy } from "@/copy/insights"

// Helper function to get time of day
const getTimeOfDay = (date: Date): string => {
  const hours = date.getHours()
  if (hours >= 5 && hours < 12) return "morning"
  if (hours >= 12 && hours < 17) return "afternoon"
  if (hours >= 17 && hours < 21) return "evening"
  return "night"
}

export function usePatternDetection(filteredEntries: TrackingEntry[]) {
  const patterns = useMemo(() => {
    if (filteredEntries.length < 5) return []

    const detectedPatterns = []

    // Check for high stimulation patterns with negative experience
    const highStimNegativeEntries = filteredEntries.filter(
      (entry) => entry.stimulationLevel >= 7 && entry.stimulationType === "negative",
    )

    if (highStimNegativeEntries.length >= 3) {
      const highStimTriggers = highStimNegativeEntries
        .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
        .filter((t) => t.length > 0)

      const triggerFreq = highStimTriggers.reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const commonTriggers = Object.entries(triggerFreq)
        .filter(([_, count]) => count >= 2)
        .map(([trigger]) => trigger)

      if (commonTriggers.length > 0) {
        detectedPatterns.push({
          type: "high-stimulation-negative",
          description: `${insightsPageCopy.patternTypes.highStimulationNegative} ${commonTriggers.join(", ")}`,
          severity: "warning",
        })
      }
    }

    // Check for high stimulation patterns with positive experience
    const highStimPositiveEntries = filteredEntries.filter(
      (entry) => entry.stimulationLevel >= 7 && entry.stimulationType === "positive",
    )

    if (highStimPositiveEntries.length >= 3) {
      const highStimTriggers = highStimPositiveEntries
        .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
        .filter((t) => t.length > 0)

      const triggerFreq = highStimTriggers.reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const commonTriggers = Object.entries(triggerFreq)
        .filter(([_, count]) => count >= 2)
        .map(([trigger]) => trigger)

      if (commonTriggers.length > 0) {
        detectedPatterns.push({
          type: "high-stimulation-positive",
          description: `${insightsPageCopy.patternTypes.highStimulationPositive} ${commonTriggers.join(", ")}`,
          severity: "success",
        })
      }
    }

    // Check for low energy patterns
    const lowEnergyEntries = filteredEntries.filter((entry) => entry.energyLevel <= 3)
    if (lowEnergyEntries.length >= 3) {
      const lowEnergyTimes = lowEnergyEntries.map((entry) => getTimeOfDay(new Date(entry.timestamp)))

      const timeFreq = lowEnergyTimes.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const commonTime = Object.entries(timeFreq)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count >= 2)
        .map(([time]) => time)[0]

      if (commonTime) {
        detectedPatterns.push({
          type: "low-energy",
          description: `${insightsPageCopy.patternTypes.lowEnergy} ${commonTime}`,
          severity: "info",
        })
      }
    }

    // Check for positive experiences
    const positiveEntries = filteredEntries.filter((entry) => entry.stimulationType === "positive")
    if (positiveEntries.length >= 2) {
      const activities = positiveEntries
        .flatMap((entry) => entry.activities.split(",").map((a) => a.trim()))
        .filter((a) => a.length > 0)

      const activityFreq = activities.reduce((acc, activity) => {
        acc[activity] = (acc[activity] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const commonActivities = Object.entries(activityFreq)
        .filter(([_, count]) => count >= 2)
        .map(([activity]) => activity)

      if (commonActivities.length > 0) {
        detectedPatterns.push({
          type: "positive-experience",
          description: `${insightsPageCopy.patternTypes.positiveExperience} ${commonActivities.join(", ")}`,
          severity: "success",
        })
      }
    }

    return detectedPatterns
  }, [filteredEntries])

  return { patterns }
} 