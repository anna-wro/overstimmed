"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { 'data-type'?: 'energy' | 'stimulation' }
>(({ className, 'data-type': dataType, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
    data-type={dataType}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary dark:bg-secondary/70">
      <div
        className={cn(
          "absolute inset-0 h-full w-full",
          dataType === "energy"
            ? "bg-gradient-to-r from-blush-400 via-sand-300 to-mint-400 dark:from-blush-500 dark:via-sand-500 dark:to-mint-500 high-contrast:from-blush-700 high-contrast:via-sand-700 high-contrast:to-mint-700 dark:high-contrast:from-blush-600 dark:high-contrast:via-sand-600 dark:high-contrast:to-mint-600"
            : dataType === "stimulation"
              ? "bg-gradient-to-r from-sand-300 via-lavender-300 to-blush-400 dark:from-sand-500 dark:via-lavender-500 dark:to-blush-400 high-contrast:from-sand-700 high-contrast:via-lavender-700 high-contrast:to-blush-700 dark:high-contrast:from-sand-600 dark:high-contrast:via-lavender-600 dark:high-contrast:to-blush-600"
              : "bg-primary",
        )}
      />
      <div
        className="absolute inset-0 bg-secondary dark:bg-secondary/70"
        style={{
          left: `${(props.value?.[0] || 0) * 10}%`,
          right: "0",
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
