/** @fileoverview Grid of summary statistics cards for the dashboard. */
import { dashboardCopy } from '@/copy/dashboard'

type DashboardStats = {
  totalEntries: number
  avgEnergy: number
  avgStimulation: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
}

type InsightsStatsGridProps = {
  stats: DashboardStats
}

export const InsightsStatsGrid = ({ stats }: InsightsStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
      <div className="rounded-lg bg-white/70 p-4 shadow-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
        <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.totalEntries}</div>
        <div className="text-3xl font-bold text-mint-600 dark:text-mint-400 high-contrast:text-foreground">
          {stats.totalEntries}
        </div>
      </div>

      <div className="rounded-lg bg-white/70 p-4 shadow-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
        <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.avgEnergy}</div>
        <div className="text-3xl font-bold text-sand-600 dark:text-sand-400 high-contrast:text-foreground">
          {stats.avgEnergy}
        </div>
      </div>

      <div className="rounded-lg bg-white/70 p-4 shadow-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
        <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.avgStimulation}</div>
        <div className="text-3xl font-bold text-lavender-600 dark:text-lavender-400 high-contrast:text-foreground">
          {stats.avgStimulation}
        </div>
      </div>
    </div>
  )
} 