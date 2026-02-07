"use client"

import { AuthMenu } from "@/components/layout/AuthMenu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

/** Fixed top-right corner: AuthMenu + ThemeToggle. Use on dashboard, archive, and in SiteHeader. */
export function HeaderCorner() {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      <AuthMenu />
      <ThemeToggle />
    </div>
  )
}
