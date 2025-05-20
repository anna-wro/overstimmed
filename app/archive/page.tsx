"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { ChevronLeft, Calendar, Filter, ArrowUpDown, Trash2, Clock, Search } from "lucide-react"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { useToast } from "@/hooks/useToast"
import { Input } from "@/components/ui/Input"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useLocalStorage } from "@/hooks/useLocalStorage"

type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

export default function ArchivePage() {
  const { toast } = useToast()
  const [entries, setEntries] = useLocalStorage<TrackingEntry[]>("trackingEntries", [])
  const [timeRange, setTimeRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("compact")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEntries, setFilteredEntries] = useState<TrackingEntry[]>([])

  useEffect(() => {
    if (entries.length > 0) {
      let filtered = [...entries]

      // Apply time filter
      if (timeRange !== "all") {
        const days = Number.parseInt(timeRange)
        const startDate = startOfDay(subDays(new Date(), days))
        const endDate = endOfDay(new Date())

        filtered = filtered.filter((entry) => {
          const entryDate = new Date(entry.timestamp)
          return isWithinInterval(entryDate, { start: startDate, end: endDate })
        })
      }

      // Apply search filter if query exists
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (entry) =>
            entry.triggers?.toLowerCase().includes(query) ||
            entry.activities?.toLowerCase().includes(query) ||
            entry.notes?.toLowerCase().includes(query) ||
            entry.stimulationType?.toLowerCase().includes(query),
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime()
        const dateB = new Date(b.timestamp).getTime()
        return sortBy === "newest" ? dateB - dateA : dateA - dateB
      })

      setFilteredEntries(filtered)
    } else {
      setFilteredEntries([])
    }
  }, [entries, timeRange, sortBy, searchQuery])

  const deleteEntry = (timestamp: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updatedEntries = entries.filter((entry) => entry.timestamp !== timestamp)
      setEntries(updatedEntries)
      toast({
        title: "Entry deleted",
        description: "The tracking entry has been removed.",
      })
    }
  }

  const getEnergyColor = (level: number) => {
    if (level === 0) return "bg-gray-300 dark:bg-gray-500"
    if (level <= 3) return "bg-blush-300 dark:bg-blush-400"
    if (level <= 7) return "bg-sand-300 dark:bg-sand-400"
    return "bg-mint-300 dark:bg-mint-400"
  }

  const getEnergyBadgeColor = (level: number) => {
    if (level === 0)
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-200 high-contrast:bg-gray-200 high-contrast:text-gray-900 dark:high-contrast:bg-gray-800 dark:high-contrast:text-gray-100"
    if (level <= 3)
      return "bg-blush-50 text-blush-700 dark:bg-blush-900/50 dark:text-blush-200 high-contrast:bg-blush-200 high-contrast:text-blush-900 dark:high-contrast:bg-blush-800 dark:high-contrast:text-blush-100"
    if (level <= 7)
      return "bg-sand-50 text-sand-700 dark:bg-sand-900/50 dark:text-sand-200 high-contrast:bg-sand-200 high-contrast:text-sand-900 dark:high-contrast:bg-sand-800 dark:high-contrast:text-sand-100"
    return "bg-mint-50 text-mint-700 dark:bg-mint-900/50 dark:text-mint-200 high-contrast:bg-mint-200 high-contrast:text-mint-900 dark:high-contrast:bg-mint-800 dark:high-contrast:text-mint-100"
  }

  const getStimulationColor = (level: number) => {
    if (level === 0) return "bg-gray-400 dark:bg-gray-500"
    if (level <= 3) return "bg-sand-300 dark:bg-sand-400"
    if (level <= 7) return "bg-lavender-300 dark:bg-lavender-400"
    return "bg-blush-300 dark:bg-blush-400"
  }

  const getExperienceTypeColor = (type: string) => {
    if (type === "positive")
      return "bg-lavender-100 text-lavender-800 dark:bg-lavender-900/50 dark:text-lavender-200 high-contrast:bg-lavender-200 high-contrast:text-lavender-900 dark:high-contrast:bg-lavender-800 dark:high-contrast:text-lavender-100"
    if (type === "neutral")
      return "bg-sand-100 text-sand-800 dark:bg-sand-900/50 dark:text-sand-200 high-contrast:bg-sand-200 high-contrast:text-sand-900 dark:high-contrast:bg-sand-800 dark:high-contrast:text-sand-100"
    return "bg-blush-100 text-blush-800 dark:bg-blush-900/50 dark:text-blush-200 high-contrast:bg-blush-200 high-contrast:text-blush-900 dark:high-contrast:bg-blush-800 dark:high-contrast:text-blush-100"
  }

  const getExperienceTypeText = (type: string) => {
    if (type === "positive") return "Positive"
    if (type === "neutral") return "Neutral/Balanced"
    return "Negative"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
              Overstimmed
            </h1>
          </Link>
        </div>
        <Link
          href="/"
          className="group mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Entry Archive</h1>
          <p className="text-muted-foreground">View and analyze your past tracking entries</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search entries by triggers, activities, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="compact">Compact View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>

            <TabsContent value="compact" className="mt-0">
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.timestamp}
                    className="overflow-hidden border bg-white/80 shadow-sm transition-all hover:shadow-md dark:bg-lavender-950/30"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex items-center justify-between border-b p-3 sm:w-64 sm:border-b-0 sm:border-r">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {format(new Date(entry.timestamp), "MMM d, yyyy")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), "p")}</span>
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Energy:</span>
                            <Badge variant="outline" className={getEnergyBadgeColor(entry.energyLevel)}>
                              {entry.energyLevel}/10
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Stimulation:</span>
                            <Badge variant="outline" className="font-mono">
                              {entry.stimulationLevel}/10
                            </Badge>
                          </div>
                          <Badge className={getExperienceTypeColor(entry.stimulationType)}>
                            {getExperienceTypeText(entry.stimulationType)}
                          </Badge>
                        </div>

                        {(entry.triggers || entry.activities || entry.notes) && (
                          <div className="mt-1 line-clamp-1 text-sm">
                            {entry.triggers || entry.activities || entry.notes}
                          </div>
                        )}

                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-blush-500"
                            onClick={() => deleteEntry(entry.timestamp)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete entry</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-0">
              <div className="space-y-6">
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.timestamp}
                    className="overflow-hidden border-2 border-transparent bg-white/80 shadow-md backdrop-blur-sm transition-all hover:border-lavender-200 dark:bg-lavender-950/30 dark:hover:border-lavender-800"
                  >
                    <CardHeader className="border-b bg-sand-100/50 pb-3 pt-3 dark:bg-sand-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">
                          {format(new Date(entry.timestamp), "PPP p")}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blush-500"
                          onClick={() => deleteEntry(entry.timestamp)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete entry</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Energy Level</span>
                              <span className="font-bold">{entry.energyLevel}/10</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                              <div
                                className={`h-full rounded-full ${getEnergyColor(entry.energyLevel)}`}
                                style={{ width: `${entry.energyLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Stimulation Level</span>
                              <span className="font-bold">{entry.stimulationLevel}/10</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-lavender-100 p-0.5 dark:bg-lavender-900/50">
                              <div
                                className={`h-full rounded-full ${getStimulationColor(entry.stimulationLevel)}`}
                                style={{ width: `${entry.stimulationLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium text-muted-foreground">Overall Experience:</span>
                            <Badge className={getExperienceTypeColor(entry.stimulationType)}>
                              {getExperienceTypeText(entry.stimulationType)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {entry.triggers && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">Triggers</div>
                              <div>{entry.triggers}</div>
                            </div>
                          )}

                          {entry.activities && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">Activities</div>
                              <div>{entry.activities}</div>
                            </div>
                          )}

                          {entry.notes && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">Notes</div>
                              <div className="text-sm">{entry.notes}</div>
                            </div>
                          )}

                          {!entry.triggers && !entry.activities && !entry.notes && (
                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-4 text-center">
                              <p className="text-sm text-muted-foreground">No additional details provided</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {filteredEntries.length === 0 ? (
          <Card className="border-dashed bg-sand-50/80 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Filter className="mb-2 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-1 text-xl font-medium">No entries found</h2>
              <p className="mb-4 text-muted-foreground">
                {entries.length === 0
                  ? "Start tracking your energy and stimulation levels to see your data here"
                  : "Try changing your filters to see more entries"}
              </p>
              {entries.length === 0 && (
                <Link href="/track">
                  <Button variant="outline">Create Your First Entry</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
          </p>
        )}
      </div>
      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  )
}
