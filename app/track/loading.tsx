import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-lavender-500 animate-spin" />
        <p className="text-lg font-medium text-lavender-700 dark:text-lavender-300">Loading tracking page...</p>
        <p className="text-sm text-muted-foreground">Preparing your energy tracker</p>
      </div>
    </div>
  )
}
