"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import {
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  Battery,
  AlertCircle,
  Info,
  Download,
  AlertTriangle,
  Lightbulb,
  LayoutDashboard,
} from "lucide-react"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import TrendsTab from "@/components/insights/TrendsTab"
import PatternsTab from "@/components/insights/PatternsTab"
import TriggersTab from "@/components/insights/TriggersTab"
import CorrelationTab from "@/components/insights/CorrelationTab"
import SummaryTab from "@/components/insights/SummaryTab"
import CalendarTab from "@/components/insights/CalendarTab"
import RecommendationsTab from "@/components/insights/RecommendationsTab"
import { insightsPageCopy } from "@/copy/insights"

type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

// Helper function to get time of day
const getTimeOfDay = (date: Date): string => {
  const hours = date.getHours()
  if (hours >= 5 && hours < 12) return "morning"
  if (hours >= 12 && hours < 17) return "afternoon"
  if (hours >= 17 && hours < 21) return "evening"
  return "night"
}

// Helper function to extract day of week
const getDayOfWeek = (date: Date): string => {
  return format(date, "EEEE").toLowerCase()
}

// Helper function to determine if a stimulation level is comfortable based on type
const isComfortableStimulation = (entry: TrackingEntry): boolean => {
  // Low stimulation (0-3) is comfortable if rated positive, uncomfortable if negative
  if (entry.stimulationLevel <= 3) {
    return entry.stimulationType === "positive"
  }

  // Medium stimulation (4-6) is generally comfortable unless rated negative
  if (entry.stimulationLevel <= 6) {
    return entry.stimulationType !== "negative"
  }

  // High stimulation (7-10) is uncomfortable unless rated positive
  return entry.stimulationType === "positive"
}

// Add this function to calculate balanced states - now considering stimulation type
const getBalancedStates = (entries: TrackingEntry[]) => {
  return entries.filter(
    (entry) =>
      // Energy in moderate range (4-7)
      entry.energyLevel >= 4 &&
      entry.energyLevel <= 7 &&
      // Either: medium stimulation (4-6) OR stimulation rated as positive
      ((entry.stimulationLevel >= 4 && entry.stimulationLevel <= 6) || entry.stimulationType === "positive"),
  )
}

// Add this function to identify recovery patterns
const getRecoveryPatterns = (entries: TrackingEntry[]) => {
  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const patterns = []

  for (let i = 0; i < sortedEntries.length - 1; i++) {
    const current = sortedEntries[i]
    const next = sortedEntries[i + 1]

    // If current entry has high stimulation rated as negative and next has lower
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

// Add this function to identify environmental factors
const getEnvironmentalFactors = (entries: TrackingEntry[]) => {
  // Extract environments from activities and notes
  const environmentKeywords = [
    "home",
    "work",
    "office",
    "school",
    "outdoors",
    "nature",
    "park",
    "store",
    "shopping",
    "restaurant",
    "cafe",
    "library",
    "quiet",
    "noisy",
    "loud",
    "bright",
    "dark",
    "crowded",
  ]

  const environments: Record<
    string,
    {
      count: number
      energy: number
      stimulation: number
      positiveCount: number
      neutralCount: number
      negativeCount: number
    }
  > = {}

  entries.forEach((entry) => {
    const text = `${entry.activities} ${entry.notes}`.toLowerCase()

    environmentKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        if (!environments[keyword]) {
          environments[keyword] = {
            count: 0,
            energy: 0,
            stimulation: 0,
            positiveCount: 0,
            neutralCount: 0,
            negativeCount: 0,
          }
        }

        environments[keyword].count += 1
        environments[keyword].energy += entry.energyLevel
        environments[keyword].stimulation += entry.stimulationLevel

        // Track experience types
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

  // Calculate averages and percentages
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

export default function InsightsPage() {
  const [entries, setEntries] = useState<TrackingEntry[]>([])
  const [timeRange, setTimeRange] = useState("30")
  const [filteredEntries, setFilteredEntries] = useState<TrackingEntry[]>([])
  const [selectedTab, setSelectedTab] = useState("summary")

  // Color constants
  const COLORS = {
    energy: "#57b185",
    stimulation: "#8b5cf6",
    positive: "#57b185",
    neutral: "#b08c6c",
    negative: "#d27f97",
    comfortable: "#57b185",
    uncomfortable: "#d27f97",
  }

  useEffect(() => {
    // Load tracking entries from localStorage
    const savedEntries = localStorage.getItem("trackingEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      const days = Number.parseInt(timeRange)
      const startDate = startOfDay(subDays(new Date(), days))
      const endDate = endOfDay(new Date())

      const filtered = entries.filter((entry) => {
        const entryDate = new Date(entry.timestamp)
        return isWithinInterval(entryDate, { start: startDate, end: endDate })
      })

      setFilteredEntries(filtered)
    }
  }, [entries, timeRange])

  // Calculate average energy and stimulation levels
  const avgEnergyLevel =
    filteredEntries.length > 0
      ? Math.round((filteredEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / filteredEntries.length) * 10) /
        10
      : 0

  const avgStimulationLevel =
    filteredEntries.length > 0
      ? Math.round(
          (filteredEntries.reduce((sum, entry) => sum + entry.stimulationLevel, 0) / filteredEntries.length) * 10,
        ) / 10
      : 0

  // Count stimulation types
  const stimulationTypes = filteredEntries.reduce(
    (acc, entry) => {
      acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Format data for charts
  const chartData = filteredEntries
    .map((entry) => ({
      date: format(new Date(entry.timestamp), "MM/dd"),
      energy: entry.energyLevel,
      stimulation: entry.stimulationLevel,
      timestamp: entry.timestamp,
      type: entry.stimulationType,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Extract common triggers
  const allTriggers = filteredEntries
    .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
    .filter((t) => t.length > 0)

  const triggerCounts = allTriggers.reduce(
    (acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([trigger, count]) => ({ trigger, count }))

  // Time of day analysis
  const timeOfDayData = useMemo(() => {
    const data = {
      morning: {
        energy: 0,
        stimulation: 0,
        count: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        comfortableStimCount: 0,
      },
      afternoon: {
        energy: 0,
        stimulation: 0,
        count: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        comfortableStimCount: 0,
      },
      evening: {
        energy: 0,
        stimulation: 0,
        count: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        comfortableStimCount: 0,
      },
      night: {
        energy: 0,
        stimulation: 0,
        count: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        comfortableStimCount: 0,
      },
    }

    filteredEntries.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const timeOfDay = getTimeOfDay(date) as keyof typeof data

      data[timeOfDay].energy += entry.energyLevel
      data[timeOfDay].stimulation += entry.stimulationLevel
      data[timeOfDay].count += 1

      // Track experience types
      if (entry.stimulationType === "positive") {
        data[timeOfDay].positiveCount += 1
      } else if (entry.stimulationType === "neutral") {
        data[timeOfDay].neutralCount += 1
      } else if (entry.stimulationType === "negative") {
        data[timeOfDay].negativeCount += 1
      }

      // Track comfortable stimulation
      if (isComfortableStimulation(entry)) {
        data[timeOfDay].comfortableStimCount += 1
      }
    })

    // Calculate averages
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
    const data = days.reduce(
      (acc, day) => {
        acc[day] = {
          energy: 0,
          stimulation: 0,
          count: 0,
          positiveCount: 0,
          neutralCount: 0,
          negativeCount: 0,
          comfortableStimCount: 0,
        }
        return acc
      },
      {} as Record<
        string,
        {
          energy: number
          stimulation: number
          count: number
          positiveCount: number
          neutralCount: number
          negativeCount: number
          comfortableStimCount: number
        }
      >,
    )

    filteredEntries.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const day = getDayOfWeek(date)

      data[day].energy += entry.energyLevel
      data[day].stimulation += entry.stimulationLevel
      data[day].count += 1

      // Track experience types
      if (entry.stimulationType === "positive") {
        data[day].positiveCount += 1
      } else if (entry.stimulationType === "neutral") {
        data[day].neutralCount += 1
      } else if (entry.stimulationType === "negative") {
        data[day].negativeCount += 1
      }

      // Track comfortable stimulation
      if (isComfortableStimulation(entry)) {
        data[day].comfortableStimCount += 1
      }
    })

    // Calculate averages
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
      comfortableStimPercent:
        data[day].count > 0 ? Math.round((data[day].comfortableStimCount / data[day].count) * 100) : 0,
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

    if (balancedEntries.length === 0)
      return {
        count: 0,
        timeOfDay: null,
        dayOfWeek: null,
        activities: [],
      }

    // Find most common time of day for balanced states
    const timeOfDayCounts: Record<string, number> = {}
    balancedEntries.forEach((entry) => {
      const timeOfDay = getTimeOfDay(new Date(entry.timestamp))
      timeOfDayCounts[timeOfDay] = (timeOfDayCounts[timeOfDay] || 0) + 1
    })

    // Find most common day of week for balanced states
    const dayOfWeekCounts: Record<string, number> = {}
    balancedEntries.forEach((entry) => {
      const dayOfWeek = getDayOfWeek(new Date(entry.timestamp))
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1
    })

    // Find common activities during balanced states
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

    if (patterns.length === 0)
      return {
        count: 0,
        avgRecoveryTime: 0,
        activities: [],
      }

    // Calculate average recovery time in hours
    const avgRecoveryTime = patterns.reduce((sum, p) => sum + p.timeDiff, 0) / patterns.length / (1000 * 60 * 60)

    // Find common recovery activities
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

  // Pattern detection
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

      const triggerFreq = highStimTriggers.reduce(
        (acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

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

      const triggerFreq = highStimTriggers.reduce(
        (acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

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

      const timeFreq = lowEnergyTimes.reduce(
        (acc, time) => {
          acc[time] = (acc[time] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

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

      const activityFreq = activities.reduce(
        (acc, activity) => {
          acc[activity] = (acc[activity] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

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

  // Helper function to get pattern badge color
  const getPatternBadgeColor = (severity: string) => {
    switch (severity) {
      case "warning":
        return "bg-blush-100 text-blush-800 dark:bg-blush-900/50 dark:text-blush-300"
      case "success":
        return "bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
      case "info":
      default:
        return "bg-lavender-100 text-lavender-800 dark:bg-lavender-900/50 dark:text-lavender-300"
    }
  }

  // Helper function to get pattern icon
  const getPatternIcon = (type: string) => {
    switch (type) {
      case "high-stimulation-negative":
        return <AlertTriangle className="h-4 w-4" />
      case "high-stimulation-positive":
        return <Zap className="h-4 w-4" />
      case "low-energy":
        return <Battery className="h-4 w-4" />
      case "positive-experience":
        return <Activity className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Export data as CSV
  const exportCSV = () => {
    if (filteredEntries.length === 0) return

    const headers = insightsPageCopy.csvExport.headers

    const rows = filteredEntries.map((entry) => {
      const date = new Date(entry.timestamp)
      return [
        format(date, "yyyy-MM-dd"),
        format(date, "HH:mm:ss"),
        entry.energyLevel,
        entry.stimulationLevel,
        entry.stimulationType,
        `"${entry.triggers}"`,
        `"${entry.activities}"`,
        `"${entry.notes.replace(/"/g, '""')}"`,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${insightsPageCopy.csvExport.filename}-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8">

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{insightsPageCopy.pageTitle}</h1>
            <p className="text-muted-foreground">{insightsPageCopy.pageDescription}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={insightsPageCopy.timeRange.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{insightsPageCopy.timeRange.options.week}</SelectItem>
                  <SelectItem value="14">{insightsPageCopy.timeRange.options.twoWeeks}</SelectItem>
                  <SelectItem value="30">{insightsPageCopy.timeRange.options.month}</SelectItem>
                  <SelectItem value="90">{insightsPageCopy.timeRange.options.quarter}</SelectItem>
                  <SelectItem value="365">{insightsPageCopy.timeRange.options.year}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={filteredEntries.length === 0}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{insightsPageCopy.export.buttonText}</span>
            </Button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <h2 className="text-xl font-medium mb-2">{insightsPageCopy.emptyState.title}</h2>
              <p className="text-muted-foreground mb-6">
                {insightsPageCopy.emptyState.description}
              </p>
              <Link href="/track">
                <Button>{insightsPageCopy.emptyState.buttonText}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Streak and Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-mint-500" />
                    {insightsPageCopy.summaryCards.entryCount.title}
                  </CardTitle>
                  <CardDescription>{insightsPageCopy.summaryCards.entryCount.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-bold">{filteredEntries.length}</div>
                      <div className="text-xs text-muted-foreground">{insightsPageCopy.summaryCards.entryCount.totalEntries}</div>
                    </div>
                    <div className="h-10 border-r border-muted"></div>
                    <div>
                      <div className="text-3xl font-bold">
                        {Math.round(filteredEntries.length / (Number.parseInt(timeRange) / 7))}
                      </div>
                      <div className="text-xs text-muted-foreground">{insightsPageCopy.summaryCards.entryCount.entriesThisWeek}</div>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    {insightsPageCopy.summaryCards.entryCount.helpText}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Battery className="h-5 w-5 text-sand-500" />
                    {insightsPageCopy.summaryCards.energyLevel.title}
                  </CardTitle>
                  <CardDescription>{insightsPageCopy.summaryCards.energyLevel.average} {avgEnergyLevel}/10</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blush-400 via-sand-400 to-mint-400 dark:from-blush-500 dark:via-sand-500 dark:to-mint-500"
                      style={{ width: `${avgEnergyLevel * 10}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{insightsPageCopy.summaryCards.energyLevel.low}</span>
                    <span>{insightsPageCopy.summaryCards.energyLevel.medium}</span>
                    <span>{insightsPageCopy.summaryCards.energyLevel.high}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-lavender-500" />
                    {insightsPageCopy.summaryCards.stimulationLevel.title}
                  </CardTitle>
                  <CardDescription>{insightsPageCopy.summaryCards.stimulationLevel.average} {avgStimulationLevel}/10</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sand-400 via-lavender-400 to-blush-400 dark:from-sand-500 dark:via-lavender-500 dark:to-blush-500"
                      style={{ width: `${avgStimulationLevel * 10}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{insightsPageCopy.summaryCards.stimulationLevel.under}</span>
                    <span>{insightsPageCopy.summaryCards.stimulationLevel.balanced}</span>
                    <span>{insightsPageCopy.summaryCards.stimulationLevel.over}</span>
                  </div>

                  {/* New: Comfortable vs Uncomfortable */}
                  <div className="mt-3 pt-3 border-t border-muted">
                    <div className="text-xs text-muted-foreground mb-1">{insightsPageCopy.summaryCards.stimulationLevel.experienceLabel}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-mint-500"></div>
                        <span className="text-xs">
                          {Math.round(
                            (correlationData.filter((d) => d.comfortable).length / correlationData.length) * 100,
                          )}
                          % {insightsPageCopy.summaryCards.stimulationLevel.comfortable}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-blush-500"></div>
                        <span className="text-xs">
                          {Math.round(
                            (correlationData.filter((d) => !d.comfortable).length / correlationData.length) * 100,
                          )}
                          % {insightsPageCopy.summaryCards.stimulationLevel.uncomfortable}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detected Patterns */}
            {patterns.length > 0 && (
              <Card className="mb-8 bg-white/80 dark:bg-lavender-950/30 shadow-sm border-lavender-200 dark:border-lavender-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-lavender-500" />
                    {insightsPageCopy.detectedPatterns.title}
                  </CardTitle>
                  <CardDescription>{insightsPageCopy.detectedPatterns.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className={cn("flex items-start gap-3 rounded-lg p-3", getPatternBadgeColor(pattern.severity))}
                      >
                        {getPatternIcon(pattern.type)}
                        <p>{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="summary" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6 flex flex-wrap">
                <TabsTrigger value="summary">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.summary}
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.trends}
                </TabsTrigger>
                <TabsTrigger value="patterns">
                  <Clock className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.patterns}
                </TabsTrigger>
                <TabsTrigger value="triggers">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.triggers}
                </TabsTrigger>
                <TabsTrigger value="correlation">
                  <PieChart className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.correlation}
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.calendar}
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {insightsPageCopy.tabs.recommendations}
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <SummaryTab
                  filteredEntries={filteredEntries}
                  avgEnergyLevel={avgEnergyLevel}
                  avgStimulationLevel={avgStimulationLevel}
                  stimulationTypes={stimulationTypes}
                  balancedStatesData={balancedStatesData}
                  patterns={patterns}
                />
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends">
                <TrendsTab chartData={chartData} colors={COLORS} />
              </TabsContent>

              {/* Patterns Tab */}
              <TabsContent value="patterns">
                <PatternsTab
                  timeOfDayData={timeOfDayData}
                  dayOfWeekData={dayOfWeekData}
                  balancedStatesData={balancedStatesData}
                  recoveryPatternsData={recoveryPatternsData}
                  environmentalFactorsData={environmentalFactorsData}
                  stimulationTypes={stimulationTypes}
                  colors={COLORS}
                />
              </TabsContent>

              {/* Triggers Tab */}
              <TabsContent value="triggers">
                <TriggersTab topTriggers={topTriggers} filteredEntries={filteredEntries} colors={COLORS} />
              </TabsContent>

              {/* Correlation Tab */}
              <TabsContent value="correlation">
                <CorrelationTab correlationData={correlationData} colors={COLORS} />
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar">
                <CalendarTab filteredEntries={filteredEntries} />
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <RecommendationsTab
                  filteredEntries={filteredEntries}
                  balancedStatesData={balancedStatesData}
                  recoveryPatternsData={recoveryPatternsData}
                  environmentalFactorsData={environmentalFactorsData}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
