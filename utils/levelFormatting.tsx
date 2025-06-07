import { ReactNode } from 'react'
import { Battery, BatteryLow } from 'lucide-react'

export const getEnergyIcon = (level: number): ReactNode => {
  if (level === 0) return <Battery className="h-5 w-5 text-gray-500 dark:text-gray-400" />
  if (level <= 3) return <BatteryLow className="h-5 w-5 text-blush-600 dark:text-blush-300" />
  if (level <= 7) return <Battery className="h-5 w-5 text-sand-600 dark:text-sand-300" />
  return <Battery className="h-5 w-5 text-mint-600 dark:text-mint-300" />
}

export const getEnergyColor = (level: number): string => {
  if (level === 0) return "bg-gray-300 dark:bg-gray-500"
  if (level <= 3) return "bg-blush-300 dark:bg-blush-400"
  if (level <= 7) return "bg-sand-300 dark:bg-sand-400"
  return "bg-mint-300 dark:bg-mint-400"
}

export const getEnergyTextColor = (level: number): string => {
  if (level === 0) return "text-gray-600 dark:text-gray-300"
  if (level <= 3) return "text-blush-600 dark:text-blush-300"
  if (level <= 7) return "text-sand-600 dark:text-sand-300"
  return "text-mint-600 dark:text-mint-300"
}

export const getEnergyText = (level: number): string => {
  if (level === 0) return "No Energy"
  if (level <= 3) return "Low Energy"
  if (level <= 7) return "Moderate Energy"
  return "High Energy"
}

export const getStimulationColor = (level: number): string => {
  if (level === 0) return "bg-gray-400 dark:bg-gray-500"
  if (level <= 3) return "bg-sand-300 dark:bg-sand-400"
  if (level <= 7) return "bg-lavender-300 dark:bg-lavender-400"
  return "bg-blush-300 dark:bg-blush-400"
}

export const getStimulationText = (level: number): string => {
  if (level === 0) return "No Stimulation"
  if (level <= 3) return "Low Stimulation"
  if (level <= 7) return "Moderate Stimulation"
  return "High Stimulation"
}

export const getEnergyBackgroundColor = (level: number): string => {
  if (level === 0) return "bg-gray-100 dark:bg-gray-900/30"
  if (level <= 3) return "bg-blush-100 dark:bg-blush-900/30"
  if (level <= 7) return "bg-sand-50 dark:bg-sand-900/20"
  return "bg-mint-50 dark:bg-mint-900/20"
}

export const getEnergyNumberColor = (level: number): string => {
  if (level === 0) return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300"
  if (level <= 3) return "bg-blush-100 text-blush-600 dark:bg-blush-900/30 dark:text-blush-300"
  if (level <= 7) return "bg-sand-50 text-sand-600 dark:bg-sand-900/20 dark:text-sand-300"
  return "bg-mint-50 text-mint-600 dark:bg-mint-900/20 dark:text-mint-300"
}

export const getEnergyDescription = (level: number): string => {
  if (level === 0) return "Complete depletion - rest needed"
  if (level <= 3) return "Below normal - take it easy"
  if (level <= 7) return "Balanced - sustainable level"
  return "Energized - feeling great"
}

export const getStimulationDescription = (level: number): string => {
  if (level === 0) return "Completely understimulated"
  if (level <= 3) return "Mildly understimulated"
  if (level <= 7) return "Comfortable stimulation level"
  return "Highly stimulated"
} 