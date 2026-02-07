/**
 * Fetches and mutates tracking entries from Supabase.
 * @fileoverview Single source of truth for entries (list, delete). Used by dashboard, archive, insights, settings.
 */

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { TrackingEntry } from "@/lib/entries"
import { mapRowToEntry, mapEntryToRow } from "@/lib/entries"

export function useEntries() {
  const [entries, setEntries] = useState<TrackingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error: e } = await supabase
      .from("entries")
      .select("*")
      .order("timestamp", { ascending: false })
    setLoading(false)
    if (e) {
      setError(e.message)
      setEntries([])
      return
    }
    setError(null)
    setEntries((data ?? []).map(mapRowToEntry))
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const deleteEntry = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error: e } = await supabase.from("entries").delete().eq("id", id)
    if (e) throw e
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const deleteAll = useCallback(async () => {
    const supabase = createClient()
    const { error: e } = await supabase.from("entries").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    if (e) throw e
    setEntries([])
  }, [])

  const insertEntries = useCallback(async (toInsert: Omit<TrackingEntry, "id">[]) => {
    if (toInsert.length === 0) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")
    const rows = toInsert.map((entry) => mapEntryToRow(entry, user.id))
    const { error: e } = await supabase.from("entries").insert(rows)
    if (e) throw e
    await refetch()
  }, [refetch])

  return { entries, loading, error, refetch, deleteEntry, deleteAll, insertEntries }
}
