import { ReactNode } from 'react'

type LevelCardProps = {
  label: string
  level: number
  text: string
  description: string
  icon: ReactNode
  backgroundColorClass: string
  numberColorClass: string
  textColorClass: string
  progressColorClass: string
  progressBackgroundClass: string
}

export const LevelCard = ({
  label,
  level,
  text,
  description,
  icon,
  backgroundColorClass,
  numberColorClass,
  textColorClass,
  progressColorClass,
  progressBackgroundClass,
}: LevelCardProps) => {
  return (
    <div className="rounded-xl border bg-white/70 p-4 shadow-xs backdrop-blur-xs dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${backgroundColorClass} high-contrast:bg-accent`}>
            {icon}
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <div className={`font-semibold ${textColorClass} high-contrast:text-foreground`}>
              {text}
            </div>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${numberColorClass} high-contrast:bg-primary high-contrast:text-primary-foreground high-contrast:font-extrabold`}>
          {level}
        </div>
      </div>

      <div className={`mt-4 h-3 overflow-hidden rounded-full ${progressBackgroundClass} p-0.5 high-contrast:bg-muted`}>
        <div
          className={`h-full rounded-full ${progressColorClass} transition-all duration-500 high-contrast:bg-primary`}
          style={{ width: `${level * 10}%` }}
        ></div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
} 