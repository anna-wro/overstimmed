"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/layout/SiteHeader"

export function ConditionalHeader() {
  const pathname = usePathname()
  if (typeof pathname !== "string") return null
  if (pathname === "/" || pathname.startsWith("/auth/")) return null
  return <SiteHeader />
}
