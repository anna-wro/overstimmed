import { useState, useEffect } from "react"
import { isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns"
import { useEntries } from "@/hooks/features/useEntries"
import type { TrackingEntry } from "@/lib/entries"

export function useInsightsData() {
  const { entries } = useEntries()
  const [timeRange, setTimeRange] = useState("30")
  const [filteredEntries, setFilteredEntries] = useState<TrackingEntry[]>([])

  useEffect(() => {
    if (entries.length === 0) {
      setFilteredEntries([])
      return
    }
    const days = Number.parseInt(timeRange)
    const startDate = startOfDay(subDays(new Date(), days))
    const endDate = endOfDay(new Date())
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp)
      return isWithinInterval(entryDate, { start: startDate, end: endDate })
    })
    setFilteredEntries(filtered)
  }, [entries, timeRange])

  return {
    entries,
    filteredEntries,
    timeRange,
    setTimeRange,
  }
}
