/** @fileoverview Header for the latest entry card with timestamp and experience badge. */
import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import { dashboardCopy } from '@/copy/dashboard'

type LatestEntryHeaderProps = {
  timestamp: string
}

export const LatestEntryHeader = ({ timestamp }: LatestEntryHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">{dashboardCopy.latestEntry.title}</h2>
      <div className="flex items-center rounded-full bg-sand-100 dark:bg-sand-900 px-3 py-1 text-sm text-muted-foreground high-contrast:bg-accent high-contrast:text-foreground">
        <Clock className="mr-2 h-4 w-4" />
        {format(new Date(timestamp), "PPP p")}
      </div>
    </div>
  )
} 