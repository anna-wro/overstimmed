import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Activity } from "lucide-react"

interface ExperienceBreakdownCardProps {
  positivePercent: number
  neutralPercent: number
  negativePercent: number
}

export default function ExperienceBreakdownCard({ 
  positivePercent, 
  neutralPercent, 
  negativePercent 
}: ExperienceBreakdownCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-mint-500" />
          Experience Breakdown
        </CardTitle>
        <CardDescription>How you've been feeling</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-mint-500"></div>
              <span>Positive</span>
            </div>
            <span className="font-medium">{positivePercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-mint-500" style={{ width: `${positivePercent}%` }}></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-sand-500"></div>
              <span>Neutral</span>
            </div>
            <span className="font-medium">{neutralPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-sand-500" style={{ width: `${neutralPercent}%` }}></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blush-500"></div>
              <span>Negative</span>
            </div>
            <span className="font-medium">{negativePercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-blush-500" style={{ width: `${negativePercent}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 