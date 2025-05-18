import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Initialize from localStorage synchronously
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      return defaultValue
    }
  }) 

  // Write to localStorage when storedValue changes
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      // ignore
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
} 