import { Battery, Zap, Calendar, Clock, Activity, Lightbulb, AlertCircle } from "lucide-react"

interface Recommendation {
  title: string
  description: string
  icon: React.ReactNode
}

interface GenerateRecommendationsProps {
  filteredEntries: any[]
  balancedStatesData: any
  recoveryPatternsData: any
  environmentalFactorsData: any[]
}

// Generate energy management recommendations
export const generateEnergyRecommendations = (
  filteredEntries: any[],
  balancedStatesData: any
): Recommendation[] => {
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
export const generateStimulationRecommendations = (
  filteredEntries: any[],
  recoveryPatternsData: any,
  environmentalFactorsData: any[]
): Recommendation[] => {
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
export const generateRoutineRecommendations = (
  filteredEntries: any[],
  balancedStatesData: any,
  recoveryPatternsData: any
): Recommendation[] => {
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

// Main function that combines all recommendations
export const generateRecommendations = ({
  filteredEntries,
  balancedStatesData,
  recoveryPatternsData,
  environmentalFactorsData,
}: GenerateRecommendationsProps) => {
  return {
    energyRecommendations: generateEnergyRecommendations(filteredEntries, balancedStatesData),
    stimulationRecommendations: generateStimulationRecommendations(
      filteredEntries,
      recoveryPatternsData,
      environmentalFactorsData
    ),
    routineRecommendations: generateRoutineRecommendations(
      filteredEntries,
      balancedStatesData,
      recoveryPatternsData
    ),
  }
} 