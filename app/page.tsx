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

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <DashboardHeader />

        {loading ? (
          <div className="flex justify-center items-center mb-20">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : !latestEntry ? (
          <EmptyState /> 
        ) : (
          <LatestEntryCard latestEntry={latestEntry} />
        )}

        {/* Analytics Section */}
        {entries.length > 0 && (
          <InsightsSection entries={entries} recentEntries={recentEntries} stats={stats} />
        )}

        <NavigationCards />

        {/* Theme toggle */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Floating action button for quick tracking */}
        <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
          <Link href="/track">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-lavender-500 p-0 shadow-lg hover:bg-lavender-600 dark:bg-lavender-600 dark:hover:bg-lavender-700 high-contrast:bg-primary"
              aria-label={dashboardCopy.quickTracking.ariaLabel}
            >
              <Activity className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
