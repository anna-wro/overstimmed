import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Home } from "lucide-react"

type EnvironmentalFactorsData = Array<{
  environment: string
  count: number
  energy: number
  stimulation: number
  positivePercent: number
  neutralPercent: number
  negativePercent: number
}>

interface EnvironmentalFactorsCardProps {
  data: EnvironmentalFactorsData
}

export function EnvironmentalFactorsCard({ data }: EnvironmentalFactorsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-lavender-500" />
          Environmental Factors
        </CardTitle>
        <CardDescription>How different environments affect your energy and stimulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            <>
              <div className="text-sm font-medium mb-3">
                Environments with multiple entries:
              </div>
              <div className="space-y-3">
                {data.slice(0, 5).map((env, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{env.environment}</span>
                      <Badge variant="outline">{env.count} entries</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Energy:</span>
                        <span className="font-medium">{env.energy}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stimulation:</span>
                        <span className="font-medium">{env.stimulation}/10</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant="outline"
                        className="text-xs bg-mint-50 border-mint-200 text-mint-800 dark:bg-mint-900/20"
                      >
                        {env.positivePercent}% positive
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-sand-50 border-sand-200 text-sand-800 dark:bg-sand-900/20"
                      >
                        {env.neutralPercent}% neutral
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-blush-50 border-blush-200 text-blush-800 dark:bg-blush-900/20"
                      >
                        {env.negativePercent}% negative
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {data.length > 5 && (
                <p className="text-xs text-muted-foreground mt-3">
                  And {data.length - 5} more environments with patterns...
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No environmental patterns detected yet. Try mentioning specific places in your activities and notes to see how different environments affect you.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 