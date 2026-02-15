/** @fileoverview Dashboard insights section combining chart, stats, and quick insights. */
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { InsightsHeader } from './InsightsHeader'
import { InsightsStatsGrid } from './InsightsStatsGrid'
import { InsightsChart } from './InsightsChart'
import { QuickInsightsPanel } from './QuickInsightsPanel'
import { InsightsFooter } from './InsightsFooter'
import { dashboardCopy } from '@/copy/dashboard'
import type { TrackingEntry } from '@/lib/entries'

type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
}

type DashboardStats = {
  totalEntries: number
  avgEnergy: number
  avgStimulation: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
}

type InsightsSectionProps = {
  entries: TrackingEntry[]
  recentEntries: ChartDataPoint[]
  stats: DashboardStats
}

export const InsightsSection = ({ entries, recentEntries, stats }: InsightsSectionProps) => {
  return (
    <div className="mb-10">
      <InsightsHeader />

      <Card className="relative overflow-hidden border-none bg-linear-to-br from-mint-50/80 to-sky-50/80 shadow-xl dark:from-mint-900/30 dark:to-sky-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-mint-400 to-sky-300 high-contrast:bg-primary"></div>

        <CardHeader className="bg-mint-100/50 pb-4 pt-6 dark:bg-mint-900/20 high-contrast:bg-accent">
          <CardTitle className="text-center text-xl">{dashboardCopy.insights.chartTitle}</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <InsightsStatsGrid stats={stats} />
          <InsightsChart recentEntries={recentEntries} />
          {recentEntries.length > 3 && <QuickInsightsPanel entries={entries} />}
        </CardContent>

        <CardFooter className="p-0">
          <InsightsFooter />
        </CardFooter>
      </Card>
    </div>
  )
} 