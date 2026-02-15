"use client"

/** @fileoverview Dashboard page displaying latest entry, stats, and insights. */

import { Loader2 } from "lucide-react"
import { HeaderCorner } from "@/components/layout/HeaderCorner"
import { useDashboardData } from "@/hooks/features"
import { DashboardHeader, EmptyState, LatestEntryCard, InsightsSection, NavigationCards } from "@/components/dashboard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { errorsCopy } from "@/copy/errors"

export default function Home() {
  const { latestEntry, entries, recentEntries, stats, loading, error } = useDashboardData()

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <DashboardHeader />
          <div className="flex justify-center items-center flex-1 min-h-[60vh]">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
          <HeaderCorner />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <DashboardHeader />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{errorsCopy.loadEntries.title}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {latestEntry ? <LatestEntryCard latestEntry={latestEntry} /> : <EmptyState />}
        
        {entries.length > 0 && (
          <InsightsSection entries={entries} recentEntries={recentEntries} stats={stats} />
        )}

        <NavigationCards />

        <HeaderCorner />
      </div>
    </main>
  )
}
