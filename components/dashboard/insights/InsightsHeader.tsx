import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { dashboardCopy } from '@/copy/dashboard'

export const InsightsHeader = () => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">{dashboardCopy.insights.title}</h2>
      <Link href="/insights">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <TrendingUp className="mr-1 h-4 w-4" />
          {dashboardCopy.insights.viewAllInsights}
        </Button>
      </Link>
    </div>
  )
} 