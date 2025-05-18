"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Zap, Calendar, Clock, Activity, Lightbulb, AlertCircle } from "lucide-react"

type RecommendationsTabProps = {
  filteredEntries: any[]
  balancedStatesData: any
  recoveryPatternsData: any
  environmentalFactorsData: any[]
}

export default function RecommendationsTab({
  filteredEntries,
  balancedStatesData,
  recoveryPatternsData,
  environmentalFactorsData,
}: RecommendationsTabProps) {
  // Generate energy management recommendations
  const energyRecommendations = () => {
    const recommendations = []

    // Check if there's enough data
    if (filteredEntries.length < 5) {
      return [
        {
          title: "Keep tracking",
          description: "Continue logging your energy and stimulation levels to get personalized recommendations.",
          icon: <Calendar className="h-5 w-5 text-lavender-500" />,
        },
      ]
    }

    // Low energy recommendations
    const lowEnergyEntries = filteredEntries.filter((entry) => entry.energyLevel <= 3)
    if (lowEnergyEntries.length >= 3) {
      recommendations.push({
        title: "Energy conservation",
        description:
          "You've had several low energy periods. Consider scheduling rest breaks throughout your day and prioritizing essential tasks during your higher energy times.",
        icon: <Battery className="h-5 w-5 text-sand-500" />,
      })
    }

    // Balanced state recommendations
    if (balancedStatesData.activities.length > 0) {
      recommendations.push({
        title: "Maintain balance",
        description: `Activities like ${balancedStatesData.activities
          .slice(0, 3)
          .map((a: any) => a.activity)
          .join(", ")} help you maintain a balanced state. Try to incorporate these regularly.`,
        icon: <Activity className="h-5 w-5 text-mint-500" />,
      })
    }

    // Time of day recommendations
    if (balancedStatesData.timeOfDay) {
      recommendations.push({
        title: "Optimal timing",
        description: `You tend to feel most balanced during the ${balancedStatesData.timeOfDay}. Schedule important or challenging tasks during this time when possible.`,
        icon: <Clock className="h-5 w-5 text-lavender-500" />,
      })
    }

    return recommendations
  }

  // Generate stimulation management recommendations
  const stimulationRecommendations = () => {
    const recommendations = []

    // Check if there's enough data
    if (filteredEntries.length < 5) {
      return []
    }

    // Overstimulation recommendations
    const highStimNegativeEntries = filteredEntries.filter(
      (entry) => entry.stimulationLevel >= 7 && entry.stimulationType === "negative",
    )
    if (highStimNegativeEntries.length >= 2) {
      recommendations.push({
        title: "Manage overstimulation",
        description:
          "You've experienced overstimulation several times. Consider carrying noise-canceling headphones, sunglasses, or finding quiet spaces when needed.",
        icon: <AlertCircle className="h-5 w-5 text-blush-500" />,
      })
    }

    // Recovery strategies
    if (recoveryPatternsData.activities.length > 0) {
      recommendations.push({
        title: "Effective recovery",
        description: `Activities like ${recoveryPatternsData.activities
          .slice(0, 3)
          .map((a: any) => a.activity)
          .join(", ")} have helped you recover from overstimulation. Keep these strategies accessible.`,
        icon: <Zap className="h-5 w-5 text-lavender-500" />,
      })
    }

    // Environmental recommendations
    const positiveEnvironments = environmentalFactorsData
      .filter((env) => env.positivePercent >= 60)
      .map((env) => env.environment)
      .slice(0, 3)

    const negativeEnvironments = environmentalFactorsData
      .filter((env) => env.negativePercent >= 60)
      .map((env) => env.environment)
      .slice(0, 3)

    if (positiveEnvironments.length > 0) {
      recommendations.push({
        title: "Supportive environments",
        description: `Environments like ${positiveEnvironments.join(
          ", ",
        )} tend to be positive for you. Seek these out when possible.`,
        icon: <Lightbulb className="h-5 w-5 text-mint-500" />,
      })
    }

    if (negativeEnvironments.length > 0) {
      recommendations.push({
        title: "Challenging environments",
        description: `Environments like ${negativeEnvironments.join(
          ", ",
        )} tend to be challenging. Prepare coping strategies before entering these spaces.`,
        icon: <AlertCircle className="h-5 w-5 text-blush-500" />,
      })
    }

    return recommendations
  }

  // Generate routine recommendations
  const routineRecommendations = () => {
    const recommendations = []

    // Check if there's enough data
    if (filteredEntries.length < 10) {
      return []
    }

    // Day of week recommendations
    if (balancedStatesData.dayOfWeek) {
      recommendations.push({
        title: "Weekly planning",
        description: `${
          balancedStatesData.dayOfWeek.charAt(0).toUpperCase() + balancedStatesData.dayOfWeek.slice(1)
        } tends to be your most balanced day. Consider scheduling demanding activities on this day when possible.`,
        icon: <Calendar className="h-5 w-5 text-lavender-500" />,
      })
    }

    // General routine recommendations
    recommendations.push({
      title: "Consistent routine",
      description:
        "Maintaining a consistent daily routine can help manage energy levels and reduce unexpected stimulation.",
      icon: <Clock className="h-5 w-5 text-sand-500" />,
    })

    // Recovery time recommendation
    if (recoveryPatternsData.avgRecoveryTime > 0) {
      const hours = Math.floor(recoveryPatternsData.avgRecoveryTime)
      const minutes = Math.round((recoveryPatternsData.avgRecoveryTime - hours) * 60)

      recommendations.push({
        title: "Recovery planning",
        description: `On average, you need about ${hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : ""}${
          hours > 0 && minutes > 0 ? " and " : ""
        }${minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : ""} to recover from overstimulation. Plan buffer time in your schedule accordingly.`,
        icon: <Battery className="h-5 w-5 text-mint-500" />,
      })
    }

    return recommendations
  }

  const energyRecs = energyRecommendations()
  const stimulationRecs = stimulationRecommendations()
  const routineRecs = routineRecommendations()

  return (
    <div className="space-y-6">
      {/* Energy Management */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-sand-500" />
            Energy Management
          </CardTitle>
          <CardDescription>Recommendations for managing your energy levels</CardDescription>
        </CardHeader>
        <CardContent>
          {energyRecs.length > 0 ? (
            <div className="space-y-6">
              {energyRecs.map((rec, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-0.5">{rec.icon}</div>
                  <div>
                    <h3 className="font-medium mb-1">{rec.title}</h3>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Continue tracking to receive personalized energy management recommendations.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stimulation Management */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-lavender-500" />
            Stimulation Management
          </CardTitle>
          <CardDescription>Strategies for managing sensory input and stimulation</CardDescription>
        </CardHeader>
        <CardContent>
          {stimulationRecs.length > 0 ? (
            <div className="space-y-6">
              {stimulationRecs.map((rec, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-0.5">{rec.icon}</div>
                  <div>
                    <h3 className="font-medium mb-1">{rec.title}</h3>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Continue tracking to receive personalized stimulation management recommendations.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Routine Optimization */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-500" />
            Routine Optimization
          </CardTitle>
          <CardDescription>Suggestions for optimizing your daily and weekly routines</CardDescription>
        </CardHeader>
        <CardContent>
          {routineRecs.length > 0 ? (
            <div className="space-y-6">
              {routineRecs.map((rec, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-0.5">{rec.icon}</div>
                  <div>
                    <h3 className="font-medium mb-1">{rec.title}</h3>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Continue tracking to receive personalized routine optimization recommendations.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
