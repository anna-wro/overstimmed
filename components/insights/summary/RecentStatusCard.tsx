import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface RecentStatusCardProps {
  mostRecentEntry: any
}

export default function RecentStatusCard({ mostRecentEntry }: RecentStatusCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-lavender-500" />
          Recent Status
        </CardTitle>
        <CardDescription>Your most recent tracking entry</CardDescription>
      </CardHeader>
      <CardContent>
        {mostRecentEntry ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {format(new Date(mostRecentEntry.timestamp), "MMMM d, yyyy 'at' h:mm a")}
              </div>
              <div
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  mostRecentEntry.stimulationType === "positive"
                    ? "bg-mint-100 text-mint-800 dark:bg-mint-900/30 dark:text-mint-300"
                    : mostRecentEntry.stimulationType === "neutral"
                      ? "bg-sand-100 text-sand-800 dark:bg-sand-900/30 dark:text-sand-300"
                      : "bg-blush-100 text-blush-800 dark:bg-blush-900/30 dark:text-blush-300",
                )}
              >
                {mostRecentEntry.stimulationType.charAt(0).toUpperCase() + mostRecentEntry.stimulationType.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Energy</span>
                  <span className="text-sm font-medium">{mostRecentEntry.energyLevel}/10</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-sand-500"
                    style={{ width: `${mostRecentEntry.energyLevel * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Stimulation</span>
                  <span className="text-sm font-medium">{mostRecentEntry.stimulationLevel}/10</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-lavender-500"
                    style={{ width: `${mostRecentEntry.stimulationLevel * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {mostRecentEntry.triggers && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Triggers</div>
                <div className="text-sm">{mostRecentEntry.triggers}</div>
              </div>
            )}

            {mostRecentEntry.activities && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Activities</div>
                <div className="text-sm">{mostRecentEntry.activities}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No recent entries found</div>
        )}
      </CardContent>
    </Card>
  )
} 