import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Battery, Zap, Calendar, Clock, Activity, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeyInsightsCardProps {
  patterns: any[]
  balancedStatesData: any
}

// Helper function to get pattern badge color
const getPatternBadgeColor = (severity: string) => {
  switch (severity) {
    case "warning":
      return "bg-blush-100 text-blush-800 dark:bg-blush-900/50 dark:text-blush-300"
    case "success":
      return "bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
    case "info":
    default:
      return "bg-lavender-100 text-lavender-800 dark:bg-lavender-900/50 dark:text-lavender-300"
  }
}

// Helper function to get pattern icon
const getPatternIcon = (type: string) => {
  switch (type) {
    case "high-stimulation-negative":
      return <AlertCircle className="h-4 w-4" />
    case "high-stimulation-positive":
      return <Zap className="h-4 w-4" />
    case "low-energy":
      return <Battery className="h-4 w-4" />
    case "positive-experience":
      return <Activity className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

export default function KeyInsightsCard({ patterns, balancedStatesData }: KeyInsightsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-lavender-500" />
          Key Insights
        </CardTitle>
        <CardDescription>Important patterns from your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patterns.length > 0 ? (
            <div className="space-y-3">
              {patterns.slice(0, 3).map((pattern, index) => (
                <div
                  key={index}
                  className={cn("flex items-start gap-3 rounded-lg p-3", getPatternBadgeColor(pattern.severity))}
                >
                  {getPatternIcon(pattern.type)}
                  <p>{pattern.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Not enough data to generate insights yet. Keep tracking to see patterns emerge.
            </div>
          )}

          {balancedStatesData.count > 0 && (
            <div className="mt-4 pt-4 border-t border-muted">
              <h3 className="font-medium mb-2">Balanced States</h3>
              <div className="space-y-2">
                {balancedStatesData.timeOfDay && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-lavender-500 mt-0.5" />
                    <p>You tend to feel most balanced during the {balancedStatesData.timeOfDay}</p>
                  </div>
                )}
                {balancedStatesData.dayOfWeek && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-lavender-500 mt-0.5" />
                    <p>
                      {balancedStatesData.dayOfWeek.charAt(0).toUpperCase() + balancedStatesData.dayOfWeek.slice(1)}{" "}
                      is often your most balanced day
                    </p>
                  </div>
                )}
                {balancedStatesData.activities.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-lavender-500 mt-0.5" />
                    <p>
                      Activities that help you stay balanced:{" "}
                      {balancedStatesData.activities.map((a: any) => a.activity).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 