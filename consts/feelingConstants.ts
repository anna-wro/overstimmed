/** @fileoverview Predefined feeling/emotion tag constants with categories. */
import {
  Heart,
  CloudRain,
  Flame,
  Zap,
  Sparkles,
  Leaf,
  Activity,
} from "lucide-react"

export type FeelingCategory = {
  id: string
  name: string
  icon: React.ElementType 
  color: string
}

export type FeelingTag = {
  text: string
  category: string
}

export const FEELING_CATEGORIES: FeelingCategory[] = [
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
    id: "angry",
    name: "Angry",
    icon: Flame,
    color: "text-blush-600", 
  },
  {
    id: "fearful",
    name: "Fearful",
    icon: Zap,
    color: "text-sand-600", 
  },
  {
    id: "surprised",
    name: "Surprised",
    icon: Sparkles,
    color: "text-sky-500", 
  },
  {
    id: "peaceful",
    name: "Peaceful",
    icon: Leaf,
    color: "text-sage-600", 
  },
  {
    id: "physical",
    name: "Physical/Sensory",
    icon: Activity,
    color: "text-lavender-600", 
  },
]

export const DEFAULT_FEELINGS: FeelingTag[] = [
  // Happy
  { text: "Happy", category: "happy" },
  { text: "Content", category: "happy" },
  { text: "Hopeful", category: "happy" },
  { text: "Optimistic", category: "happy" },
  { text: "Cheerful", category: "happy" },
  { text: "Delighted", category: "happy" },
  { text: "Pleased", category: "happy" },
  { text: "Satisfied", category: "happy" },
  { text: "Confident", category: "happy" },
  { text: "Proud", category: "happy" },
  { text: "Accomplished", category: "happy" },
  { text: "Playful", category: "happy" },
  { text: "Energetic", category: "happy" },
  { text: "Eager", category: "happy" },
  { text: "Excited", category: "happy" },
  { text: "Joyful", category: "happy" },
  { text: "Enthusiastic", category: "happy" },
  { text: "Elated", category: "happy" },
  { text: "Ecstatic", category: "happy" },

  // Sad
  { text: "Sad", category: "sad" },
  { text: "Bored", category: "sad" },
  { text: "Disappointed", category: "sad" },
  { text: "Lonely", category: "sad" },
  { text: "Empty", category: "sad" },
  { text: "Hurt", category: "sad" },
  { text: "Rejected", category: "sad" },
  { text: "Guilty", category: "sad" },
  { text: "Ashamed", category: "sad" },
  { text: "Melancholic", category: "sad" },
  { text: "Hopeless", category: "sad" },
  { text: "Depressed", category: "sad" },
  { text: "Grieving", category: "sad" },
  { text: "Despair", category: "sad" },
  { text: "Remorseful", category: "sad" },
  { text: "Disconnected", category: "sad" },

  // Angry
  { text: "Angry", category: "angry" },
  { text: "Annoyed", category: "angry" },
  { text: "Irritated", category: "angry" },
  { text: "Frustrated", category: "angry" },
  { text: "Agitated", category: "angry" },
  { text: "Offended", category: "angry" },
  { text: "Resentful", category: "angry" },
  { text: "Mad", category: "angry" },
  { text: "Jealous", category: "angry" },
  { text: "Envious", category: "angry" },
  { text: "Disgusted", category: "angry" },
  { text: "Hostile", category: "angry" },
  { text: "Hateful", category: "angry" },
  { text: "Furious", category: "angry" },
  { text: "Livid", category: "angry" },
  { text: "Enraged", category: "angry" },
  { text: "Defensive", category: "angry"},

  // Fearful
  { text: "Fearful", category: "fearful" },
  { text: "Shy", category: "fearful" },
  { text: "Insecure", category: "fearful" },
  { text: "Uncertain", category: "fearful" },
  { text: "Nervous", category: "fearful" },
  { text: "Worried", category: "fearful" },
  { text: "Anxious", category: "fearful" },
  { text: "Stressed", category: "fearful" },
  { text: "Embarrassed", category: "fearful" },
  { text: "Vulnerable", category: "fearful" },
  { text: "Scared", category: "fearful" },
  { text: "Frightened", category: "fearful" },
  { text: "Terrified", category: "fearful" },
  { text: "Panic", category: "fearful" },
  { text: "Insignificant", category: "fearful" },
  { text: "Inferior", category: "fearful" },
  { text: "Doubtful", category: "fearful"},
  { text: "Overwhelmed", category: "fearful" },

  // Peaceful
  { text: "Peaceful", category: "peaceful" },
  { text: "Calm", category: "peaceful" },
  { text: "Relaxed", category: "peaceful" },
  { text: "Balanced", category: "peaceful" },
  { text: "Centered", category: "peaceful" },
  { text: "Thoughtful", category: "peaceful" },
  { text: "Accepted", category: "peaceful" },
  { text: "Trusting", category: "peaceful" },
  { text: "Grateful", category: "peaceful" },
  { text: "Thankful", category: "peaceful" },
  { text: "Valued", category: "peaceful" },
  { text: "Caring", category: "peaceful" },
  { text: "Compassionate", category: "peaceful" },
  { text: "Affectionate", category: "peaceful" },
  { text: "Loving", category: "peaceful" },
  { text: "Inspired", category: "peaceful" },
  { text: "Serene", category: "peaceful" },
  { text: "Tranquil", category: "peaceful" },
 
  // Surprised
  { text: "Surprised", category: "surprised" },
  { text: "Curious", category: "surprised" },
  { text: "Confused", category: "surprised" },
  { text: "Bewildered", category: "surprised" },
  { text: "Startled", category: "surprised" },
  { text: "Impressed", category: "surprised" },
  { text: "Amazed", category: "surprised" },
  { text: "Shocked", category: "surprised" },
  { text: "Awe-struck", category: "surprised" },
  { text: "Speechless", category: "surprised" },
  { text: "Intrigued", category: "surprised" },
  { text: "Fascinated", category: "surprised" },
  { text: "Stunned", category: "surprised" },

  // Physical/Sensory - for neurodivergent users who experience emotions as physical sensations
  { text: "Physical/Sensory", category: "physical" },
  { text: "Tired", category: "physical" },
  { text: "Drained", category: "physical" },
  { text: "Heavy", category: "physical" },
  { text: "Light", category: "physical" },
  { text: "Buzzing", category: "physical" },
  { text: "Tense", category: "physical" },
  { text: "Tight", category: "physical" },
  { text: "Restless", category: "physical" },
  { text: "Numb", category: "physical" },
  { text: "Foggy", category: "physical" },
  { text: "Sharp", category: "physical" },
  { text: "Warm", category: "physical" },
  { text: "Cold", category: "physical" },
  { text: "Floating", category: "physical" },
  { text: "Grounded", category: "physical" },
  { text: "Spacey", category: "physical" },
  { text: "Disconnected from body", category: "physical" },
] 