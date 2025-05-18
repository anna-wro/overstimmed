import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Calendar } from "@/components/ui/Calendar"
import { Input } from "@/components/ui/Input"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format, set } from "date-fns"

interface CustomDateTimePickerProps {
  value?: string // ISO string
  onChange?: (isoString: string) => void
}

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({ value, onChange }) => {
  const [useCustomDateTime, setUseCustomDateTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(format(new Date(), "HH:mm"))

  // Update parent whenever the value changes
  useEffect(() => {
    let isoString: string
    if (!useCustomDateTime) {
      isoString = new Date().toISOString()
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
  }, [useCustomDateTime, selectedDate, selectedTime])

  return (
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
  )
} 