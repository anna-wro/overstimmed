"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  BarChart3,
  ArrowRight,
  Clock,
  Archive,
  AlertCircle,
  Activity,
  FileText,
  FileQuestion,
  Zap,
  Battery,
  Heart,
  Sparkles,
  Shield,
  TrendingUp,
  LineChart,
  Calendar,
  Sliders,
  Loader2,
} from "lucide-react"
import { format, subDays } from "date-fns"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/components/ui/Chart"
import { useLocalStorage } from "@/hooks/useLocalStorage"

type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

export default function Home() {
  const [latestEntry, setLatestEntry] = useState<TrackingEntry | null>(null)
  const [entries, setEntries] = useLocalStorage<TrackingEntry[]>("trackingEntries", [])
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgEnergy: 0,
    avgStimulation: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  })
  const { setTheme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (entries.length > 0) {
      // Sort by timestamp (newest first) and get the latest entry
      const sorted = [...entries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      setLatestEntry(sorted[0])

      // Calculate statistics
      const totalEntries = entries.length
      const avgEnergy =
        Math.round((entries.reduce((sum, entry) => sum + entry.energyLevel, 0) / totalEntries) * 10) / 10
      const avgStimulation =
        Math.round((entries.reduce((sum, entry) => sum + entry.stimulationLevel, 0) / totalEntries) * 10) / 10

      // Count by type
      const positiveCount = entries.filter((entry) => entry.stimulationType === "positive").length
      const negativeCount = entries.filter((entry) => entry.stimulationType === "negative").length
      const neutralCount = entries.filter((entry) => entry.stimulationType === "neutral").length

      setStats({
        totalEntries,
        avgEnergy,
        avgStimulation,
        positiveCount,
        negativeCount,
        neutralCount,
      })

      // Get recent entries for chart (last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7).getTime()
      const recent = sorted
        .filter((entry) => new Date(entry.timestamp).getTime() > sevenDaysAgo)
        .slice(0, 7)
        .reverse()
        .map((entry) => ({
          date: format(new Date(entry.timestamp), "MM/dd"),
          energy: entry.energyLevel,
          stimulation: entry.stimulationLevel,
        }))

      setRecentEntries(recent)
    }

    // Load theme settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.theme) {
          setTheme(settings.theme)
        }
        if (settings.highContrastMode) {
          document.documentElement.classList.add("high-contrast")
        } else {
          document.documentElement.classList.remove("high-contrast")
        }
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    }
    setLoading(false)
  }, [entries, setTheme])

  const getEnergyColor = (level: number) => {
    if (level === 0) return "bg-gray-300 dark:bg-gray-500"
    if (level <= 3) return "bg-blush-300 dark:bg-blush-400"
    if (level <= 7) return "bg-sand-300 dark:bg-sand-400"
    return "bg-mint-300 dark:bg-mint-400"
  }

  const getEnergyTextColor = (level: number) => {
    if (level === 0)
      return "text-gray-500 dark:text-gray-300 high-contrast:text-gray-800 dark:high-contrast:text-gray-200"
    if (level <= 3)
      return "text-blush-600 dark:text-blush-300 high-contrast:text-blush-800 dark:high-contrast:text-blush-200"
    if (level <= 7)
      return "text-sand-600 dark:text-sand-300 high-contrast:text-sand-800 dark:high-contrast:text-sand-200"
    return "text-mint-600 dark:text-mint-300 high-contrast:text-mint-800 dark:high-contrast:text-mint-200"
  }

  const getStimulationColor = (level: number) => {
    if (level === 0) return "bg-gray-400 dark:bg-gray-500"
    if (level <= 3) return "bg-sand-300 dark:bg-sand-400"
    if (level <= 7) return "bg-lavender-300 dark:bg-lavender-400"
    return "bg-blush-300 dark:bg-blush-400"
  }

  const getExperienceTypeColor = (type: string) => {
    if (type === "positive") return "text-lavender-700 dark:text-lavender-300"
    if (type === "neutral") return "text-sand-700 dark:text-sand-300"
    return "text-blush-700 dark:text-blush-300"
  }

  const getExperienceTypeText = (type: string) => {
    if (type === "positive") return "Positive/Energizing"
    if (type === "neutral") return "Neutral/Balanced"
    return "Negative/Draining"
  }

  const getEnergyIcon = (level: number) => {
    if (level === 0) return <Battery className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    if (level <= 3) return <Battery className="h-5 w-5 text-blush-500 dark:text-blush-400" />
    if (level <= 7) return <Battery className="h-5 w-5 text-sand-500 dark:text-sand-400" />
    return <Battery className="h-5 w-5 text-mint-500 dark:text-mint-400" />
  }

  const getEnergyText = (level: number) => {
    if (level === 0) return "No Energy"
    if (level <= 3) return "Low Energy"
    if (level <= 7) return "Moderate Energy"
    return "High Energy"
  }

  const getStimulationText = (level: number) => {
    if (level === 0) return "No Stimulation"
    if (level <= 3) return "Understimulated"
    if (level <= 7) return "Comfortable"
    return "Overstimulated"
  }

  // Get supportive message based on energy and stimulation levels
  const getSupportiveMessage = (energyLevel: number, stimulationLevel: number, stimulationType: string) => {
    // Low energy, high stimulation (overwhelmed)
    if (energyLevel <= 3 && stimulationLevel >= 8) {
      return {
        message: "You might be feeling overwhelmed right now. It's okay to step back and take a break.",
        icon: <Shield className="h-5 w-5 text-blush-500 dark:text-blush-400" />,
      }
    }
    // Low energy, low stimulation (depleted)
    else if (energyLevel <= 3 && stimulationLevel <= 3) {
      return {
        message: "Your batteries seem low. Remember that rest is productive too.",
        icon: <Battery className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
      }
    }
    // Low energy, moderate stimulation
    else if (energyLevel <= 3 && stimulationLevel > 3 && stimulationLevel < 8) {
      return {
        message: "You're managing input despite low energy. That takes strength.",
        icon: <Heart className="h-5 w-5 text-blush-500 dark:text-blush-400" />,
      }
    }
    // Moderate energy, high stimulation (activated)
    else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel >= 8) {
      return {
        message: "You might need some quiet time to process all this stimulation.",
        icon: <Shield className="h-5 w-5 text-lavender-500 dark:text-lavender-400" />,
      }
    }
    // Moderate energy, moderate stimulation (balanced)
    else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel > 3 && stimulationLevel < 8) {
      return {
        message: "You seem to be in a balanced state. This is a good time to engage in activities you enjoy.",
        icon: <Sparkles className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
      }
    }
    // Moderate energy, low stimulation (seeking)
    else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel <= 3) {
      return {
        message: "You might benefit from some engaging activities to match your energy level.",
        icon: <Activity className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
      }
    }
    // High energy, high stimulation (intense)
    else if (energyLevel >= 8 && stimulationLevel >= 8) {
      return {
        message: "You're experiencing high intensity. Remember to channel this energy constructively.",
        icon: <Zap className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
      }
    }
    // High energy, moderate stimulation (productive)
    else if (energyLevel >= 8 && stimulationLevel > 3 && stimulationLevel < 8) {
      return {
        message: "This could be a great time for focused work or creative activities.",
        icon: <Sparkles className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
      }
    }
    // High energy, low stimulation (restless)
    else if (energyLevel >= 8 && stimulationLevel <= 3) {
      return {
        message: "You have energy that's looking for an outlet. What would feel good to do right now?",
        icon: <Activity className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
      }
    }
    // Default message
    else {
      return {
        message: "Your experience is valid, whatever you're feeling right now.",
        icon: <Heart className="h-5 w-5 text-lavender-500 dark:text-lavender-400" />,
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-12 high-contrast:bg-white dark:high-contrast:bg-black">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <Link href="/">
            <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
              Overstimmed
            </h1>
          </Link>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            Track your energy levels and manage overstimulation
          </p>

          {/* Quick access tracking button */}
          <div className="mt-6">
            <Link href="/track">
              <Button
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-lavender-500 to-sand-400 text-white transition-all hover:from-lavender-600 hover:to-sand-500 dark:from-lavender-600 dark:to-sand-500 dark:hover:from-lavender-700 dark:hover:to-sand-600 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Track Now
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mb-20">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : !latestEntry ? (
          <Card className="mb-10 border-dashed bg-sand-50/80 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-1 text-xl font-medium">No entries yet</h2>
              <p className="mb-4 text-muted-foreground">
                Start tracking your energy and stimulation levels to see your data here
              </p>
              <Link href="/track">
                <Button variant="outline" className="high-contrast:border-black dark:high-contrast:border-white">
                  Create Your First Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest Entry</h2>
              <div className="flex items-center rounded-full bg-sand-100 dark:bg-sand-900 px-3 py-1 text-sm text-muted-foreground high-contrast:bg-accent high-contrast:text-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {format(new Date(latestEntry.timestamp), "PPP p")}
              </div>
            </div>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-sand-50/80 to-lavender-50/80 shadow-xl dark:from-lavender-900/30 dark:to-sand-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
              <CardContent className="p-0">
                <div className="relative overflow-hidden p-6">
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-lavender-200/50 dark:bg-lavender-800/20 high-contrast:hidden"></div>
                  <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-sand-200/50 dark:bg-sand-800/20 high-contrast:hidden"></div>
 
                  {/* Supportive message */}
                  {latestEntry && (
                    <div className="mb-6 rounded-lg border border-lavender-200 bg-lavender-50/50 p-4 dark:border-lavender-800 dark:bg-lavender-900/30 high-contrast:border-primary high-contrast:bg-primary/5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {
                            getSupportiveMessage(
                              latestEntry.energyLevel,
                              latestEntry.stimulationLevel,
                              latestEntry.stimulationType,
                            ).icon
                          }
                        </div>
                        <p className="text-sm italic text-foreground">
                          {
                            getSupportiveMessage(
                              latestEntry.energyLevel,
                              latestEntry.stimulationLevel,
                              latestEntry.stimulationType,
                            ).message
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left column - Energy & Stimulation Summary */}
                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">How You Felt</h3>
                        <div className="flex items-center space-x-1">
                          {latestEntry.stimulationType === "positive" && (
                            <span className="flex items-center rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-700 dark:bg-lavender-900/50 dark:text-lavender-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                              <div className="mr-1 h-2 w-2 rounded-full bg-lavender-400 high-contrast:bg-primary-foreground"></div>
                              Positive
                            </span>
                          )}
                          {latestEntry.stimulationType === "neutral" && (
                            <span className="flex items-center rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-sand-700 dark:bg-sand-900/50 dark:text-sand-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                              <div className="mr-1 h-2 w-2 rounded-full bg-sand-400 high-contrast:bg-primary-foreground"></div>
                              Neutral
                            </span>
                          )}
                          {latestEntry.stimulationType === "negative" && (
                            <span className="flex items-center rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-700 dark:bg-blush-900/50 dark:text-blush-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                              <div className="mr-1 h-2 w-2 rounded-full bg-blush-400 high-contrast:bg-primary-foreground"></div>
                              Negative
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-8 space-y-6">
                        <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                                  latestEntry.energyLevel === 0
                                    ? "bg-gray-100 dark:bg-gray-900/30"
                                    : latestEntry.energyLevel <= 3
                                      ? "bg-blush-100 dark:bg-blush-900/30"
                                      : latestEntry.energyLevel <= 7
                                        ? "bg-sand-50 dark:bg-sand-900/20"
                                        : "bg-mint-50 dark:bg-mint-900/20"
                                } high-contrast:bg-accent`}
                              >
                                {getEnergyIcon(latestEntry.energyLevel)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Energy Level</div>
                                <div
                                  className={`font-semibold ${getEnergyTextColor(latestEntry.energyLevel)} high-contrast:text-foreground`}
                                >
                                  {getEnergyText(latestEntry.energyLevel)}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                                latestEntry.energyLevel === 0
                                  ? "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300"
                                  : latestEntry.energyLevel <= 3
                                    ? "bg-blush-100 text-blush-600 dark:bg-blush-900/30 dark:text-blush-300"
                                    : latestEntry.energyLevel <= 7
                                      ? "bg-sand-50 text-sand-600 dark:bg-sand-900/20 dark:text-sand-300"
                                      : "bg-mint-50 text-mint-600 dark:bg-mint-900/20 dark:text-mint-300"
                              } high-contrast:bg-primary high-contrast:text-primary-foreground high-contrast:font-extrabold`}
                            >
                              {latestEntry.energyLevel}
                            </div>
                          </div>

                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800 high-contrast:bg-muted">
                            <div
                              className={`h-full rounded-full ${getEnergyColor(latestEntry.energyLevel)} transition-all duration-500 high-contrast:bg-primary`}
                              style={{ width: `${latestEntry.energyLevel * 10}%` }}
                            ></div>
                          </div>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {latestEntry.energyLevel === 0
                              ? "You may feel completely exhausted"
                              : latestEntry.energyLevel <= 3
                                ? "You may feel tired or drained"
                                : latestEntry.energyLevel <= 7
                                  ? "You feel balanced and steady"
                                  : "You may feel very active or restless"}
                          </p>
                        </div>

                        <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sand-100 to-lavender-100 dark:from-sand-900/30 dark:to-lavender-900/30 high-contrast:bg-accent high-contrast:from-accent high-contrast:to-accent">
                                <Zap className="h-5 w-5 text-sand-600 dark:text-sand-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Stimulation Level</div>
                                <div className="font-semibold high-contrast:text-foreground">
                                  {getStimulationText(latestEntry.stimulationLevel)}
                                </div>
                              </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sand-100 to-lavender-100 text-xl font-bold dark:from-sand-900/30 dark:to-lavender-900/30 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary high-contrast:text-primary-foreground high-contrast:font-extrabold">
                              {latestEntry.stimulationLevel}
                            </div>
                          </div>

                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-lavender-100 p-0.5 dark:bg-lavender-900/50 high-contrast:bg-muted">
                            <div
                              className={`h-full rounded-full ${getStimulationColor(
                                latestEntry.stimulationLevel,
                              )} transition-all duration-500 high-contrast:bg-primary`}
                              style={{ width: `${latestEntry.stimulationLevel * 10}%` }}
                            ></div>
                          </div>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {latestEntry.stimulationLevel === 0
                              ? "You may feel completely unstimulated"
                              : latestEntry.stimulationLevel <= 3
                                ? "You may feel bored or seeking input"
                                : latestEntry.stimulationLevel <= 7
                                  ? "You feel comfortable with sensory input"
                                  : "You may feel overwhelmed or need to reduce input"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right column - Details */}
                    <div className="relative">
                      <h3 className="mb-6 text-xl font-semibold">Details</h3>

                      <div className="space-y-4">
                        {latestEntry.triggers && (
                          <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-lavender-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-lavender-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                            <div className="mb-2 flex items-center">
                              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-100 group-hover:bg-lavender-200 dark:bg-lavender-900/30 high-contrast:bg-accent">
                                <AlertCircle className="h-3.5 w-3.5 text-lavender-600 dark:text-lavender-400" />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">Triggers</span>
                            </div>
                            <p className="text-sm">{latestEntry.triggers}</p>
                          </div>
                        )}

                        {latestEntry.activities && (
                          <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-sand-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-sand-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                            <div className="mb-2 flex items-center">
                              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-sand-100 group-hover:bg-sand-200 dark:bg-sand-900/30 high-contrast:bg-accent">
                                <Activity className="h-3.5 w-3.5 text-sand-600 dark:text-sand-400" />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">Activities</span>
                            </div>
                            <p className="text-sm">{latestEntry.activities}</p>
                          </div>
                        )}

                        {latestEntry.notes && (
                          <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-lavender-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-lavender-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                            <div className="mb-2 flex items-center">
                              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-100 group-hover:bg-lavender-200 dark:bg-lavender-900/30 high-contrast:bg-accent">
                                <FileText className="h-3.5 w-3.5 text-lavender-600 dark:text-lavender-400" />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">Notes</span>
                            </div>
                            <p className="text-sm">{latestEntry.notes}</p>
                          </div>
                        )}

                        {!latestEntry.triggers && !latestEntry.activities && !latestEntry.notes && (
                          <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-8 text-center high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
                            <div>
                              <FileQuestion className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No additional details provided</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end bg-sand-100/50 px-6 py-3 dark:bg-sand-900/50 high-contrast:bg-accent">
                <Link href="/archive">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Archive className="mr-1 h-4 w-4" />
                    View All Entries
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Analytics Section */}
        {entries.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Insights</h2>
              <Link href="/insights">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  View All Insights
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-mint-50/80 to-sky-50/80 shadow-xl dark:from-mint-900/30 dark:to-sky-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-mint-400 to-sky-300 high-contrast:bg-primary"></div>

              <CardHeader className="bg-mint-100/50 pb-4 pt-6 dark:bg-mint-900/20 high-contrast:bg-accent">
                <CardTitle className="text-center text-xl">Energy & Stimulation Trends</CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
                  <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Entries</div>
                    <div className="text-3xl font-bold text-mint-600 dark:text-mint-400 high-contrast:text-foreground">
                      {stats.totalEntries}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Energy</div>
                    <div className="text-3xl font-bold text-sand-600 dark:text-sand-400 high-contrast:text-foreground">
                      {stats.avgEnergy}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Stimulation</div>
                    <div className="text-3xl font-bold text-lavender-600 dark:text-lavender-400 high-contrast:text-foreground">
                      {stats.avgStimulation}
                    </div>
                  </div>
                </div>

                {recentEntries.length > 0 ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={recentEntries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis domain={[0, 10]} stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="#57b185"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          name="Energy"
                        />
                        <Line
                          type="monotone"
                          dataKey="stimulation"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          name="Stimulation"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <LineChart className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">Add more entries to see your trends over time</p>
                  </div>
                )}

                {recentEntries.length > 3 && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Quick Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Time of day insight */}
                      <div className="rounded-lg border bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-lavender-500" />
                          <h4 className="font-medium">Time of Day</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {(() => {
                            // Group entries by time of day
                            const timeGroups = entries.reduce(
                              (acc, entry) => {
                                const date = new Date(entry.timestamp)
                                const hours = date.getHours()
                                let timeOfDay = "morning"
                                if (hours >= 12 && hours < 17) timeOfDay = "afternoon"
                                else if (hours >= 17 && hours < 21) timeOfDay = "evening"
                                else if (hours >= 21 || hours < 5) timeOfDay = "night"

                                if (!acc[timeOfDay]) acc[timeOfDay] = []
                                acc[timeOfDay].push(entry)
                                return acc
                              },
                              {} as Record<string, TrackingEntry[]>,
                            )

                            // Find time of day with highest average energy
                            let highestEnergyTime = ""
                            let highestEnergyAvg = 0

                            Object.entries(timeGroups).forEach(([time, entries]) => {
                              if (entries.length === 0) return
                              const avg = entries.reduce((sum, e) => sum + e.energyLevel, 0) / entries.length
                              if (avg > highestEnergyAvg) {
                                highestEnergyAvg = avg
                                highestEnergyTime = time
                              }
                            })

                            return highestEnergyTime
                              ? `Your energy tends to be highest during the ${highestEnergyTime}.`
                              : "Track more entries to see patterns by time of day."
                          })()}
                        </p>
                      </div>

                      {/* Trigger insight */}
                      <div className="rounded-lg border bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-mint-500" />
                          <h4 className="font-medium">Common Triggers</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {(() => {
                            // Extract all triggers
                            const allTriggers = entries
                              .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
                              .filter((t) => t.length > 0)

                            // Count occurrences
                            const triggerCounts = allTriggers.reduce(
                              (acc, trigger) => {
                                acc[trigger] = (acc[trigger] || 0) + 1
                                return acc
                              },
                              {} as Record<string, number>,
                            )

                            // Get top trigger
                            const topTriggers = Object.entries(triggerCounts)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 2)
                              .map(([trigger]) => trigger)

                            return topTriggers.length > 0
                              ? `Your most common triggers are: ${topTriggers.join(", ")}.`
                              : "Add triggers when tracking to see patterns."
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between bg-mint-100/50 px-6 py-4 dark:bg-mint-900/20 high-contrast:bg-accent">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-mint-500"></div>
                    <span className="text-xs text-muted-foreground">Energy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-lavender-500"></div>
                    <span className="text-xs text-muted-foreground">Stimulation</span>
                  </div>
                </div>

                <Link href="/insights">
                  <Button
                    size="sm"
                    className="group relative overflow-hidden bg-mint-500 text-white hover:bg-mint-600 dark:bg-mint-600 dark:hover:bg-mint-700 high-contrast:bg-primary"
                  >
                    <span className="relative z-10 flex items-center">
                      View Detailed Insights
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 z-0 translate-y-full bg-mint-400 transition-transform duration-300 group-hover:translate-y-0 dark:bg-mint-500 high-contrast:bg-primary high-contrast:opacity-80"></span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Link href="/track" className="group md:col-span-1">
            <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-lavender-300 hover:shadow-lg hover:shadow-lavender-200/30 dark:hover:border-lavender-700 dark:hover:shadow-lavender-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 rounded-full bg-lavender-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-lavender-900/30 high-contrast:bg-accent">
                  <Activity className="h-12 w-12 text-lavender-600 dark:text-lavender-400" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Track Now</h2>
                <p className="mb-6 text-muted-foreground">Log your current energy level and stimulation state</p>
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-lavender-500 text-white hover:bg-lavender-600 dark:bg-lavender-600 dark:hover:bg-lavender-700 high-contrast:bg-primary"
                >
                  <span className="relative z-10 flex items-center">
                    Start Tracking
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-lavender-400 transition-transform duration-300 group-hover:translate-y-0 dark:bg-lavender-500 high-contrast:bg-primary high-contrast:opacity-80"></span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/archive" className="group md:col-span-1">
            <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/30 dark:hover:border-sky-700 dark:hover:shadow-sky-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 rounded-full bg-sky-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-sky-900/30 high-contrast:bg-accent">
                  <Calendar className="h-12 w-12 text-sky-600 dark:text-sky-400" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Archive</h2>
                <p className="mb-6 text-muted-foreground">View and analyze your past tracking entries</p>
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-sky-500 text-sky-700 hover:text-white dark:border-sky-600 dark:text-sky-400 high-contrast:border-black dark:high-contrast:border-white high-contrast:text-foreground high-contrast:hover:border-primary"
                >
                  <span className="relative z-10 flex items-center">
                    View Archive
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-sky-500 transition-transform duration-300 group-hover:translate-y-0 dark:bg-sky-600 high-contrast:bg-primary"></span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings" className="group md:col-span-1">
            <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-sand-300 hover:shadow-lg hover:shadow-sand-200/30 dark:hover:border-sand-700 dark:hover:shadow-sand-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 rounded-full bg-sand-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-sand-900/30 high-contrast:bg-accent">
                  <Sliders className="h-12 w-12 text-sand-600 dark:text-sand-400" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Settings</h2>
                <p className="mb-6 text-muted-foreground">Customize your experience and manage your data</p>
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-sand-500 text-sand-700 hover:text-white dark:border-sand-600 dark:text-sand-400 high-contrast:border-black dark:high-contrast:border-white high-contrast:text-foreground high-contrast:hover:border-primary"
                >
                  <span className="relative z-10 flex items-center">
                    Open Settings
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-sand-500 transition-transform duration-300 group-hover:translate-y-0 dark:bg-sand-600 high-contrast:bg-primary"></span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Theme toggle */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Floating action button for quick tracking */}
        <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
          <Link href="/track">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-lavender-500 p-0 shadow-lg hover:bg-lavender-600 dark:bg-lavender-600 dark:hover:bg-lavender-700 high-contrast:bg-primary"
              aria-label="Track now"
            >
              <Activity className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
