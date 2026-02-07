/**
 * Shared types and mappers for tracking entries (app ↔ Supabase).
 * @fileoverview Entry shape and DB row mapping for the entries table.
 */

export type TrackingEntry = {
  id?: string
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  feelings?: string
  activities: string
  notes: string
}

export type EntriesRow = {
  id: string
  user_id: string | null
  timestamp: string
  energy_level: number
  stimulation_level: number
  stimulation_type: string
  triggers: string
  feelings: string
  activities: string
  notes: string
  created_at?: string
}

export type EntriesInsertRow = Omit<EntriesRow, "id" | "created_at">

export function mapRowToEntry(row: EntriesRow): TrackingEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    energyLevel: row.energy_level,
    stimulationLevel: row.stimulation_level,
    stimulationType: row.stimulation_type,
    triggers: row.triggers ?? '',
    feelings: row.feelings ?? '',
    activities: row.activities ?? '',
    notes: row.notes ?? '',
  }
}

export function mapEntryToRow(
  entry: Omit<TrackingEntry, "id">,
  userId: string
): EntriesInsertRow {
  return {
    user_id: userId,
    timestamp: entry.timestamp,
    energy_level: entry.energyLevel,
    stimulation_level: entry.stimulationLevel,
    stimulation_type: entry.stimulationType,
    triggers: entry.triggers ?? "",
    feelings: entry.feelings ?? "",
    activities: entry.activities ?? "",
    notes: entry.notes ?? "",
  }
}
