import React from "react"
import { Button } from "@/components/ui/Button"
import { Slider } from "@/components/ui/Slider"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackingPageCopy } from "@/copy/track"

interface LevelSliderProps {
  value: number
  setValue: (val: number) => void
  min: number
  max: number
  icon: React.ReactNode
  label: string
  type: "energy" | "stimulation"
}

const getEnergyColor = (level: number) => {
  if (level <= 3)
    return "text-blush-600 dark:text-blush-300 high-contrast:text-blush-800 dark:high-contrast:text-blush-200"
  if (level <= 7)
    return "text-sand-600 dark:text-sand-300 high-contrast:text-sand-800 dark:high-contrast:text-sand-200"
  return "text-mint-600 dark:text-mint-300 high-contrast:text-mint-800 dark:high-contrast:text-mint-200"
}
const getStimulationColor = (level: number) => {
  if (level <= 3)
    return "text-sand-700 dark:text-sand-300 high-contrast:text-sand-900 dark:high-contrast:text-sand-200"
  if (level <= 7)
    return "text-lavender-700 dark:text-lavender-300 high-contrast:text-lavender-900 dark:high-contrast:text-lavender-200"
  return "text-blush-700 dark:text-blush-300 high-contrast:text-blush-900 dark:high-contrast:text-blush-200"
}

export const LevelSlider: React.FC<LevelSliderProps> = ({
  value,
  setValue,
  min,
  max,
  icon,
  label,
  type,
}) => {
  const colorClass = type === "energy" ? getEnergyColor(value) : getStimulationColor(value)
  const description = type === "energy"
    ? trackingPageCopy.energy.descriptions[value] || trackingPageCopy.energy.descriptions[5]
    : trackingPageCopy.stimulation.descriptions[value] || trackingPageCopy.stimulation.descriptions[5]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium">
          {icon} {label}
        </h3>
        <div
          className={cn(
            "text-2xl font-bold tabular-nums high-contrast:font-extrabold",
            colorClass,
          )}
        >
          {value}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => setValue(Math.max(min, value - 1))}
        >
          <Minus className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={1}
          onValueChange={(val) => setValue(val[0])}
          className="flex-1"
          data-type={type}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => setValue(Math.min(max, value + 1))}
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">{description}</p>
    </div>
  )
} 