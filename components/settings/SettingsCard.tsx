/** @fileoverview Reusable card wrapper for settings sections. */
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

interface SettingsCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  iconBgColor?: string
}

export function SettingsCard({ 
  title, 
  description, 
  icon, 
  children, 
  iconBgColor = "bg-lavender-100 dark:bg-lavender-900/30 high-contrast:bg-primary/20" 
}: SettingsCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
      <CardHeader className="flex flex-row items-center gap-4 bg-sand-100/50 dark:bg-sand-900/20 high-contrast:bg-accent">
        <div className={`rounded-full p-2 ${iconBgColor}`}>
          {icon}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {children}
      </CardContent>
    </Card>
  )
} 