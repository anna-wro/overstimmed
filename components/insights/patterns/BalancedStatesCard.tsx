/** @fileoverview Card analyzing when balanced energy-stimulation states occur. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Heart } from "lucide-react"

type BalancedStatesData = {
  count: number
  timeOfDay: string | null
  dayOfWeek: string | null
  activities: Array<{ activity: string; count: number }>
}

interface BalancedStatesCardProps {
  data: BalancedStatesData
}

export function BalancedStatesCard({ data }: BalancedStatesCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-mint-500" />
          Balanced States
        </CardTitle>
        <CardDescription>Times when you felt energized and comfortably stimulated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total balanced moments:</span>
            <Badge variant="secondary" className="bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300">
              {data.count}
            </Badge>
          </div>

          {data.count > 0 ? (
            <>
              {data.timeOfDay && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Most common time:</span>
                  <Badge variant="outline" className="capitalize">
                    {data.timeOfDay}
                  </Badge>
                </div>
              )}

              {data.dayOfWeek && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Most common day:</span>
                  <Badge variant="outline" className="capitalize">
                    {data.dayOfWeek}s
                  </Badge>
                </div>
              )}

              {data.activities.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Common activities:</span>
                  <div className="flex flex-wrap gap-2">
                    {data.activities.map((activity, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-mint-50 border-mint-200 text-mint-800 dark:bg-mint-900/20 dark:border-mint-800 dark:text-mint-300"
                      >
                        {activity.activity} ({activity.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No balanced states detected yet. Keep tracking to identify your optimal energy-stimulation combinations!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 