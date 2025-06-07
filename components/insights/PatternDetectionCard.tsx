import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { AlertCircle, AlertTriangle, Zap, Battery, Activity, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { insightsPageCopy } from "@/copy/insights"

interface Pattern {
  type: string
  description: string
  severity: string
}

interface PatternDetectionCardProps {
  patterns: Pattern[]
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
      return <AlertTriangle className="h-4 w-4" />
    case "high-stimulation-positive":
      return <Zap className="h-4 w-4" />
    case "low-energy":
      return <Battery className="h-4 w-4" />
    case "positive-experience":
      return <Activity className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}

export function PatternDetectionCard({ patterns }: PatternDetectionCardProps) {
  if (patterns.length === 0) return null

  return (
    <Card className="mb-8 bg-white/80 dark:bg-lavender-950/30 shadow-sm border-lavender-200 dark:border-lavender-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-lavender-500" />
          {insightsPageCopy.detectedPatterns.title}
        </CardTitle>
        <CardDescription>{insightsPageCopy.detectedPatterns.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-3 rounded-lg p-3", getPatternBadgeColor(pattern.severity))}
            >
              {getPatternIcon(pattern.type)}
              <p>{pattern.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 