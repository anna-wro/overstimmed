import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/useToast"
import { TRIGGER_CATEGORIES, DEFAULT_TRIGGERS, TriggerTag } from "@/consts/triggerConstants"
import { useLocalStorage } from "./useLocalStorage"
import { trackingPageCopy } from "@/copy/track"

export function useTrackForm(dateTimeValue: string) {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stimulationLevel, setStimulationLevel] = useState(5)
  const [stimulationType, setStimulationType] = useState("neutral")
  const [searchQuery, setSearchQuery] = useState("")
  const [triggerTags, setTriggerTags] = useState<string[]>([])
  const [feelingTags, setFeelingTags] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<TriggerTag[]>([])
  const [previousTags, setPreviousTags] = useLocalStorage<TriggerTag[]>("triggerTags", DEFAULT_TRIGGERS)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [activities, setActivities] = useState("")
  const [notes, setNotes] = useState("")
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [formModified, setFormModified] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>
  const suggestionsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const suggestionItemsRef = useRef<(HTMLLIElement | null)[]>([])
  const [trackingEntries, setTrackingEntries] = useLocalStorage<any[]>("trackingEntries", [])

  useEffect(() => {
    if (
      energyLevel !== 5 ||
      stimulationLevel !== 5 ||
      stimulationType !== "neutral" ||
      triggerTags.length > 0 ||
      feelingTags.length > 0 ||
      activities !== "" ||
      notes !== ""
    ) {
      setFormModified(true)
    } else {
      setFormModified(false)
    }
  }, [energyLevel, stimulationLevel, stimulationType, triggerTags, feelingTags, activities, notes])

  useEffect(() => {
    const allAvailableTags = [...previousTags].filter((tag) => !triggerTags.includes(tag.text))
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
  }, [previousTags, triggerTags, searchQuery, selectedCategories])

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

  const handleUnsavedDialogAction = (action: "save" | "discard" | "cancel") => {
    setShowUnsavedDialog(false)
    if (action === "save") {
      handleSave()
      if (pendingNavigation) {
        router.push(pendingNavigation)
      }
    } else if (action === "discard") {
      if (pendingNavigation) {
        router.push(pendingNavigation)
      }
    }
    setPendingNavigation(null)
  }

  const handleSave = () => {
    const entry = {
      timestamp: dateTimeValue,
      energyLevel,
      stimulationLevel,
      stimulationType,
      triggers: triggerTags.join(", "),
      feelings: feelingTags.join(", "),
      activities,
      notes,
    }
    setTrackingEntries([...trackingEntries, entry])
    const newTagObjects = triggerTags.map((tag) => {
      const existingTag = previousTags.find((pt) => pt.text === tag)
      if (existingTag) {
        return existingTag
      }
      const matchedDefault = DEFAULT_TRIGGERS.find((dt) => dt.text.toLowerCase() === tag.toLowerCase())
      return {
        text: tag,
        category: matchedDefault?.category || "custom",
      }
    })
    const uniqueTags = [...previousTags]
    newTagObjects.forEach((newTag) => {
      if (!previousTags.some((pt) => pt.text === newTag.text)) {
        uniqueTags.push(newTag)
      }
    })
    setPreviousTags(uniqueTags)
    toast({
      title: trackingPageCopy.dialogs.entrySaved.title,
      description: trackingPageCopy.dialogs.entrySaved.description,
    })
    setFormModified(false)
    router.push("/")
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
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
    } else if (e.key === "Backspace" && !searchQuery && triggerTags.length > 0) {
      removeTag(triggerTags.length - 1)
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
    if (tag && !triggerTags.includes(tag)) {
      setTriggerTags([...triggerTags, tag])
      setSearchQuery("")
      if (!previousTags.some((pt) => pt.text === tag)) {
        const newTag = { text: tag, category: "custom" }
        const updatedTags = [...previousTags, newTag]
        setPreviousTags(updatedTags)
        toast({
          title: trackingPageCopy.dialogs.newTagCreated.title,
          description: trackingPageCopy.dialogs.newTagCreated.description(tag),
          duration: 3000,
        })
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
    const newTags = [...triggerTags]
    newTags.splice(index, 1)
    setTriggerTags(newTags)
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

  return {
    energyLevel,
    setEnergyLevel,
    stimulationLevel,
    setStimulationLevel,
    stimulationType,
    setStimulationType,
    searchQuery,
    setSearchQuery,
    triggerTags,
    setTriggerTags,
    feelingTags,
    setFeelingTags,
    suggestions,
    setSuggestions,
    previousTags,
    setPreviousTags,
    showSuggestions,
    setShowSuggestions,
    selectedCategories,
    setSelectedCategories,
    activities,
    setActivities,
    notes,
    setNotes,
    focusedSuggestionIndex,
    setFocusedSuggestionIndex,
    formModified,
    setFormModified,
    showUnsavedDialog,
    setShowUnsavedDialog,
    pendingNavigation,
    setPendingNavigation,
    inputRef,
    suggestionsRef,
    suggestionItemsRef,
    handleUnsavedDialogAction,
    handleSave,
    handleSearchInputChange,
    handleSearchInputKeyDown,
    addTag,
    addCustomTag,
    removeTag,
    handleSuggestionClick,
    handleInputFocus,
    toggleCategory,
    isExactMatch,
    toggleSuggestions,
  }
} 