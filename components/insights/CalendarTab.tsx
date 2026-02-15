"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Calendar } from "@/components/ui/Calendar"
import { format } from "date-fns"
import { CalendarView, DateSummaryCard, EntryList } from "./calendar"

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <CalendarView 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          entriesByDate={entriesByDate}
        />
      </div>

      <div className="md:col-span-2">
        {entriesForSelectedDate.length > 0 ? (
          <div className="space-y-6">
            <DateSummaryCard 
              selectedDate={selectedDate!}
              entries={entriesForSelectedDate}
            />
            <EntryList entries={entriesForSelectedDate} />
          </div>
        ) : (
          <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs h-full">
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
