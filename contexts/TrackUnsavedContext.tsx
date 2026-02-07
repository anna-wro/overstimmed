"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

export type TrackUnsavedValue = {
  hasUnsaved: boolean
  openDialog: (path: string) => void
} | null

type TrackUnsavedContextValue = {
  trackUnsaved: TrackUnsavedValue
  setTrackUnsaved: (v: TrackUnsavedValue) => void
}

const TrackUnsavedContext = createContext<TrackUnsavedContextValue | null>(null)

export function TrackUnsavedProvider({ children }: { children: ReactNode }) {
  const [trackUnsaved, setTrackUnsavedState] = useState<TrackUnsavedValue>(null)
  const setTrackUnsaved = useCallback((v: TrackUnsavedValue) => setTrackUnsavedState(v), [])
  const value = useMemo(
    () => ({ trackUnsaved, setTrackUnsaved }),
    [trackUnsaved, setTrackUnsaved]
  )
  return (
    <TrackUnsavedContext.Provider value={value}>
      {children}
    </TrackUnsavedContext.Provider>
  )
}

export function useTrackUnsaved() {
  const ctx = useContext(TrackUnsavedContext)
  return ctx
}
