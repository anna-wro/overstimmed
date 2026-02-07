"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LayoutDashboard, Activity, LineChart, CalendarDays, Sliders } from "lucide-react"
import { HeaderCorner } from "@/components/layout/HeaderCorner"
import { usePathname } from "next/navigation"
import { NavLink } from "@/components/layout/NavLink"

interface SiteHeaderProps {
  showBackButton?: boolean
  backButtonHref?: string
}

export function SiteHeader({ showBackButton, backButtonHref = "/",  }: SiteHeaderProps) {

  return (
    <header className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-center justify-center">
        <Link href="/">
          <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer drop-shadow-lg">
            Overstimmed 
          </h1>
        </Link> 
      </div>  

      <div className="flex justify-center items-center gap-4">
        {showBackButton && (
          <NavLink
            href={backButtonHref}
            icon={<ChevronLeft className="transition-transform group-hover:-translate-x-1" />}
            label="Go back"
          />
        )}

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6   px-4 py-2 ">
          <NavLink
            href="/"
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <NavLink
            href="/track"
            icon={<Activity />}
            label="Track"
          />
          <NavLink
            href="/insights"
            icon={<LineChart />}
            label="Insights"
          />
          <NavLink
            href="/archive"
            icon={<CalendarDays />}
            label="Archive"
          />
          <NavLink
            href="/settings"
            icon={<Sliders />}
            label="Settings"
          />
        </nav>

        <HeaderCorner />
      </div>
    </header>
  )
} 
