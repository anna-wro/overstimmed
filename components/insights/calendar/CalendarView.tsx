/** @fileoverview Calendar grid for selecting dates with entry count indicators. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Calendar } from "@/components/ui/Calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getExperienceTypeBgColor } from "@/utils/experienceTypeHelpers"

interface CalendarViewProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  entriesByDate: Record<string, any[]>
}

// Helper function to get color for calendar day
const getDayColor = (date: Date, entriesByDate: Record<string, any[]>) => {
  if (!date || isNaN(date.getTime())) return ""

  const dateStr = format(date, "yyyy-MM-dd")
  const entries = entriesByDate[dateStr] || []

  if (entries.length === 0) return ""

  // Calculate dominant experience type
  const experienceCount = entries.reduce((acc, entry) => {
    acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dominantExperience = Object.entries(experienceCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([type]) => type)[0]

  return getExperienceTypeBgColor(dominantExperience)
}

export default function CalendarView({ selectedDate, onSelectDate, entriesByDate }: CalendarViewProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
        <CardDescription>Select a date to view entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
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
            Day: ({ day, ...props }) => {
              const date = day.date
              if (!date || isNaN(date.getTime())) {
                return <td {...props}>{props.children}</td>
              }

              const dateStr = format(date, "yyyy-MM-dd")
              const hasEntries = !!entriesByDate[dateStr]

              return (
                <td
                  {...props}
                  className={cn(props.className, hasEntries && getDayColor(date, entriesByDate), hasEntries && "relative")}
                >
                  {format(date, "d")}
                  {hasEntries && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-70"></div>
                  )}
                </td>
              )
            },
          }}
        />
        
        {/* Legend */}
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
  )
} 