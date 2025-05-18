import { Ear, Eye, Hand, Coffee, Globe, Thermometer, Users, Heart, Star } from "lucide-react"

export type TriggerCategory = {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

export type TriggerTag = {
  text: string
  category: string
}

export const TRIGGER_CATEGORIES: TriggerCategory[] = [
  { id: "auditory", name: "Auditory", icon: Ear, color: "text-sky-500" },
  { id: "visual", name: "Visual", icon: Eye, color: "text-mint-500" },
  { id: "tactile", name: "Tactile", icon: Hand, color: "text-lavender-500" },
  { id: "olfactory", name: "Smell/Taste", icon: Coffee, color: "text-sand-500" },
  { id: "environmental", name: "Environmental", icon: Globe, color: "text-blush-500" },
  { id: "temperature", name: "Temperature", icon: Thermometer, color: "text-mint-500" },
  { id: "social", name: "Social", icon: Users, color: "text-sky-500" },
  { id: "internal", name: "Internal", icon: Heart, color: "text-blush-500" },
  { id: "custom", name: "Custom", icon: Star, color: "text-lavender-500" },
]

export const DEFAULT_TRIGGERS: TriggerTag[] = [
  // Auditory
  { text: "Loud noises", category: "auditory" },
  { text: "Background chatter", category: "auditory" },
  { text: "Sudden sounds", category: "auditory" },
  { text: "Music", category: "auditory" },
  { text: "Repetitive sounds", category: "auditory" },
  { text: "Echoing", category: "auditory" },
  { text: "High-pitched noises", category: "auditory" },
  { text: "Appliance sounds", category: "auditory" },
  { text: "Traffic noise", category: "auditory" },
  // Visual
  { text: "Bright lights", category: "visual" },
  { text: "Fluorescent lighting", category: "visual" },
  { text: "Flashing lights", category: "visual" },
  { text: "Busy patterns", category: "visual" },
  { text: "Screen time", category: "visual" },
  { text: "Visual clutter", category: "visual" },
  { text: "Moving objects", category: "visual" },
  { text: "Bright colors", category: "visual" },
  // Tactile
  { text: "Clothing tags", category: "tactile" },
  { text: "Tight clothing", category: "tactile" },
  { text: "Certain fabrics", category: "tactile" },
  { text: "Light touch", category: "tactile" },
  { text: "Wet hands", category: "tactile" },
  { text: "Physical contact", category: "tactile" },
  { text: "Rough textures", category: "tactile" },
  { text: "Sticky surfaces", category: "tactile" },
  // Olfactory
  { text: "Strong smells", category: "olfactory" },
  { text: "Perfumes", category: "olfactory" },
  { text: "Food odors", category: "olfactory" },
  { text: "Cleaning products", category: "olfactory" },
  { text: "Scented candles", category: "olfactory" },
  // Temperature
  { text: "Temperature changes", category: "temperature" },
  { text: "Too hot", category: "temperature" },
  { text: "Too cold", category: "temperature" },
  { text: "Humidity", category: "temperature" },
  // Environmental
  { text: "Crowded spaces", category: "environmental" },
  { text: "New environments", category: "environmental" },
  { text: "Weather changes", category: "environmental" },
  { text: "Confined spaces", category: "environmental" },
  { text: "Open spaces", category: "environmental" },
  // Social
  { text: "Social interaction", category: "social" },
  { text: "Eye contact", category: "social" },
  { text: "Group conversations", category: "social" },
  { text: "Unexpected changes", category: "social" },
  { text: "Time pressure", category: "social" },
  { text: "Being interrupted", category: "social" },
  // Internal
  { text: "Hunger", category: "internal" },
  { text: "Thirst", category: "internal" },
  { text: "Fatigue", category: "internal" },
  { text: "Pain", category: "internal" },
  { text: "Medication effects", category: "internal" },
  { text: "Anxiety", category: "internal" },
] 