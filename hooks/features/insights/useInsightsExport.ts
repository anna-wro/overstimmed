/** @fileoverview Exports filtered tracking entries as a downloadable CSV file. */
import { format } from "date-fns"
import type { TrackingEntry } from "@/lib/entries"
import { insightsPageCopy } from "@/copy/insights"

export function useInsightsExport() {
  const exportCSV = (filteredEntries: TrackingEntry[]) => {
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

  return { exportCSV }
} 