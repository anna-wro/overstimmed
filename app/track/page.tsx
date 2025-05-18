"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Plus,
  Minus,
  Battery,
  Zap,
  X,
  Search,
  Ear,
  Eye,
  Hand,
  Thermometer,
  Users,
  Coffee,
  Globe,
  Heart,
  Star,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SiteHeader } from "@/components/site-header"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, set } from "date-fns"
import { Switch } from "@/components/ui/switch"

// Trigger categories with emojis
const TRIGGER_CATEGORIES = [
  { id: "auditory", name: "Auditory", icon: Ear, color: "text-sky-500" },
  { id: "visual", name: "Visual", icon: Eye, color: "text-mint-500" },
  { id: "tactile", name: "Tactile", icon: Hand, color: "text-lavender-500" },
  { id: "olfactory", name: "Smell/Taste", icon: Coffee, color: "text-sand-500" },
  { id: "environmental", name: "Environmental", icon: Globe, color: "text-blush-500" },
  { id: "temperature", name: "Temperature", icon: Thermometer, color: "text-mint-500" },
  { id: "social", name: "Social", icon: Users, color: "text-sky-500" },
  { id: "internal", name: "Internal", icon: Heart, color: "text-blush-500" },
  { id: "custom", name: "Custom", icon: Star, color: "text-lavender-500" }, // New category for user-created tags
]

// Default sensory triggers and inputs with categories
const DEFAULT_TRIGGERS = [
  // Auditory
  { text: "Loud noises", category: "auditory" },
  { text: "Background chatter", category: "auditory" },
  { text: "Sudden sounds", category: "auditory" },
  { text: "Music", category: "auditory" },
  { text: "Repetitive sounds", category: "auditory" },
  { text: "Echoing", category: "auditory" },
  { text: "High-pitched noises", category: "auditory" },
  { text: "Appliance sounds", category: "auditory" },
  { text: "Traffic noise", category: "auditory" },
  // Visual
  { text: "Bright lights", category: "visual" },
  { text: "Fluorescent lighting", category: "visual" },
  { text: "Flashing lights", category: "visual" },
  { text: "Busy patterns", category: "visual" },
  { text: "Screen time", category: "visual" },
  { text: "Visual clutter", category: "visual" },
  { text: "Moving objects", category: "visual" },
  { text: "Bright colors", category: "visual" },
  // Tactile
  { text: "Clothing tags", category: "tactile" },
  { text: "Tight clothing", category: "tactile" },
  { text: "Certain fabrics", category: "tactile" },
  { text: "Light touch", category: "tactile" },
  { text: "Wet hands", category: "tactile" },
  { text: "Physical contact", category: "tactile" },
  { text: "Rough textures", category: "tactile" },
  { text: "Sticky surfaces", category: "tactile" },
  // Olfactory
  { text: "Strong smells", category: "olfactory" },
  { text: "Perfumes", category: "olfactory" },
  { text: "Food odors", category: "olfactory" },
  { text: "Cleaning products", category: "olfactory" },
  { text: "Scented candles", category: "olfactory" },
  // Temperature
  { text: "Temperature changes", category: "temperature" },
  { text: "Too hot", category: "temperature" },
  { text: "Too cold", category: "temperature" },
  { text: "Humidity", category: "temperature" },
  // Environmental
  { text: "Crowded spaces", category: "environmental" },
  { text: "New environments", category: "environmental" },
  { text: "Weather changes", category: "environmental" },
  { text: "Confined spaces", category: "environmental" },
  { text: "Open spaces", category: "environmental" },
  // Social
  { text: "Social interaction", category: "social" },
  { text: "Eye contact", category: "social" },
  { text: "Group conversations", category: "social" },
  { text: "Unexpected changes", category: "social" },
  { text: "Time pressure", category: "social" },
  { text: "Being interrupted", category: "social" },
  // Internal
  { text: "Hunger", category: "internal" },
  { text: "Thirst", category: "internal" },
  { text: "Fatigue", category: "internal" },
  { text: "Pain", category: "internal" },
  { text: "Medication effects", category: "internal" },
  { text: "Anxiety", category: "internal" },
]

type TriggerTag = {
  text: string
  category: string
}

export default function TrackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stimulationLevel, setStimulationLevel] = useState(5)
  const [stimulationType, setStimulationType] = useState("neutral")
  const [searchQuery, setSearchQuery] = useState("")
  const [triggerTags, setTriggerTags] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<TriggerTag[]>([])
  const [previousTags, setPreviousTags] = useState<TriggerTag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [activities, setActivities] = useState("")
  const [notes, setNotes] = useState("")
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [formModified, setFormModified] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const suggestionItemsRef = useRef<(HTMLLIElement | null)[]>([])
  const [useCustomDateTime, setUseCustomDateTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(format(new Date(), "HH:mm"))

  // Load previously used tags or initialize with defaults
  useEffect(() => {
    const savedTags = localStorage.getItem("triggerTags")
    if (savedTags) {
      try {
        const parsed = JSON.parse(savedTags)
        // Handle both old format (string[]) and new format (TriggerTag[])
        if (parsed.length > 0 && typeof parsed[0] === "string") {
          // Convert old format to new format
          const converted = parsed.map((tag: string) => {
            // Try to match with a default category, or use "custom"
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
        console.error("Error parsing saved tags:", e)
        setPreviousTags(DEFAULT_TRIGGERS)
        localStorage.setItem("triggerTags", JSON.stringify(DEFAULT_TRIGGERS))
      }
    } else {
      // Initialize with default triggers if no saved tags exist
      setPreviousTags(DEFAULT_TRIGGERS)
      localStorage.setItem("triggerTags", JSON.stringify(DEFAULT_TRIGGERS))
    }

    // Load theme settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.theme) {
          setTheme(settings.theme)
        }
        if (settings.highContrastMode) {
          document.documentElement.classList.add("high-contrast")
        } else {
          document.documentElement.classList.remove("high-contrast")
        }
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    }
  }, [setTheme])

  // Track form modifications
  useEffect(() => {
    // Check if any form field has been modified from its default state
    if (
      energyLevel !== 5 ||
      stimulationLevel !== 5 ||
      stimulationType !== "neutral" ||
      triggerTags.length > 0 ||
      activities !== "" ||
      notes !== "" ||
      useCustomDateTime !== false ||
      format(selectedDate, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd") ||
      selectedTime !== format(new Date(), "HH:mm")
    ) {
      setFormModified(true)
    } else {
      setFormModified(false)
    }
  }, [
    energyLevel,
    stimulationLevel,
    stimulationType,
    triggerTags,
    activities,
    notes,
    useCustomDateTime,
    selectedDate,
    selectedTime,
  ])

  // Update the filter suggestions logic to search through all triggers regardless of category filters
  // Modify the useEffect that filters suggestions:

  useEffect(() => {
    // First, get all tags that aren't already selected
    const allAvailableTags = [...previousTags].filter((tag) => !triggerTags.includes(tag.text))

    // For search results, we'll search through ALL tags regardless of category filters
    let searchResults = allAvailableTags
    if (searchQuery) {
      searchResults = allAvailableTags.filter((tag) => tag.text.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // For display, we'll apply category filters if any are selected
    let filtered = searchResults
    if (selectedCategories.length > 0) {
      filtered = searchResults.filter((tag) => selectedCategories.includes(tag.category))
    }

    setSuggestions(filtered)
    // Reset focused suggestion when suggestions change
    setFocusedSuggestionIndex(-1)
  }, [previousTags, triggerTags, searchQuery, selectedCategories])

  // Handle clicks outside the suggestions dropdown
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

  // Initialize suggestionItemsRef when suggestions change
  useEffect(() => {
    suggestionItemsRef.current = suggestionItemsRef.current.slice(0, suggestions.length)
  }, [suggestions])

  const handleBackClick = (e: React.MouseEvent) => {
    if (formModified) {
      e.preventDefault()
      setPendingNavigation("/")
      setShowUnsavedDialog(true)
    }
  }

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

  const getFormattedDateTime = () => {
    if (!useCustomDateTime) {
      return new Date().toISOString()
    }

    // Parse the time string
    const [hours, minutes] = selectedTime.split(":").map(Number)

    // Create a new date with the selected date and time
    const dateTime = set(selectedDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })

    return dateTime.toISOString()
  }

  const handleSave = () => {
    // Save the entry
    const entry = {
      timestamp: getFormattedDateTime(),
      energyLevel,
      stimulationLevel,
      stimulationType,
      triggers: triggerTags.join(", "),
      activities,
      notes,
    }

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem("trackingEntries") || "[]")
    localStorage.setItem("trackingEntries", JSON.stringify([...existingEntries, entry]))

    // Save the tags for future autosuggestion
    const newTagObjects = triggerTags.map((tag) => {
      // Check if tag already exists in previousTags
      const existingTag = previousTags.find((pt) => pt.text === tag)
      if (existingTag) {
        return existingTag
      }

      // Try to match with a default category
      const matchedDefault = DEFAULT_TRIGGERS.find((dt) => dt.text.toLowerCase() === tag.toLowerCase())
      return {
        text: tag,
        category: matchedDefault?.category || "custom", // Use custom category for user-created tags
      }
    })

    // Combine with previous tags, ensuring uniqueness by text
    const uniqueTags = [...previousTags]
    newTagObjects.forEach((newTag) => {
      if (!previousTags.some((pt) => pt.text === newTag.text)) {
        uniqueTags.push(newTag)
      }
    })

    localStorage.setItem("triggerTags", JSON.stringify(uniqueTags))
    setPreviousTags(uniqueTags)

    toast({
      title: "Entry saved",
      description: "Your tracking entry has been saved successfully.",
    })

    // Reset form modified state
    setFormModified(false)

    router.push("/")
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Show suggestions when typing
    if (!showSuggestions) {
      setShowSuggestions(true)
    }
  }

  // Add a function to handle tabbing through categories
  const handleTabThroughCategories = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && e.shiftKey) {
      // If Shift+Tab is pressed, cycle through categories in reverse
      e.preventDefault()
      const currentIndex = TRIGGER_CATEGORIES.findIndex(
        (cat) => selectedCategories.length === 1 && selectedCategories[0] === cat.id,
      )

      if (selectedCategories.length !== 1) {
        // If no category or multiple categories are selected, select the last one
        setSelectedCategories([TRIGGER_CATEGORIES[TRIGGER_CATEGORIES.length - 1].id])
      } else if (currentIndex > 0) {
        // Move to the previous category
        setSelectedCategories([TRIGGER_CATEGORIES[currentIndex - 1].id])
      } else {
        // Wrap around to the last category
        setSelectedCategories([TRIGGER_CATEGORIES[TRIGGER_CATEGORIES.length - 1].id])
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      // If Tab is pressed, cycle through categories
      if (suggestions.length > 0) {
        // If there are suggestions, use the default Tab behavior to select the first suggestion
        e.preventDefault()
        addTag(suggestions[0].text)
      } else {
        // If no suggestions, cycle through categories
        e.preventDefault()
        const currentIndex = TRIGGER_CATEGORIES.findIndex(
          (cat) => selectedCategories.length === 1 && selectedCategories[0] === cat.id,
        )

        if (selectedCategories.length !== 1) {
          // If no category or multiple categories are selected, select the first one
          setSelectedCategories([TRIGGER_CATEGORIES[0].id])
        } else if (currentIndex < TRIGGER_CATEGORIES.length - 1) {
          // Move to the next category
          setSelectedCategories([TRIGGER_CATEGORIES[currentIndex + 1].id])
        } else {
          // Wrap around to the first category
          setSelectedCategories([TRIGGER_CATEGORIES[0].id])
        }
      }
    }
  }

  // Update the handleSearchInputKeyDown function to include the new tabbing functionality
  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab for autocompletion or category cycling
    if (e.key === "Tab") {
      handleTabThroughCategories(e)
    }
    // Enter to add tag or select focused suggestion
    else if (e.key === "Enter") {
      e.preventDefault()
      if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
        addTag(suggestions[focusedSuggestionIndex].text)
      } else if (searchQuery.trim()) {
        addTag(searchQuery.trim())
      }
    }
    // Backspace to remove last tag when input is empty
    else if (e.key === "Backspace" && !searchQuery && triggerTags.length > 0) {
      removeTag(triggerTags.length - 1)
    }
    // Arrow down to navigate through suggestions
    else if (e.key === "ArrowDown" && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      const newIndex = focusedSuggestionIndex < suggestions.length - 1 ? focusedSuggestionIndex + 1 : 0
      setFocusedSuggestionIndex(newIndex)
      // Scroll the suggestion into view if needed
      if (suggestionItemsRef.current[newIndex]) {
        suggestionItemsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
      }
    }
    // Arrow up to navigate through suggestions
    else if (e.key === "ArrowUp" && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      const newIndex = focusedSuggestionIndex > 0 ? focusedSuggestionIndex - 1 : suggestions.length - 1
      setFocusedSuggestionIndex(newIndex)
      // Scroll the suggestion into view if needed
      if (suggestionItemsRef.current[newIndex]) {
        suggestionItemsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
      }
    }
    // Escape to close suggestions
    else if (e.key === "Escape") {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const addTag = (tag: string) => {
    if (tag && !triggerTags.includes(tag)) {
      setTriggerTags([...triggerTags, tag])
      setSearchQuery("")

      // If this is a new tag, add it to previousTags with the custom category
      if (!previousTags.some((pt) => pt.text === tag)) {
        const newTag = { text: tag, category: "custom" }
        const updatedTags = [...previousTags, newTag]
        setPreviousTags(updatedTags)
        localStorage.setItem("triggerTags", JSON.stringify(updatedTags))

        toast({
          title: "New tag created",
          description: `"${tag}" has been added to your custom tags.`,
          duration: 3000,
        })
      }

      // Keep focus on the input
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

  const getCategoryIcon = (categoryId: string) => {
    const category = TRIGGER_CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return null

    const Icon = category.icon
    return <Icon className={`h-4 w-4 ${category.color}`} />
  }

  // Update the energy and stimulation level displays for better contrast

  // Update the getEnergyColor function
  const getEnergyColor = (level: number) => {
    if (level <= 3)
      return "text-blush-600 dark:text-blush-300 high-contrast:text-blush-800 dark:high-contrast:text-blush-200"
    if (level <= 7)
      return "text-sand-600 dark:text-sand-300 high-contrast:text-sand-800 dark:high-contrast:text-sand-200"
    return "text-mint-600 dark:text-mint-300 high-contrast:text-mint-800 dark:high-contrast:text-mint-200"
  }

  // Update the getStimulationColor function
  const getStimulationColor = (level: number) => {
    if (level <= 3)
      return "text-sand-700 dark:text-sand-300 high-contrast:text-sand-900 dark:high-contrast:text-sand-200"
    if (level <= 7)
      return "text-lavender-700 dark:text-lavender-300 high-contrast:text-lavender-900 dark:high-contrast:text-lavender-200"
    return "text-blush-700 dark:text-blush-300 high-contrast:text-blush-900 dark:high-contrast:text-blush-200"
  }

  const isExactMatch =
    searchQuery.trim() !== "" && previousTags.some((tag) => tag.text.toLowerCase() === searchQuery.trim().toLowerCase())

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">
      <SiteHeader onBackButtonClick={handleBackClick} />

      <div className="container mx-auto max-w-3xl">
        <Card className="overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
          <CardHeader className="bg-sand-100/50 pb-4 pt-6 dark:bg-sand-900/50 high-contrast:bg-accent">
            <CardTitle className="text-center text-2xl">How are you feeling?</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 p-6 pt-8">
            <div className="rounded-lg bg-sand-100/50 p-4 dark:bg-sand-900/50 high-contrast:bg-accent high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="custom-datetime" className="text-sm font-medium">
                  When did this happen?
                </Label>
                <div className="flex items-center">
                  <Label htmlFor="custom-datetime-toggle" className="mr-2 text-sm">
                    {useCustomDateTime ? "Custom date/time" : "Now"}
                  </Label>
                  <Switch
                    id="custom-datetime-toggle"
                    checked={useCustomDateTime}
                    onCheckedChange={setUseCustomDateTime}
                    className="data-[state=checked]:bg-lavender-500 high-contrast:data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              {useCustomDateTime ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date-picker" className="mb-2 block text-sm">
                      Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="outline"
                          className="w-full justify-start text-left font-normal high-contrast:border-black dark:high-contrast:border-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white dark:bg-lavender-950/80 border border-lavender-200 dark:border-lavender-800 rounded-md shadow-md"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          className="rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="time-picker" className="mb-2 block text-sm">
                      Time
                    </Label>
                    <div className="relative">
                      <Input
                        id="time-picker"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="high-contrast:border-black dark:high-contrast:border-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <span>Current date and time will be used</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <Battery className="mr-2 h-5 w-5 text-lavender-500" /> Energy Level
                </h3>
                <div
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    getEnergyColor(energyLevel),
                    "high-contrast:font-extrabold",
                  )}
                >
                  {energyLevel}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setEnergyLevel(Math.max(0, energyLevel - 1))}
                >
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Slider
                  value={[energyLevel]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  className="flex-1"
                  data-type="energy"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setEnergyLevel(Math.min(10, energyLevel + 1))}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {energyLevel === 0
                  ? "No energy - completely exhausted, unable to perform basic tasks"
                  : energyLevel === 1
                    ? "Very low energy - severely drained, basic tasks require significant effort"
                    : energyLevel === 2
                      ? "Low energy - noticeably tired, difficult to focus or be productive"
                      : energyLevel === 3
                        ? "Below average energy - somewhat tired, can function but not at full capacity"
                        : energyLevel === 4
                          ? "Slightly low energy - a bit tired, but can handle most tasks"
                          : energyLevel === 5
                            ? "Moderate energy - balanced state, neither energized nor tired"
                            : energyLevel === 6
                              ? "Slightly high energy - somewhat energized, good productivity"
                              : energyLevel === 7
                                ? "Above average energy - noticeably energized, very productive"
                                : energyLevel === 8
                                  ? "High energy - very energized, highly motivated and focused"
                                  : energyLevel === 9
                                    ? "Very high energy - extremely energized, may feel slightly restless"
                                    : "Maximum energy - intensely energized, may feel hyperactive or restless"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center text-lg font-medium">
                  <Zap className="mr-2 h-5 w-5 text-sand-500" /> Stimulation Level
                </h3>
                <div
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    getStimulationColor(stimulationLevel),
                    "high-contrast:font-extrabold",
                  )}
                >
                  {stimulationLevel}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setStimulationLevel(Math.max(0, stimulationLevel - 1))}
                >
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Slider
                  value={[stimulationLevel]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setStimulationLevel(value[0])}
                  className="flex-1"
                  data-type="stimulation"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setStimulationLevel(Math.min(10, stimulationLevel + 1))}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {stimulationLevel === 0
                  ? "No stimulation - complete sensory deprivation, may feel disconnected"
                  : stimulationLevel === 1
                    ? "Very low stimulation - minimal sensory input, may feel bored or isolated"
                    : stimulationLevel === 2
                      ? "Low stimulation - quiet environment, may feel understimulated"
                      : stimulationLevel === 3
                        ? "Below average stimulation - calm environment, may seek more input"
                        : stimulationLevel === 4
                          ? "Slightly low stimulation - comfortable but quiet, good for focus"
                          : stimulationLevel === 5
                            ? "Moderate stimulation - balanced sensory input, typically comfortable"
                            : stimulationLevel === 6
                              ? "Slightly high stimulation - noticeable sensory input, may start feeling intense"
                              : stimulationLevel === 7
                                ? "Above average stimulation - significant sensory input, approaching threshold"
                                : stimulationLevel === 8
                                  ? "High stimulation - intense sensory input, may be overwhelming"
                                  : stimulationLevel === 9
                                    ? "Very high stimulation - very intense input, likely overwhelming"
                                    : "Maximum stimulation - extreme sensory overload, overwhelming"}
              </p>
            </div>

            {/* Updated label to reflect overall experience */}
            <div className="rounded-lg bg-sand-100/50 p-4 dark:bg-sand-900/50 high-contrast:bg-accent high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
              <Label className="mb-3 block text-sm font-medium">
                How would you describe your overall experience right now?
              </Label>
              <RadioGroup
                value={stimulationType}
                onValueChange={setStimulationType}
                className="grid grid-cols-1 gap-2 md:grid-cols-3"
              >
                <Label
                  htmlFor="positive"
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-lavender-300 high-contrast:hover:border-primary",
                    stimulationType === "positive" &&
                      "border-2 border-lavender-400 ring-2 ring-lavender-200 dark:ring-lavender-900 high-contrast:border-primary high-contrast:ring-primary",
                  )}
                >
                  <RadioGroupItem value="positive" id="positive" className="sr-only" />
                  <span>Positive/Energizing</span>
                </Label>
                <Label
                  htmlFor="neutral"
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-sand-300 high-contrast:hover:border-primary",
                    stimulationType === "neutral" &&
                      "border-2 border-sand-400 ring-2 ring-sand-200 dark:ring-sand-900 high-contrast:border-primary high-contrast:ring-primary",
                  )}
                >
                  <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
                  <span>Neutral/Balanced</span>
                </Label>
                <Label
                  htmlFor="negative"
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-blush-300 high-contrast:hover:border-primary",
                    stimulationType === "negative" &&
                      "border-2 border-blush-400 ring-2 ring-blush-200 dark:ring-blush-900 high-contrast:border-primary high-contrast:ring-primary",
                  )}
                >
                  <RadioGroupItem value="negative" id="negative" className="sr-only" />
                  <span>Negative/Draining</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="triggers" className="text-sm font-medium text-foreground">
                    What triggers or sensory inputs are you experiencing?
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={toggleSuggestions}
                    aria-label={showSuggestions ? "Hide suggestions" : "Show suggestions"}
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
                    {triggerTags.map((tag, index) => (
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
                          <span className="sr-only">Remove {tag}</span>
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
                        placeholder={triggerTags.length ? "Search or add more tags..." : "Search or add tags..."}
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
                              <category.icon className={`h-3.5 w-3.5 ${category.color}`} />
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
                                ref={(el) => (suggestionItemsRef.current[index] = el)}
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
                                <span className="mr-2">{getCategoryIcon(suggestion.category)}</span>
                                <span className="flex-1">{suggestion.text}</span>
                                {index === 0 && <span className="ml-2 text-xs text-muted-foreground">(Tab)</span>}
                                {index === focusedSuggestionIndex && (
                                  <span className="ml-2 text-xs text-muted-foreground">(Enter)</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                            {searchQuery.trim() ? (
                              <div className="space-y-2">
                                <p>No matching triggers found</p>
                                {!isExactMatch && searchQuery.trim() && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mx-auto flex items-center gap-1"
                                    onClick={addCustomTag}
                                  >
                                    <PlusCircle className="h-3.5 w-3.5 text-lavender-500" />
                                    <span>Add "{searchQuery.trim()}" as custom tag</span>
                                  </Button>
                                )}
                              </div>
                            ) : (
                              "Type to search or filter by category"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a tag. Use ↑ and ↓ arrow keys to navigate suggestions.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activities" className="text-sm font-medium">
                  What are you doing right now?
                </Label>
                <Input
                  id="activities"
                  placeholder="Current or recent activities"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any other thoughts, feelings, or observations"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end bg-sand-100/50 px-6 py-4 dark:bg-sand-900/50 high-contrast:bg-accent">
            <Button
              onClick={handleSave}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-lavender-500 to-sand-400 text-white transition-all hover:from-lavender-600 hover:to-sand-500 dark:from-lavender-600 dark:to-sand-500 dark:hover:from-lavender-700 dark:hover:to-sand-600 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Unsaved changes dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="w-full max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-lavender-700 dark:text-lavender-300">Wait a moment!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You've made changes to your tracking entry that haven't been saved yet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border border-sand-300 bg-sand-50 p-4 text-sand-800 dark:bg-sand-900/30 dark:text-sand-200 dark:border-sand-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 text-blush-500 dark:text-blush-400" />
                <div>
                  <p className="font-medium">Your tracking information will be lost</p>
                  <p className="text-sm mt-1">
                    If you leave without saving, all the information you've entered will be lost.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => handleUnsavedDialogAction("cancel")}
                className="justify-center border-lavender-300 text-lavender-700 hover:bg-lavender-50 dark:border-lavender-700 dark:text-lavender-300 dark:hover:bg-lavender-900/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Keep Editing
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUnsavedDialogAction("discard")}
                className="justify-center border-blush-300 text-blush-700 hover:bg-blush-50 hover:text-blush-800 dark:border-blush-700 dark:text-blush-300 dark:hover:bg-blush-900/20"
              >
                <X className="mr-2 h-4 w-4" />
                Discard Entry
              </Button>
              <Button
                onClick={() => handleUnsavedDialogAction("save")}
                className="justify-center bg-mint-500 hover:bg-mint-600 text-white dark:bg-mint-600 dark:hover:bg-mint-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
