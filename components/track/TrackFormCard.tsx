import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"

interface TrackFormCardProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const TrackFormCard: React.FC<TrackFormCardProps> = ({ title, children, footer }) => (
  <Card className="relative overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
    <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
    <CardHeader className="bg-sand-100/50 pb-4 pt-6 dark:bg-sand-900/50 high-contrast:bg-accent">
      <CardTitle className="text-center text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-8 p-6 pt-8">{children}</CardContent>
    {footer && <CardFooter className="flex justify-end bg-sand-100/50 px-6 py-4 dark:bg-sand-900/50 high-contrast:bg-accent">{footer}</CardFooter>}
  </Card>
) 