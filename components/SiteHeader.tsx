"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LayoutDashboard, Activity, LineChart, CalendarDays, Sliders } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { usePathname } from "next/navigation"

interface SiteHeaderProps {
  showBackButton?: boolean
  backButtonHref?: string
  onBackButtonClick?: (e: React.MouseEvent) => void
}

export function SiteHeader({ showBackButton = true, backButtonHref = "/", onBackButtonClick }: SiteHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleBackClick = (e: React.MouseEvent) => {
    if (onBackButtonClick) {
      onBackButtonClick(e)
    } else {
      router.push(backButtonHref)
    }
  }

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <Link href="/">
          <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
            Overstimmed
          </h1>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        {showBackButton && (
          <a
            href={backButtonHref}
            onClick={handleBackClick}
            className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </a>
        )}

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/track"
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/track" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Activity className="h-4 w-4 mr-1" />
            <span>Track</span>
          </Link>
          <Link
            href="/insights"
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/insights" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <LineChart className="h-4 w-4 mr-1" />
            <span>Insights</span>
          </Link>
          <Link
            href="/archive"
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/archive" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Archive</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/settings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Sliders className="h-4 w-4 mr-1" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
