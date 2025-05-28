import {
  Heart,
  CloudRain,
  Flame,
  X,
  Zap,
  Sparkles,
  Circle,
} from "lucide-react"

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
  {
    id: "happy",
    name: "Happy",
    icon: Heart,
    color: "text-mint-600", 
  },
  {
    id: "sad",
    name: "Sad",
    icon: CloudRain,
    color: "text-sky-600", 
  },
  {
    id: "neutral",
    name: "Neutral",
    icon: Circle,
    color: "text-sand-600", 
  },
  {
    id: "angry",
    name: "Angry",
    icon: Flame,
    color: "text-blush-600", 
  },
  {
    id: "disgusted",
    name: "Disgusted",
    icon: X,
    color: "text-blush-600", 
  },
  {
    id: "fearful",
    name: "Fearful",
    icon: Zap,
    color: "text-lavender-600", 
  },
  {
    id: "surprised",
    name: "Surprised",
    icon: Sparkles,
    color: "text-lavender-600", 
  },
]

export const DEFAULT_MOODS: MoodTag[] = [
  // Happy
  { text: "Optimistic", category: "happy" },
  { text: "Trusting", category: "happy" },
  { text: "Peaceful", category: "happy" },
  { text: "Powerful", category: "happy" },
  { text: "Accepted", category: "happy" },
  { text: "Proud", category: "happy" },

  // Sad
  { text: "Hurt", category: "sad" },
  { text: "Depressed", category: "sad" },
  { text: "Guilty", category: "sad" },
  { text: "Despair", category: "sad" },
  { text: "Vulnerable", category: "sad" },
  { text: "Lonely", category: "sad" },

  // Neutral
  { text: "Calm", category: "neutral" },
  { text: "Balanced", category: "neutral" },
  { text: "Unemotional", category: "neutral" },

  // Angry
  { text: "Let down", category: "angry" },
  { text: "Humiliated", category: "angry" },
  { text: "Bitter", category: "angry" },
  { text: "Mad", category: "angry" },
  { text: "Aggressive", category: "angry" },
  { text: "Frustrated", category: "angry" },

  // Disgusted
  { text: "Disapproving", category: "disgusted" },
  { text: "Disappointed", category: "disgusted" },
  { text: "Awful", category: "disgusted" },
  { text: "Repelled", category: "disgusted" },

  // Fearful
  { text: "Scared", category: "fearful" },
  { text: "Anxious", category: "fearful" },
  { text: "Insecure", category: "fearful" },
  { text: "Weak", category: "fearful" },
  { text: "Rejected", category: "fearful" },
  { text: "Threatened", category: "fearful" },

  // Surprised
  { text: "Startled", category: "surprised" },
  { text: "Confused", category: "surprised" },
  { text: "Amazed", category: "surprised" },
  { text: "Excited", category: "surprised" },
]
