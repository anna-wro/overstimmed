/** @fileoverview Card analyzing recovery patterns after high-stimulation episodes. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Leaf } from "lucide-react"

type RecoveryPatternsData = {
  count: number
  avgRecoveryTime: number
  activities: Array<{ activity: string; count: number }>
}

interface RecoveryPatternsCardProps {
  data: RecoveryPatternsData
}

export function RecoveryPatternsCard({ data }: RecoveryPatternsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-sand-500" />
          Recovery Patterns
        </CardTitle>
        <CardDescription>How you recover from overstimulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recovery instances:</span>
            <Badge variant="secondary" className="bg-sand-100 text-sand-800 dark:bg-sand-900/50 dark:text-sand-300">
              {data.count}
            </Badge>
          </div>

          {data.count > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average recovery time:</span>
                <Badge variant="outline">
                  {data.avgRecoveryTime} {data.avgRecoveryTime === 1 ? 'hour' : 'hours'}
                </Badge>
              </div>

              {data.activities.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Helpful activities:</span>
                  <div className="flex flex-wrap gap-2">
                    {data.activities.map((activity, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-sand-50 border-sand-200 text-sand-800 dark:bg-sand-900/20 dark:border-sand-800 dark:text-sand-300"
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
              No clear recovery patterns detected yet. Keep tracking to understand how you bounce back from overwhelming moments.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 