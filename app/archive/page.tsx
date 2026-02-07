"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { ChevronLeft, Calendar, Filter, ArrowUpDown, Trash2, Clock, Search, Loader2 } from "lucide-react"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { useToast } from "@/hooks/shared/useToast"
import { Input } from "@/components/ui/Input"
import { HeaderCorner } from "@/components/layout/HeaderCorner"
import { useEntries } from "@/hooks/features"
import type { TrackingEntry } from "@/lib/entries"
import { archivePageCopy } from "@/copy/archive"
import { errorsCopy } from "@/copy/errors"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"

export default function ArchivePage() {
  const { toast } = useToast()
  const { entries, loading, error, deleteEntry: deleteEntryFromSupabase } = useEntries()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <HeaderCorner />
      </div>
    )
  }

  const deleteEntry = async (id: string) => {
    if (!confirm(archivePageCopy.entryCard.deleteConfirm)) return
    try {
      await deleteEntryFromSupabase(id)
      toast({
        title: archivePageCopy.toasts.entryDeleted.title,
        description: archivePageCopy.toasts.entryDeleted.description,
      })
    } catch {
      toast({
        title: errorsCopy.deleteEntry.title,
        description: errorsCopy.deleteEntry.description,
        variant: "destructive",
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
    if (type === "positive") return archivePageCopy.experienceTypes.positive
    if (type === "neutral") return archivePageCopy.experienceTypes.neutral
    return archivePageCopy.experienceTypes.negative
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{errorsCopy.loadEntries.title}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={archivePageCopy.filters.timeRange.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{archivePageCopy.filters.timeRange.options.all}</SelectItem>
                  <SelectItem value="7">{archivePageCopy.filters.timeRange.options.week}</SelectItem>
                  <SelectItem value="30">{archivePageCopy.filters.timeRange.options.month}</SelectItem>
                  <SelectItem value="90">{archivePageCopy.filters.timeRange.options.quarter}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={archivePageCopy.filters.sort.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{archivePageCopy.filters.sort.options.newest}</SelectItem>
                  <SelectItem value="oldest">{archivePageCopy.filters.sort.options.oldest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={archivePageCopy.filters.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="compact">{archivePageCopy.viewModes.compact}</TabsTrigger>
              <TabsTrigger value="detailed">{archivePageCopy.viewModes.detailed}</TabsTrigger>
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
                            <span className="text-xs font-medium text-muted-foreground">{archivePageCopy.entryCard.energy}</span>
                            <Badge variant="outline" className={getEnergyBadgeColor(entry.energyLevel)}>
                              {entry.energyLevel}/10
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">{archivePageCopy.entryCard.stimulation}</span>
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
                            onClick={() => entry.id && deleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{archivePageCopy.entryCard.deleteButton}</span>
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
                          onClick={() => entry.id && deleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{archivePageCopy.entryCard.deleteButton}</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.energyLevel}</span>
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
                              <span className="text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.stimulationLevel}</span>
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
                            <span className="mr-2 text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.overallExperience}</span>
                            <Badge className={getExperienceTypeColor(entry.stimulationType)}>
                              {getExperienceTypeText(entry.stimulationType)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {entry.triggers && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.triggers}</div>
                              <div>{entry.triggers}</div>
                            </div>
                          )}

                          {entry.activities && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.activities}</div>
                              <div>{entry.activities}</div>
                            </div>
                          )}

                          {entry.notes && (
                            <div className="rounded-lg border bg-white/50 p-3 dark:bg-lavender-950/30">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">{archivePageCopy.detailedView.notes}</div>
                              <div className="text-sm">{entry.notes}</div>
                            </div>
                          )}

                          {!entry.triggers && !entry.activities && !entry.notes && (
                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-4 text-center">
                              <p className="text-sm text-muted-foreground">{archivePageCopy.detailedView.noDetails}</p>
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
              <h2 className="mb-1 text-xl font-medium">{archivePageCopy.emptyState.title}</h2>
              <p className="mb-4 text-muted-foreground">
                {entries.length === 0
                  ? archivePageCopy.emptyState.description.noEntries
                  : archivePageCopy.emptyState.description.noResults}
              </p>
              {entries.length === 0 && (
                <Link href="/track">
                  <Button variant="outline">{archivePageCopy.emptyState.createButton}</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {archivePageCopy.summary.showing} {filteredEntries.length} {filteredEntries.length === 1 ? archivePageCopy.summary.entry : archivePageCopy.summary.entries}
          </p>
        )}
      </div>
      <HeaderCorner />
    </div>
  )
}
