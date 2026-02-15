/** @fileoverview Card displaying detected behavioral patterns with severity badges. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { AlertCircle, AlertTriangle, Zap, Battery, Activity, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { insightsPageCopy } from "@/copy/insights"
import { getPatternBadgeColor, getPatternIcon } from "@/utils/patternHelpers"

interface Pattern {
  type: string
  description: string
  severity: string
}

interface PatternDetectionCardProps {
  patterns: Pattern[]
}



export function PatternDetectionCard({ patterns }: PatternDetectionCardProps) {
  if (patterns.length === 0) return null

  return (
    <Card className="mb-8 bg-white/80 dark:bg-lavender-950/30 shadow-xs border-lavender-200 dark:border-lavender-800">
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