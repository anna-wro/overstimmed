import { useEffect, useState } from "react"
import { TriggerTag, DEFAULT_TRIGGERS } from "@/consts/triggerConstants"
import { useLocalStorage } from "./useLocalStorage"

export function useTagSuggestions(value: string[], searchQuery: string, selectedCategories: string[]) {
  const [previousTags, setPreviousTags] = useLocalStorage<TriggerTag[]>("triggerTags", DEFAULT_TRIGGERS)
  const [suggestions, setSuggestions] = useState<TriggerTag[]>([])

  useEffect(() => {
    const allAvailableTags = [...previousTags].filter((tag) => !value.includes(tag.text))
    let searchResults = allAvailableTags
    if (searchQuery) {
      searchResults = allAvailableTags.filter((tag) => tag.text.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    let filtered = searchResults
    if (selectedCategories.length > 0) {
      filtered = searchResults.filter((tag) => selectedCategories.includes(tag.category))
    }
    setSuggestions(filtered)
  }, [previousTags, value, searchQuery, selectedCategories])

  return { previousTags, setPreviousTags, suggestions, setSuggestions }
} 