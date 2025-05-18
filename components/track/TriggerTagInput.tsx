import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ChevronDown, ChevronUp, PlusCircle, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { TRIGGER_CATEGORIES, DEFAULT_TRIGGERS, TriggerTag } from "./triggerConstants"
import { triggerCopy } from "@/copy/track"
import { getCategoryIcon } from "./utils"

interface TriggerTagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export const TriggerTagInput: React.FC<TriggerTagInputProps> = ({ value, onChange }) => {
  const [previousTags, setPreviousTags] = useState<TriggerTag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<TriggerTag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const suggestionItemsRef = useRef<(HTMLLIElement | null)[]>([])

  // Load previously used tags or initialize with defaults
  useEffect(() => {
    const savedTags = localStorage.getItem("triggerTags")
    if (savedTags) {
      try {
        const parsed = JSON.parse(savedTags)
        if (parsed.length > 0 && typeof parsed[0] === "string") {
          const converted = parsed.map((tag: string) => {
            const matchedDefault = DEFAULT_TRIGGERS.find((dt) => dt.text.toLowerCase() === tag.toLowerCase())
            return {
              text: tag,
              category: matchedDefault?.category || "custom",
            }
          })
          setPreviousTags(converted)
          localStorage.setItem("triggerTags", JSON.stringify(converted))
        } else {
          setPreviousTags(parsed)
        }
      } catch (e) {
        setPreviousTags(DEFAULT_TRIGGERS)
        localStorage.setItem("triggerTags", JSON.stringify(DEFAULT_TRIGGERS))
      }
    } else {
      setPreviousTags(DEFAULT_TRIGGERS)
      localStorage.setItem("triggerTags", JSON.stringify(DEFAULT_TRIGGERS))
    }
  }, [])

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

  const handleTabThroughCategories = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault()
      const currentIndex = TRIGGER_CATEGORIES.findIndex(
        (cat) => selectedCategories.length === 1 && selectedCategories[0] === cat.id,
      )
      if (selectedCategories.length !== 1) {
        setSelectedCategories([TRIGGER_CATEGORIES[TRIGGER_CATEGORIES.length - 1].id])
      } else if (currentIndex > 0) {
        setSelectedCategories([TRIGGER_CATEGORIES[currentIndex - 1].id])
      } else {
        setSelectedCategories([TRIGGER_CATEGORIES[TRIGGER_CATEGORIES.length - 1].id])
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      if (suggestions.length > 0) {
        e.preventDefault()
        addTag(suggestions[0].text)
      } else {
        e.preventDefault()
        const currentIndex = TRIGGER_CATEGORIES.findIndex(
          (cat) => selectedCategories.length === 1 && selectedCategories[0] === cat.id,
        )
        if (selectedCategories.length !== 1) {
          setSelectedCategories([TRIGGER_CATEGORIES[0].id])
        } else if (currentIndex < TRIGGER_CATEGORIES.length - 1) {
          setSelectedCategories([TRIGGER_CATEGORIES[currentIndex + 1].id])
        } else {
          setSelectedCategories([TRIGGER_CATEGORIES[0].id])
        }
      }
    }
  }

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      handleTabThroughCategories(e)
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
        localStorage.setItem("triggerTags", JSON.stringify(updatedTags))
      }
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const addCustomTag = () => {
    if (searchQuery.trim()) {
      addTag(searchQuery.trim())
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleSuggestionClick = (tag: string) => {
    addTag(tag)
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const isExactMatch =
    searchQuery.trim() !== "" && previousTags.some((tag) => tag.text.toLowerCase() === searchQuery.trim().toLowerCase())

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="triggers" className="text-sm font-medium text-foreground">
          {triggerCopy.label}
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleSuggestions}
          aria-label={showSuggestions ? triggerCopy.hideSuggestions : triggerCopy.showSuggestions}
        >
          {showSuggestions ? (
            <ChevronUp className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground" />
          )}
        </Button>
      </div>
      <div className="relative">
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 rounded-md border bg-background p-2",
            showSuggestions && "rounded-b-none border-b-0",
          )}
        >
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex h-6 items-center gap-1 px-2 py-1 text-xs bg-sand-100 text-sand-800 border border-sand-200 dark:bg-lavender-900/30 dark:text-lavender-300 dark:border-lavender-800 high-contrast:bg-primary/20 high-contrast:text-primary dark:high-contrast:bg-primary/30 dark:high-contrast:text-primary-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">{triggerCopy.removeTag.replace("{tag}", tag)}</span>
              </button>
            </Badge>
          ))}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              id="triggers"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchInputKeyDown}
              onFocus={handleInputFocus}
              placeholder={value.length ? triggerCopy.placeholderMore : triggerCopy.placeholder}
              className="pl-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-6 py-0 text-sm"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="trigger-suggestions"
              aria-activedescendant={
                focusedSuggestionIndex >= 0 ? `suggestion-${focusedSuggestionIndex}` : undefined
              }
            />
          </div>
        </div>

        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full rounded-b-md border border-t-0 bg-background shadow-lg"
            id="trigger-suggestions"
            role="listbox"
          >
            {/* Filter by category header */}
            <div className="sticky top-0 z-20 border-b bg-background p-2">
              <div className="flex flex-wrap gap-1">
                {TRIGGER_CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 gap-1 px-2 py-0",
                      selectedCategories.includes(category.id)
                        ? `bg-${category.color.split("-")[1]}-100 border-${category.color.split("-")[1]}-300 text-${category.color.split("-")[1]}-700 high-contrast:bg-accent high-contrast:border-primary`
                        : "",
                    )}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {getCategoryIcon(category.id, TRIGGER_CATEGORIES)}
                    <span className="text-xs">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Scrollable suggestions list */}
            <div className="max-h-60 overflow-y-auto py-1">
              {suggestions.length > 0 ? (
                <ul className="text-sm" role="listbox">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      ref={el => {
                        suggestionItemsRef.current[index] = el;
                      }}
                      id={`suggestion-${index}`}
                      className={cn(
                        "flex cursor-pointer items-center px-3 py-1.5 hover:bg-muted",
                        focusedSuggestionIndex === index && "bg-muted",
                      )}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      onMouseEnter={() => setFocusedSuggestionIndex(index)}
                      role="option"
                      aria-selected={focusedSuggestionIndex === index}
                    >
                      <span className="mr-2">{getCategoryIcon(suggestion.category, TRIGGER_CATEGORIES)}</span>
                      <span className="flex-1">{suggestion.text}</span>
                      {index === 0 && <span className="ml-2 text-xs text-muted-foreground">{triggerCopy.tabHint}</span>}
                      {index === focusedSuggestionIndex && (
                        <span className="ml-2 text-xs text-muted-foreground">{triggerCopy.enterHint}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                  {searchQuery.trim() ? (
                    <div className="space-y-2">
                      <p>{triggerCopy.noMatch}</p>
                      {!isExactMatch && searchQuery.trim() && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mx-auto flex items-center gap-1"
                          onClick={addCustomTag}
                        >
                          <PlusCircle className="h-3.5 w-3.5 text-lavender-500" />
                          <span>{triggerCopy.addCustom.replace("{tag}", searchQuery.trim())}</span>
                        </Button>
                      )}
                    </div>
                  ) : (
                    triggerCopy.typeToSearch
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {triggerCopy.helpText}
      </p>
    </div>
  )
} 