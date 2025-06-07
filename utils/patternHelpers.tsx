import { AlertTriangle, Zap, Battery, Activity, Info, AlertCircle } from "lucide-react"

export const getPatternBadgeColor = (severity: string): string => {
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

export const getPatternIcon = (type: string) => {
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
      return <AlertCircle className="h-4 w-4" />
  }
} 