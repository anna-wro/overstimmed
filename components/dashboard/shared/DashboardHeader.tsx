import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { dashboardCopy } from '@/copy/dashboard'

export const DashboardHeader = () => {
  return (
    <div className="mb-12 text-center">
      <Link href="/">
        <h1 className="mb-3 bg-linear-to-r from-lavender-600 to-sand-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
          {dashboardCopy.header.title}
        </h1>
      </Link>
      <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
        {dashboardCopy.header.subtitle}
      </p>

      {/* Quick access tracking button */}
      <div className="mt-6">
        <Link href="/track">
          <Button
            size="lg"
            className="relative overflow-hidden bg-linear-to-r from-lavender-500 to-sand-400 text-white transition-all hover:from-lavender-600 hover:to-sand-500 dark:from-lavender-600 dark:to-sand-500 dark:hover:from-lavender-700 dark:hover:to-sand-600 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            {dashboardCopy.header.trackNowButton}
          </Button>
        </Link>
      </div>
    </div>
  )
} 