import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/shared/useLocalStorage'
import { useTheme } from 'next-themes'
import { subDays, format } from 'date-fns'

type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

type DashboardStats = {
  totalEntries: number
  avgEnergy: number
  avgStimulation: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
}

type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
}

export const useDashboardData = () => {
  const [latestEntry, setLatestEntry] = useState<TrackingEntry | null>(null)
  const [entries, setEntries] = useLocalStorage<TrackingEntry[]>("trackingEntries", [])
  const [recentEntries, setRecentEntries] = useState<ChartDataPoint[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEntries: 0,
    avgEnergy: 0,
    avgStimulation: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  })
  const { setTheme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (entries.length > 0) {
      // Sort by timestamp (newest first) and get the latest entry
      const sorted = [...entries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      setLatestEntry(sorted[0])

      // Calculate statistics
      const totalEntries = entries.length
      const avgEnergy =
        Math.round((entries.reduce((sum, entry) => sum + entry.energyLevel, 0) / totalEntries) * 10) / 10
      const avgStimulation =
        Math.round((entries.reduce((sum, entry) => sum + entry.stimulationLevel, 0) / totalEntries) * 10) / 10

      // Count by type
      const positiveCount = entries.filter((entry) => entry.stimulationType === "positive").length
      const negativeCount = entries.filter((entry) => entry.stimulationType === "negative").length
      const neutralCount = entries.filter((entry) => entry.stimulationType === "neutral").length

      setStats({
        totalEntries,
        avgEnergy,
        avgStimulation,
        positiveCount,
        negativeCount,
        neutralCount,
      })

      // Get recent entries for chart (last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7).getTime()
      const recent = sorted
        .filter((entry) => new Date(entry.timestamp).getTime() > sevenDaysAgo)
        .slice(0, 7)
        .reverse()
        .map((entry) => ({
          date: format(new Date(entry.timestamp), "MM/dd"),
          energy: entry.energyLevel,
          stimulation: entry.stimulationLevel,
        }))

      setRecentEntries(recent)
    }

    // Load theme settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.theme) {
          setTheme(settings.theme)
        }
        if (settings.highContrastMode) {
          document.documentElement.classList.add("high-contrast")
        } else {
          document.documentElement.classList.remove("high-contrast")
        }
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    }
    setLoading(false)
  }, [entries, setTheme])

  return {
    latestEntry,
    entries,
    recentEntries,
    stats,
    loading,
  }
} 