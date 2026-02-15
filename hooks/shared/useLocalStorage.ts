/**
 * @fileoverview Generic localStorage-backed state hook with SSR safety.
 * @example const [value, setValue] = useLocalStorage<string>('key', 'default')
 */
import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const isFirstWrite = useRef(true)

  // Sync from localStorage after mount to avoid SSR/client hydration mismatch
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch {
      // ignore
    }
  }, [key])

  // Persist when storedValue changes; skip first run to avoid overwriting with default before sync
  useEffect(() => {
    if (isFirstWrite.current) {
      isFirstWrite.current = false
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // ignore
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
} 