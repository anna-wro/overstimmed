"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/layout/SiteHeader"

export function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname === "/" || pathname.startsWith("/auth/")) return null
  return <SiteHeader />
} 