import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { dashboardCopy } from '@/copy/dashboard'

export const InsightsFooter = () => {
  return (
    <div className="flex justify-between bg-mint-100/50 px-6 py-4 dark:bg-mint-900/20 high-contrast:bg-accent">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-mint-500"></div>
          <span className="text-xs text-muted-foreground">{dashboardCopy.insights.chartLegend.energy}</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-lavender-500"></div>
          <span className="text-xs text-muted-foreground">{dashboardCopy.insights.chartLegend.stimulation}</span>
        </div>
      </div>

      <Link href="/insights">
        <Button
          size="sm"
          className="group relative overflow-hidden bg-mint-500 text-white hover:bg-mint-600 dark:bg-mint-600 dark:hover:bg-mint-700 high-contrast:bg-primary"
        >
          <span className="relative z-10 flex items-center">
            {dashboardCopy.insights.viewDetailedInsights}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </Link>
    </div>
  )
} 