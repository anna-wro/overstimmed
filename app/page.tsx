"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Activity, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { dashboardCopy } from "@/copy/dashboard"
import { useDashboardData } from "@/hooks/features"
import { DashboardHeader, EmptyState, LatestEntryCard, InsightsSection, NavigationCards } from "@/components/dashboard"

export default function Home() {
  const { latestEntry, entries, recentEntries, stats, loading } = useDashboardData()

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <DashboardHeader />
          <div className="flex justify-center items-center flex-1 min-h-[60vh]">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
          <div className="fixed top-6 right-6 z-50">
            <ThemeToggle />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <DashboardHeader />

        {latestEntry ? <LatestEntryCard latestEntry={latestEntry} /> : <EmptyState />}
        
        {entries.length > 0 && (
          <InsightsSection entries={entries} recentEntries={recentEntries} stats={stats} />
        )}

        <NavigationCards />

        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>
    </main>
  )
}
