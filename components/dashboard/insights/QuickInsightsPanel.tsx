import { Clock, AlertCircle } from 'lucide-react'
import { useDashboardInsights } from '@/hooks/features/dashboard/useDashboardInsights'
import { dashboardCopy } from '@/copy/dashboard'
import type { TrackingEntry } from '@/lib/entries'

type QuickInsightsPanelProps = {
  entries: TrackingEntry[]
}

export const QuickInsightsPanel = ({ entries }: QuickInsightsPanelProps) => {
  const { getTimeOfDayInsight, getCommonTriggersInsight } = useDashboardInsights(entries)

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-medium mb-4">{dashboardCopy.insights.quickInsights.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time of day insight */}
        <div className="rounded-lg border bg-white/70 p-4 shadow-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-lavender-500" />
            <h4 className="font-medium">{dashboardCopy.insights.quickInsights.timeOfDay.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {getTimeOfDayInsight()}
          </p>
        </div>

        {/* Trigger insight */}
        <div className="rounded-lg border bg-white/70 p-4 shadow-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-mint-500" />
            <h4 className="font-medium">{dashboardCopy.insights.quickInsights.commonTriggers.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {getCommonTriggersInsight()}
          </p>
        </div>
      </div>
    </div>
  )
} 