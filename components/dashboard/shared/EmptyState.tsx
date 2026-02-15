import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { dashboardCopy } from '@/copy/dashboard'

export const EmptyState = () => {
  return (
    <Card className="mb-10 border-dashed bg-sand-50/80 shadow-xs backdrop-blur-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
        <h2 className="mb-1 text-xl font-medium">{dashboardCopy.emptyStates.noEntries.title}</h2>
        <p className="mb-4 text-muted-foreground">
          {dashboardCopy.emptyStates.noEntries.description}
        </p>
        <Link href="/track">
          <Button variant="outline" className="high-contrast:border-black dark:high-contrast:border-white">
            {dashboardCopy.emptyStates.noEntries.buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 