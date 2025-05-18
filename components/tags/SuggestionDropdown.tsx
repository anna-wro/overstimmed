import React, { useState, useRef, useEffect } from "react"
import { CategoryFilter } from "./CategoryFilter"
import { SuggestionList } from "./SuggestionList"
import { TriggerTag } from "@/consts/triggerConstants"
import { trackingPageCopy } from "@/copy/track"

interface SuggestionDropdownProps {
  show: boolean
  suggestionsRef: React.RefObject<HTMLDivElement | null>
  value: string[]
  previousTags: TriggerTag[]
  onAddTag: (tag: string) => void
}

export const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  show,
  suggestionsRef,
  value,
  previousTags,
  onAddTag,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<TriggerTag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const suggestionItemsRef = useRef<(HTMLLIElement | null)[]>([])

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
    setFocusedSuggestionIndex(-1)
  }, [previousTags, value, searchQuery, selectedCategories])

  useEffect(() => {
    suggestionItemsRef.current = suggestionItemsRef.current.slice(0, suggestions.length)
  }, [suggestions])

  const handleSuggestionClick = (tag: string) => {
    onAddTag(tag)
    setSearchQuery("")
  }

  const handleSuggestionHover = (index: number) => {
    setFocusedSuggestionIndex(index)
  }

  const addCustomTag = () => {
    if (searchQuery.trim()) {
      onAddTag(searchQuery.trim())
      setSearchQuery("")
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const isExactMatch =
    searchQuery.trim() !== "" && previousTags.some((tag) => tag.text.toLowerCase() === searchQuery.trim().toLowerCase())

  if (!show) return null
  return (
    <div
      ref={suggestionsRef}
      className="absolute z-10 w-full rounded-b-md border border-t-0 bg-background shadow-lg"
      id="trigger-suggestions"
      role="listbox"
    >
      <div className="sticky top-0 z-20 border-b bg-background p-2">
        <CategoryFilter selectedCategories={selectedCategories} onToggle={toggleCategory} />
      </div>
      <SuggestionList
        suggestions={suggestions}
        focusedIndex={focusedSuggestionIndex}
        suggestionItemsRef={suggestionItemsRef}
        onSuggestionClick={handleSuggestionClick}
        onSuggestionHover={handleSuggestionHover}
        searchQuery={searchQuery}
        isExactMatch={isExactMatch}
        addCustomTag={addCustomTag}
        triggerCopy={trackingPageCopy.trigger}
      />
    </div>
  )
} 