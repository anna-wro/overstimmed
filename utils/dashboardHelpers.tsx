/** @fileoverview Supportive message generator based on energy and stimulation levels. */
import { ReactElement } from 'react'
import { Battery, Shield, Heart, Sparkles, Activity, Zap } from 'lucide-react'
import { dashboardCopy } from '@/copy/dashboard'

export const getEnergyColor = (level: number) => {
  if (level === 0) return "bg-gray-300 dark:bg-gray-500"
  if (level <= 3) return "bg-blush-300 dark:bg-blush-400"
  if (level <= 7) return "bg-sand-300 dark:bg-sand-400"
  return "bg-mint-300 dark:bg-mint-400"
}

export const getEnergyTextColor = (level: number) => {
  if (level === 0)
    return "text-gray-500 dark:text-gray-300 high-contrast:text-gray-800 dark:high-contrast:text-gray-200"
  if (level <= 3)
    return "text-blush-600 dark:text-blush-300 high-contrast:text-blush-800 dark:high-contrast:text-blush-200"
  if (level <= 7)
    return "text-sand-600 dark:text-sand-300 high-contrast:text-sand-800 dark:high-contrast:text-sand-200"
  return "text-mint-600 dark:text-mint-300 high-contrast:text-mint-800 dark:high-contrast:text-mint-200"
}

export const getStimulationColor = (level: number) => {
  if (level === 0) return "bg-gray-400 dark:bg-gray-500"
  if (level <= 3) return "bg-sand-300 dark:bg-sand-400"
  if (level <= 7) return "bg-lavender-300 dark:bg-lavender-400"
  return "bg-blush-300 dark:bg-blush-400"
}

export const getExperienceTypeColor = (type: string) => {
  if (type === "positive") return "text-lavender-700 dark:text-lavender-300"
  if (type === "neutral") return "text-sand-700 dark:text-sand-300"
  return "text-blush-700 dark:text-blush-300"
}

export const getExperienceTypeText = (type: string) => {
  if (type === "positive") return dashboardCopy.latestEntry.experienceTypes.positiveDescription
  if (type === "neutral") return dashboardCopy.latestEntry.experienceTypes.neutralDescription
  return dashboardCopy.latestEntry.experienceTypes.negativeDescription
}

export const getEnergyIcon = (level: number): ReactElement => {
  if (level === 0) return <Battery className="h-5 w-5 text-gray-500 dark:text-gray-400" />
  if (level <= 3) return <Battery className="h-5 w-5 text-blush-500 dark:text-blush-400" />
  if (level <= 7) return <Battery className="h-5 w-5 text-sand-500 dark:text-sand-400" />
  return <Battery className="h-5 w-5 text-mint-500 dark:text-mint-400" />
}

export const getEnergyText = (level: number) => {
  if (level === 0) return dashboardCopy.latestEntry.energy.noEnergy
  if (level <= 3) return dashboardCopy.latestEntry.energy.lowEnergy
  if (level <= 7) return dashboardCopy.latestEntry.energy.moderateEnergy
  return dashboardCopy.latestEntry.energy.highEnergy
}

export const getStimulationText = (level: number) => {
  if (level === 0) return dashboardCopy.latestEntry.stimulation.noStimulation
  if (level <= 3) return dashboardCopy.latestEntry.stimulation.understimulated
  if (level <= 7) return dashboardCopy.latestEntry.stimulation.comfortable
  return dashboardCopy.latestEntry.stimulation.overstimulated
}

// Get supportive message based on energy and stimulation levels
export const getSupportiveMessage = (energyLevel: number, stimulationLevel: number, stimulationType: string) => {
  // Low energy, high stimulation (overwhelmed)
  if (energyLevel <= 3 && stimulationLevel >= 8) {
    return {
      message: dashboardCopy.supportiveMessages.overwhelmed,
      icon: <Shield className="h-5 w-5 text-blush-500 dark:text-blush-400" />,
    }
  }
  // Low energy, low stimulation (depleted)
  else if (energyLevel <= 3 && stimulationLevel <= 3) {
    return {
      message: dashboardCopy.supportiveMessages.depleted,
      icon: <Battery className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
    }
  }
  // Low energy, moderate stimulation
  else if (energyLevel <= 3 && stimulationLevel > 3 && stimulationLevel < 8) {
    return {
      message: dashboardCopy.supportiveMessages.managingLowEnergy,
      icon: <Heart className="h-5 w-5 text-blush-500 dark:text-blush-400" />,
    }
  }
  // Moderate energy, high stimulation (activated)
  else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel >= 8) {
    return {
      message: dashboardCopy.supportiveMessages.needsQuietTime,
      icon: <Shield className="h-5 w-5 text-lavender-500 dark:text-lavender-400" />,
    }
  }
  // Moderate energy, moderate stimulation (balanced)
  else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel > 3 && stimulationLevel < 8) {
    return {
      message: dashboardCopy.supportiveMessages.balanced,
      icon: <Sparkles className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
    }
  }
  // Moderate energy, low stimulation (seeking)
  else if (energyLevel > 3 && energyLevel < 8 && stimulationLevel <= 3) {
    return {
      message: dashboardCopy.supportiveMessages.seekingEngagement,
      icon: <Activity className="h-5 w-5 text-sand-500 dark:text-sand-400" />,
    }
  }
  // High energy, high stimulation (intense)
  else if (energyLevel >= 8 && stimulationLevel >= 8) {
    return {
      message: dashboardCopy.supportiveMessages.highIntensity,
      icon: <Zap className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
    }
  }
  // High energy, moderate stimulation (productive)
  else if (energyLevel >= 8 && stimulationLevel > 3 && stimulationLevel < 8) {
    return {
      message: dashboardCopy.supportiveMessages.productive,
      icon: <Sparkles className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
    }
  }
  // High energy, low stimulation (restless)
  else if (energyLevel >= 8 && stimulationLevel <= 3) {
    return {
      message: dashboardCopy.supportiveMessages.restless,
      icon: <Activity className="h-5 w-5 text-mint-500 dark:text-mint-400" />,
    }
  }
  // Default message
  else {
    return {
      message: dashboardCopy.supportiveMessages.default,
      icon: <Heart className="h-5 w-5 text-lavender-500 dark:text-lavender-400" />,
    }
  }
} 