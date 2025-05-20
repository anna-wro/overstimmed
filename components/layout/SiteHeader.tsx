"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LayoutDashboard, Activity, LineChart, CalendarDays, Sliders } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
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
    e.preventDefault();
    if (onBackButtonClick) {
      onBackButtonClick(e)
    } else {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  }

  return (
    <header className="container max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col items-center justify-center">
        <Link href="/">
          <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer drop-shadow-lg">
            Overstimmed
          </h1>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary bg-muted px-3 py-1.5 rounded-full shadow-sm border border-transparent hover:border-primary/30 hover:bg-primary/10"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        )}

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 bg-muted/60 rounded-full px-4 py-2 shadow-inner">
          {!showBackButton && (
            <Link
              href="/"
              className={`flex items-center text-sm font-medium transition-colors px-3 py-1 rounded-full ${
                pathname === "/" ? "bg-primary/10 text-primary shadow" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Dashboard</span>
            </Link>
          )}
          <Link
            href="/track"
            className={`flex items-center text-sm font-medium transition-colors px-3 py-1 rounded-full ${
              pathname === "/track" ? "bg-primary/10 text-primary shadow" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Activity className="h-4 w-4 mr-1" />
            <span>Track</span>
          </Link>
          <Link
            href="/insights"
            className={`flex items-center text-sm font-medium transition-colors px-3 py-1 rounded-full ${
              pathname === "/insights" ? "bg-primary/10 text-primary shadow" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <LineChart className="h-4 w-4 mr-1" />
            <span>Insights</span>
          </Link>
          <Link
            href="/archive"
            className={`flex items-center text-sm font-medium transition-colors px-3 py-1 rounded-full ${
              pathname === "/archive" ? "bg-primary/10 text-primary shadow" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Archive</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center text-sm font-medium transition-colors px-3 py-1 rounded-full ${
              pathname === "/settings" ? "bg-primary/10 text-primary shadow" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Sliders className="h-4 w-4 mr-1" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sm:ml-auto flex justify-center sm:justify-end w-full sm:w-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 
