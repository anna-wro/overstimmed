"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Battery, Zap, AlertCircle } from "lucide-react"

type CalendarTabProps = {
  filteredEntries: any[]
}

export default function CalendarTab({ filteredEntries }: CalendarTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Group entries by date
  const entriesByDate = filteredEntries.reduce(
    (acc, entry) => {
      const date = format(new Date(entry.timestamp), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(entry)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Get entries for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
  const entriesForSelectedDate = entriesByDate[selectedDateStr] || []

  // Calculate averages for selected date
  const avgEnergyLevel =
    entriesForSelectedDate.length > 0
      ? Math.round(
          (entriesForSelectedDate.reduce((sum, entry) => sum + entry.energyLevel, 0) / entriesForSelectedDate.length) *
            10,
        ) / 10
      : 0

  const avgStimulationLevel =
    entriesForSelectedDate.length > 0
      ? Math.round(
          (entriesForSelectedDate.reduce((sum, entry) => sum + entry.stimulationLevel, 0) /
            entriesForSelectedDate.length) *
            10,
        ) / 10
      : 0

  // Count experience types for selected date
  const experienceTypes = entriesForSelectedDate.reduce(
    (acc, entry) => {
      acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Get most common experience type
  const mostCommonExperienceType = Object.entries(experienceTypes)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type)[0]

  // Helper function to get color for calendar day
  const getDayColor = (date: Date) => {
    if (!date || isNaN(date.getTime())) return ""

    const dateStr = format(date, "yyyy-MM-dd")
    const entries = entriesByDate[dateStr] || []

    if (entries.length === 0) return ""

    // Calculate average experience type
    const experienceCount = entries.reduce(
      (acc, entry) => {
        acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const dominantExperience = Object.entries(experienceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type)[0]

    if (dominantExperience === "positive") return "bg-mint-100 text-mint-900 dark:bg-mint-900/30 dark:text-mint-300"
    if (dominantExperience === "neutral") return "bg-sand-100 text-sand-900 dark:bg-sand-900/30 dark:text-sand-300"
    if (dominantExperience === "negative") return "bg-blush-100 text-blush-900 dark:bg-blush-900/30 dark:text-blush-300"

    return ""
  }

  // Helper function to get experience type text
  const getExperienceTypeText = (type: string) => {
    if (type === "positive") return "Positive/Energizing"
    if (type === "neutral") return "Neutral/Balanced"
    return "Negative/Draining"
  }

  // Helper function to get experience type color
  const getExperienceTypeColor = (type: string) => {
    if (type === "positive") return "text-mint-600 dark:text-mint-400"
    if (type === "neutral") return "text-sand-600 dark:text-sand-400"
    return "text-blush-600 dark:text-blush-400"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEntry: (date) => {
                  const dateStr = format(date, "yyyy-MM-dd")
                  return !!entriesByDate[dateStr]
                },
              }}
              modifiersClassNames={{
                hasEntry: "font-bold",
              }}
              components={{
                Day: ({ date, ...props }) => {
                  // Check if date is valid before using it
                  if (!date || isNaN(date.getTime())) {
                    return <div {...props}>{props.children}</div>
                  }

                  const dateStr = format(date, "yyyy-MM-dd")
                  const hasEntries = !!entriesByDate[dateStr]

                  return (
                    <div
                      {...props}
                      className={cn(props.className, hasEntries && getDayColor(date), hasEntries && "relative")}
                    >
                      {format(date, "d")}
                      {hasEntries && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-70"></div>
                      )}
                    </div>
                  )
                },
              }}
            />
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-mint-500"></div>
                <span className="text-xs">Positive</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-sand-500"></div>
                <span className="text-xs">Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blush-500"></div>
                <span className="text-xs">Negative</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {entriesForSelectedDate.length > 0 ? (
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
              <CardHeader>
                <CardTitle>{format(selectedDate!, "MMMM d, yyyy")}</CardTitle>
                <CardDescription>
                  {entriesForSelectedDate.length} {entriesForSelectedDate.length === 1 ? "entry" : "entries"} on this
                  date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
                    <Battery className="h-6 w-6 text-sand-500 mb-2" />
                    <div className="text-2xl font-bold">{avgEnergyLevel}</div>
                    <div className="text-sm text-muted-foreground">Avg. Energy</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
                    <Zap className="h-6 w-6 text-lavender-500 mb-2" />
                    <div className="text-2xl font-bold">{avgStimulationLevel}</div>
                    <div className="text-sm text-muted-foreground">Avg. Stimulation</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
                    <AlertCircle className="h-6 w-6 text-blush-500 mb-2" />
                    <div className={`text-lg font-bold ${getExperienceTypeColor(mostCommonExperienceType)}`}>
                      {getExperienceTypeText(mostCommonExperienceType)}
                    </div>
                    <div className="text-sm text-muted-foreground">Most Common</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {entriesForSelectedDate.map((entry, index) => (
                <Card key={index} className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">{format(new Date(entry.timestamp), "h:mm a")}</div>
                      <div className={`text-sm font-medium ${getExperienceTypeColor(entry.stimulationType)}`}>
                        {getExperienceTypeText(entry.stimulationType)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Energy</span>
                          <span className="text-sm font-medium">{entry.energyLevel}/10</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-sand-500"
                            style={{ width: `${entry.energyLevel * 10}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Stimulation</span>
                          <span className="text-sm font-medium">{entry.stimulationLevel}/10</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-lavender-500"
                            style={{ width: `${entry.stimulationLevel * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {(entry.triggers || entry.activities || entry.notes) && (
                      <div className="mt-4 pt-4 border-t">
                        {entry.triggers && (
                          <div className="mb-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Triggers</div>
                            <div className="text-sm">{entry.triggers}</div>
                          </div>
                        )}

                        {entry.activities && (
                          <div className="mb-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Activities</div>
                            <div className="text-sm">{entry.activities}</div>
                          </div>
                        )}

                        {entry.notes && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                            <div className="text-sm">{entry.notes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm h-full">
            <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No entries for this date</h3>
              <p className="text-muted-foreground">Select a different date or create a new entry to see data here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
