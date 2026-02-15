/** @fileoverview CSV serialization, parsing, and validation for tracking entries. */
import { format } from "date-fns"
import type { TrackingEntry } from "@/lib/entries"

type Settings = {
  theme: string
  highContrastMode: boolean
  fontSize: number
  reminders: boolean
  reminderFrequency: string
  dataRetentionPeriod: string
  exportFormat: string
}

// Convert tracking entries to CSV string
export function entriesToCSV(entries: TrackingEntry[]): string {
  // CSV header
  const header = [
    "Date",
    "Time",
    "Energy Level",
    "Stimulation Level",
    "Experience Type",
    "Triggers",
    "Activities",
    "Notes",
  ].join(",")

  // Format each entry as a CSV row
  const rows = entries.map((entry) => {
    const date = new Date(entry.timestamp)
    const dateStr = format(date, "yyyy-MM-dd")
    const timeStr = format(date, "HH:mm:ss")

    // Escape fields that might contain commas
    const escapeCsv = (str: string) => {
      if (!str) return ""
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    return [
      dateStr,
      timeStr,
      entry.energyLevel,
      entry.stimulationLevel,
      entry.stimulationType,
      escapeCsv(entry.triggers),
      escapeCsv(entry.activities),
      escapeCsv(entry.notes),
    ].join(",")
  })

  // Combine header and rows
  return [header, ...rows].join("\n")
}

// Parse CSV string to tracking entries
export function csvToEntries(csv: string): TrackingEntry[] {
  const lines = csv.split("\n")

  // Skip header row
  if (lines.length <= 1) {
    return []
  }

  const entries: TrackingEntry[] = []

  // Process each data row (skip header)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    // Parse CSV line, handling quoted fields
    const fields: string[] = []
    let currentField = ""
    let inQuotes = false

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j]

      if (char === '"') {
        if (j + 1 < lines[i].length && lines[i][j + 1] === '"') {
          // Double quotes inside quoted field
          currentField += '"'
          j++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        fields.push(currentField)
        currentField = ""
      } else {
        currentField += char
      }
    }

    // Add the last field
    fields.push(currentField)

    // Ensure we have enough fields
    if (fields.length >= 8) {
      try {
        const dateStr = fields[0]
        const timeStr = fields[1]
        const timestamp = new Date(`${dateStr}T${timeStr}`).toISOString()

        entries.push({
          timestamp,
          energyLevel: Number(fields[2]),
          stimulationLevel: Number(fields[3]),
          stimulationType: fields[4],
          triggers: fields[5],
          activities: fields[6],
          notes: fields[7],
        })
      } catch (error) {
        console.error("Error parsing CSV row:", error)
        // Continue with next row
      }
    }
  }

  return entries
}

// Validate CSV format
export function validateCSV(csv: string): { valid: boolean; message?: string } {
  const lines = csv.split("\n")

  // Check if file has content
  if (lines.length <= 1) {
    return { valid: false, message: "CSV file is empty or has no data rows" }
  }

  // Check header
  const expectedHeaders = [
    "Date",
    "Time",
    "Energy Level",
    "Stimulation Level",
    "Experience Type",
    "Triggers",
    "Activities",
    "Notes",
  ]
  const headerLine = lines[0].split(",")

  if (headerLine.length < expectedHeaders.length) {
    return {
      valid: false,
      message: `CSV header is missing required columns. Expected: ${expectedHeaders.join(", ")}`,
    }
  }

  // Check at least one data row
  if (lines.length < 2 || !lines[1].trim()) {
    return { valid: false, message: "CSV file has no data rows" }
  }

  return { valid: true }
}
