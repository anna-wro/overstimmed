/** @fileoverview Navigation cards linking to track, archive, and settings pages. */
import Link from 'next/link'
import { Activity, Calendar, Sliders, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { dashboardCopy } from '@/copy/dashboard'

export const NavigationCards = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Track Card */}
      <Link href="/track" className="group md:col-span-1">
        <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-lavender-300 hover:shadow-lg hover:shadow-lavender-200/30 dark:hover:border-lavender-700 dark:hover:shadow-lavender-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
          <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-lavender-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-lavender-900/30 high-contrast:bg-accent">
              <Activity className="h-12 w-12 text-lavender-600 dark:text-lavender-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">{dashboardCopy.navigationCards.track.title}</h2>
            <p className="mb-6 text-muted-foreground">{dashboardCopy.navigationCards.track.description}</p>
            <Button
              size="lg"
              className="group relative overflow-hidden bg-lavender-500 text-white hover:bg-lavender-600 dark:bg-lavender-600 dark:hover:bg-lavender-700 high-contrast:bg-primary"
            >
              <span className="relative z-10 flex items-center">
                {dashboardCopy.navigationCards.track.buttonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 translate-y-full bg-lavender-400 transition-transform duration-300 group-hover:translate-y-0 dark:bg-lavender-500 high-contrast:bg-primary high-contrast:opacity-80"></span>
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* Archive Card */}
      <Link href="/archive" className="group md:col-span-1">
        <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/30 dark:hover:border-sky-700 dark:hover:shadow-sky-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
          <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-sky-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-sky-900/30 high-contrast:bg-accent">
              <Calendar className="h-12 w-12 text-sky-600 dark:text-sky-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">{dashboardCopy.navigationCards.archive.title}</h2>
            <p className="mb-6 text-muted-foreground">{dashboardCopy.navigationCards.archive.description}</p>
            <Button
              size="lg"
              variant="outline"
              className="group relative overflow-hidden border-sky-500 text-sky-700 hover:text-white dark:border-sky-600 dark:text-sky-400 high-contrast:border-black dark:high-contrast:border-white high-contrast:text-foreground high-contrast:hover:border-primary"
            >
              <span className="relative z-10 flex items-center">
                {dashboardCopy.navigationCards.archive.buttonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 translate-y-full bg-sky-500 transition-transform duration-300 group-hover:translate-y-0 dark:bg-sky-600 high-contrast:bg-primary"></span>
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* Settings Card */}
      <Link href="/settings" className="group md:col-span-1">
        <Card className="h-full overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-sand-300 hover:shadow-lg hover:shadow-sand-200/30 dark:hover:border-sand-700 dark:hover:shadow-sand-800/20 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary bg-white dark:bg-lavender-900">
          <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-sand-100 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-sand-900/30 high-contrast:bg-accent">
              <Sliders className="h-12 w-12 text-sand-600 dark:text-sand-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">{dashboardCopy.navigationCards.settings.title}</h2>
            <p className="mb-6 text-muted-foreground">{dashboardCopy.navigationCards.settings.description}</p>
            <Button
              size="lg"
              variant="outline"
              className="group relative overflow-hidden border-sand-500 text-sand-700 hover:text-white dark:border-sand-600 dark:text-sand-400 high-contrast:border-black dark:high-contrast:border-white high-contrast:text-foreground high-contrast:hover:border-primary"
            >
              <span className="relative z-10 flex items-center">
                {dashboardCopy.navigationCards.settings.buttonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 translate-y-full bg-sand-500 transition-transform duration-300 group-hover:translate-y-0 dark:bg-sand-600 high-contrast:bg-primary"></span>
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
} 