/** @fileoverview Card highlighting key insights from tracking data. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Battery, Zap, Calendar, Clock, Activity, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPatternBadgeColor, getPatternIcon } from "@/utils/patternHelpers"

interface KeyInsightsCardProps {
  patterns: any[]
  balancedStatesData: any
}



export default function KeyInsightsCard({ patterns, balancedStatesData }: KeyInsightsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
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