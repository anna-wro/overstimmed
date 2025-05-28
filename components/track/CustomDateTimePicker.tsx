import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Calendar } from "@/components/ui/Calendar"
import { Input } from "@/components/ui/Input"
import { CalendarIcon, ClockIcon, ChevronDown } from "lucide-react"
import { format, set, subMinutes, subHours, subDays, startOfDay } from "date-fns"

interface CustomDateTimePickerProps {
  value?: string // ISO string
  onChange?: (isoString: string) => void
  lowSpoonMode?: boolean
}

const QUICK_OPTIONS = [
  { label: "Now", getValue: () => new Date() },
  { label: "15 min ago", getValue: () => subMinutes(new Date(), 15) },
  { label: "30 min ago", getValue: () => subMinutes(new Date(), 30) },
  { label: "1h ago", getValue: () => subHours(new Date(), 1) },
  { label: "2h ago", getValue: () => subHours(new Date(), 2) },
  { label: "A few hours ago", getValue: () => subHours(new Date(), 4) },
  { label: "This morning", getValue: () => set(startOfDay(new Date()), { hours: 9 }) },
  { label: "Yesterday", getValue: () => set(subDays(startOfDay(new Date()), 1), { hours: 14 }) },
]

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({ value, onChange, lowSpoonMode }) => {
  const [mode, setMode] = useState<"quick" | "precise">("quick")
  const [selectedQuickOption, setSelectedQuickOption] = useState(0) 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(format(new Date(), "HH:mm"))
  const [showQuickOptions, setShowQuickOptions] = useState(false)

  // Update parent whenever the value changes
  useEffect(() => {
    let isoString: string
    if (mode === "quick") {
      isoString = QUICK_OPTIONS[selectedQuickOption].getValue().toISOString()
    } else {
      const [hours, minutes] = selectedTime.split(":").map(Number)
      const dateTime = set(selectedDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      })
      isoString = dateTime.toISOString()
    }
    onChange?.(isoString)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedQuickOption, selectedDate, selectedTime])

  return (
    <div className="rounded-lg bg-sand-100/50 p-4 dark:bg-sand-900/50 high-contrast:bg-accent high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-sm font-medium">
          When did this happen?
        </Label>
        {!lowSpoonMode && (
          <div className="flex items-center">
            <Label htmlFor="precise-toggle" className="mr-2 text-sm">
              {mode === "precise" ? "Precise" : "Quick"}
            </Label>
            <Switch
              id="precise-toggle"
              checked={mode === "precise"}
              onCheckedChange={(checked) => setMode(checked ? "precise" : "quick")}
              className="data-[state=checked]:bg-lavender-500 high-contrast:data-[state=checked]:bg-primary"
            />
          </div>
        )}
      </div>

      {(mode === "quick" || lowSpoonMode) ? (
        <div className="space-y-3">
          <Popover open={showQuickOptions} onOpenChange={setShowQuickOptions}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal high-contrast:border-black dark:high-contrast:border-white"
              >
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {QUICK_OPTIONS[selectedQuickOption].label}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2" align="start">
              <div className="grid gap-1">
                {QUICK_OPTIONS.map((option, index) => (
                  <Button
                    key={option.label}
                    variant={index === selectedQuickOption ? "default" : "ghost"}
                    className="justify-start text-left"
                    onClick={() => {
                      setSelectedQuickOption(index)
                      setShowQuickOptions(false)
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="text-xs text-muted-foreground flex items-center px-1">
            <ClockIcon className="mr-1 h-3 w-3" />
            {format(QUICK_OPTIONS[selectedQuickOption].getValue(), "PPp")}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
} 