"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Moon, Sun, Contrast, Monitor, Settings, Zap } from "lucide-react"
import { useLocalStorage } from "@/hooks/shared/useLocalStorage"
import { useAppSettings } from "@/hooks/features/settings/useAppSettings"

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>("system")
  const [highContrast, setHighContrast] = useLocalStorage<boolean>("highContrast", false)
  const [fontSize, setFontSize] = useState<number>(16)
  const [lowSpoonMode, setLowSpoonMode] = useState<boolean>(false)
  const [hasVisitedBefore, setHasVisitedBefore] = useLocalStorage<boolean>("hasVisitedBefore", false)
  const [settings, setSettings] = useAppSettings()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (!hasVisitedBefore) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasVisitedBefore])

  // Apply theme changes immediately when selection changes
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value)
    setTheme(value)
  }

  // Apply high contrast changes immediately
  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked)
    if (checked) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  // Apply font size changes immediately
  const handleFontSizeChange = (size: number) => {
    setFontSize(size)
    document.documentElement.style.fontSize = `${size / 16}rem`
  }

  const savePreferences = () => {
    setTheme(selectedTheme)
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    document.documentElement.style.fontSize = `${fontSize / 16}rem`
    setSettings({
      ...settings,
      theme: selectedTheme,
      highContrastMode: highContrast,
      fontSize: fontSize,
      lowSpoonMode: lowSpoonMode,
    })
    setHasVisitedBefore(true)
    setIsOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setHasVisitedBefore(true)
          setIsOpen(false)
        }
      }}
    >
      <DialogContent className={`sm:max-w-[550px] max-h-[90vh] overflow-y-auto my-4 transition-all duration-300 ${
        selectedTheme === "dark" 
          ? "bg-zinc-900 text-white border-zinc-700" 
          : selectedTheme === "light"
          ? "bg-white text-black border-gray-200"
          : "" // system theme uses default
      }`}>
        <div className={`${selectedTheme === "dark" ? "dark" : ""} transition-all duration-300`}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Welcome to Overstimmed</DialogTitle>
            <DialogDescription className="text-center pt-2">Because some days are just a lot.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-8">
            <div className="space-y-2 text-center">
              <p className="text-sm">
                Track your overstimulation, energy, and emotional patterns - and finally understand what's really draining
                or recharging you.
              </p>
              <blockquote className="border-l-2 pl-4 italic my-4 text-muted-foreground">
                "You're not lazy. You're not broken. You're just <strong>overstimmed</strong>."
              </blockquote>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose your preferred theme</h3>
              <RadioGroup value={selectedTheme} onValueChange={handleThemeChange} className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="light"
                    className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 ${
                      selectedTheme === "light"
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50"
                    } bg-white p-4 hover:bg-accent hover:text-accent-foreground relative text-black`}
                  >
                    <Sun className="mb-2 h-6 w-6 text-black" />
                    <span className="text-black">Light</span>
                    {selectedTheme === "light" && (
                      <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </Label>
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="dark"
                    className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 ${
                      selectedTheme === "dark"
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50"
                    } bg-zinc-950 p-4 text-white hover:bg-zinc-900 hover:text-zinc-50 relative`}
                  >
                    <Moon className="mb-2 h-6 w-6 text-white" />
                    <span className="text-white">Dark</span>
                    {selectedTheme === "dark" && (
                      <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </Label>
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="system"
                    className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 ${
                      selectedTheme === "system"
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50"
                    } bg-gradient-to-br from-white to-zinc-900 p-4 text-black hover:bg-gradient-to-br hover:from-white hover:to-zinc-800 relative`}
                  >
                    <Monitor className="mb-2 h-6 w-6 text-black" />
                    <span className="text-black">System</span>
                    {selectedTheme === "system" && (
                      <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </Label>
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Accessibility options</h3>
              <div
                className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-colors ${
                  highContrast
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleHighContrastChange(!highContrast)}
              >
                <div className="flex items-center gap-3">
                  <Contrast className="h-5 w-5" />
                  <div>
                    <p className="font-medium">High contrast mode</p>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                </div>
                <div
                  className={`h-6 w-12 rounded-full p-1 transition-colors ${highContrast ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      highContrast ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              <div
                className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-colors ${
                  lowSpoonMode
                    ? "border-mint-500 bg-mint-50 ring-2 ring-mint-200 dark:bg-mint-950/30 dark:border-mint-600 dark:ring-mint-800"
                    : "border-muted hover:border-mint-400"
                }`}
                onClick={() => setLowSpoonMode(!lowSpoonMode)}
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-mint-600 dark:text-mint-400" />
                  <div>
                    <p className="font-medium">Low-Spoon Mode</p>
                    <p className="text-sm text-muted-foreground">Simplified tracking with just energy, stimulation, and overall experience</p>
                  </div>
                </div>
                <div
                  className={`h-6 w-12 rounded-full p-1 transition-colors ${lowSpoonMode ? "bg-mint-500" : "bg-muted"}`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      lowSpoonMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Font Size</h3>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    fontSize === 14
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => handleFontSizeChange(14)}
                >
                  <span className="text-sm">Small</span>
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    fontSize === 16
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => handleFontSizeChange(16)}
                >
                  <span className="text-base">Medium</span>
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    fontSize === 18
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => handleFontSizeChange(18)}
                >
                  <span className="text-lg">Large</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <blockquote className="border-l-2 pl-4 italic my-4 text-muted-foreground">
                "No streaks. No scores. Just gentle awareness, one moment at a time."
              </blockquote>
              <p className="text-sm flex items-center justify-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                You can change these preferences anytime in Settings
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={savePreferences} className="w-full">
              Get started
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
