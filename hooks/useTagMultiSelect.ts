import { useState, useRef, useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"

export type Tag = {
  text: string
  category: string
}

export function useTagMultiSelect(
  value: string[], 
  onChange: (tags: string[]) => void, 
  storageKey: string = "tags",
  defaultTags: Tag[] = []
) {
  const [previousTags, setPreviousTags] = useLocalStorage<Tag[]>(storageKey, defaultTags)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const suggestionItemsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const allAvailableTags = [...previousTags].filter((tag) => !value.includes(tag.text))
    let searchResults = allAvailableTags
    if (searchQuery) {
      searchResults = allAvailableTags.filter((tag) => tag.text.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    let filtered = searchResults
    setSuggestions(searchResults)
    setFocusedSuggestionIndex(-1)
  }, [previousTags, value, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    suggestionItemsRef.current = suggestionItemsRef.current.slice(0, suggestions.length)
  }, [suggestions])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value
    setSearchQuery(valueStr)
    if (!showSuggestions) {
      setShowSuggestions(true)
    }
  }

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      // Remove all logic related to selectedCategories and setSelectedCategories
      // If nothing remains, remove the function entirely
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
        addTag(suggestions[focusedSuggestionIndex].text)
      } else if (searchQuery.trim()) {
        addTag(searchQuery.trim())
      }
    } else if (e.key === "Backspace" && !searchQuery && value.length > 0) {
      removeTag(value.length - 1)
    } else if (e.key === "ArrowDown" && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      const newIndex = focusedSuggestionIndex < suggestions.length - 1 ? focusedSuggestionIndex + 1 : 0
      setFocusedSuggestionIndex(newIndex)
      if (suggestionItemsRef.current[newIndex]) {
        suggestionItemsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
      }
    } else if (e.key === "ArrowUp" && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      const newIndex = focusedSuggestionIndex > 0 ? focusedSuggestionIndex - 1 : suggestions.length - 1
      setFocusedSuggestionIndex(newIndex)
      if (suggestionItemsRef.current[newIndex]) {
        suggestionItemsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      const newTags = [...value, tag]
      onChange(newTags)
      setSearchQuery("")
      if (!previousTags.some((pt) => pt.text === tag)) {
        const newTag = { text: tag, category: "custom" }
        const updatedTags = [...previousTags, newTag]
        setPreviousTags(updatedTags)
      }
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions)
  }

  return {
    previousTags,
    showSuggestions,
    suggestions,
    searchQuery,
    focusedSuggestionIndex,
    inputRef,
    suggestionsRef,
    handleSearchInputChange,
    handleSearchInputKeyDown,
    addTag,
    removeTag,
    handleInputFocus,
    toggleSuggestions,
  }
} 