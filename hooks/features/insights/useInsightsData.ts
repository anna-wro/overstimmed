import { useState, useEffect } from "react"
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"

export type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

export function useInsightsData() {
  const [entries, setEntries] = useState<TrackingEntry[]>([])
  const [timeRange, setTimeRange] = useState("30")
  const [filteredEntries, setFilteredEntries] = useState<TrackingEntry[]>([])

  // Load tracking entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("trackingEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Filter entries based on time range
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

  return {
    entries,
    filteredEntries,
    timeRange,
    setTimeRange,
  }
} 