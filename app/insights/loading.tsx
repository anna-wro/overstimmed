import { Skeleton } from "@/components/ui/Skeleton"
import { SiteHeader } from "@/components/SiteHeader"

export default function InsightsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8">
      <SiteHeader />

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 dark:bg-lavender-950/30 shadow-sm rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        <div className="bg-white/80 dark:bg-lavender-950/30 shadow-sm rounded-lg mb-8">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-6 rounded-full" />

          <div className="bg-white/80 dark:bg-lavender-950/30 shadow-sm rounded-lg">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="p-6">
              <Skeleton className="h-[400px] w-full mb-4" />
              <div className="flex justify-center gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
