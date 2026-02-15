import { AlertCircle, Activity, FileText } from 'lucide-react'
import { dashboardCopy } from '@/copy/dashboard'

type EntryDetailSectionProps = {
  triggers?: string
  activities?: string
  notes?: string
}

export const EntryDetailSection = ({ triggers, activities, notes }: EntryDetailSectionProps) => {
  return (
    <div className="relative">
      <h3 className="mb-6 text-xl font-semibold">{dashboardCopy.latestEntry.details}</h3>

      <div className="space-y-4">
        {triggers && (
          <div className="group rounded-xl border bg-white/70 p-4 shadow-xs transition-all hover:border-lavender-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-lavender-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-100 group-hover:bg-lavender-200 dark:bg-lavender-900/30 high-contrast:bg-accent">
                <AlertCircle className="h-3.5 w-3.5 text-lavender-600 dark:text-lavender-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.triggers}</span>
            </div>
            <p className="text-sm">{triggers}</p>
          </div>
        )}

        {activities && (
          <div className="group rounded-xl border bg-white/70 p-4 shadow-xs transition-all hover:border-sand-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-sand-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-sand-100 group-hover:bg-sand-200 dark:bg-sand-900/30 high-contrast:bg-accent">
                <Activity className="h-3.5 w-3.5 text-sand-600 dark:text-sand-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.activities}</span>
            </div>
            <p className="text-sm">{activities}</p>
          </div>
        )}

        {notes && (
          <div className="group rounded-xl border bg-white/70 p-4 shadow-xs transition-all hover:border-blush-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-blush-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 group-hover:bg-blush-200 dark:bg-blush-900/30 high-contrast:bg-accent">
                <FileText className="h-3.5 w-3.5 text-blush-600 dark:text-blush-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.notes}</span>
            </div>
            <p className="text-sm">{notes}</p>
          </div>
        )}
      </div>
    </div>
  )
} 