import { Smile, Frown, Meh, Angry, Heart, Star } from "lucide-react"

export type MoodCategory = {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

export type MoodTag = {
  text: string
  category: string
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  { id: "happy", name: "Happy", icon: Smile, color: "text-yellow-500" },
  { id: "sad", name: "Sad", icon: Frown, color: "text-blue-500" },
  { id: "neutral", name: "Neutral", icon: Meh, color: "text-gray-500" },
  { id: "angry", name: "Angry", icon: Angry, color: "text-red-500" },
  { id: "loving", name: "Loving", icon: Heart, color: "text-pink-500" },
  { id: "custom", name: "Custom", icon: Star, color: "text-lavender-500" },
]

export const DEFAULT_MOODS: MoodTag[] = [
  { text: "Joyful", category: "happy" },
  { text: "Content", category: "happy" },
  { text: "Excited", category: "happy" },
  { text: "Grateful", category: "happy" },
  { text: "Calm", category: "neutral" },
  { text: "Peaceful", category: "neutral" },
  { text: "Bored", category: "neutral" },
  { text: "Sad", category: "sad" },
  { text: "Lonely", category: "sad" },
  { text: "Disappointed", category: "sad" },
  { text: "Angry", category: "angry" },
  { text: "Frustrated", category: "angry" },
  { text: "Irritated", category: "angry" },
  { text: "Loving", category: "loving" },
  { text: "Affectionate", category: "loving" },
  { text: "Caring", category: "loving" },
] 