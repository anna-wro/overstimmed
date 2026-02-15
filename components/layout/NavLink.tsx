"use client"

/** @fileoverview Navigation link with active state highlighting. */

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode, ReactElement } from "react"
import { cn } from "@/lib/utils"
import React from "react"
import { useTrackUnsaved } from "@/contexts/TrackUnsavedContext"

interface NavLinkProps {
  href: string
  icon: ReactNode
  label: string
}

export function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname()
  const { trackUnsaved } = useTrackUnsaved() ?? {}
  const isActive = pathname === href
  const isLeavingTrackWithUnsaved =
    pathname === "/track" && trackUnsaved?.hasUnsaved && href !== "/track"

  const iconWithClass = icon && typeof icon === "object" && "type" in icon
    ? React.cloneElement(
        icon as React.ReactElement<any, any>,
        {
          className: cn(
            "h-4 w-4 mr-1",
            (icon as any).props?.className
          ),
        }
      )
    : icon

  const baseClassName = cn(
    "group",
    "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
    isActive
      ? "bg-accent/40 text-accent-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  )

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLeavingTrackWithUnsaved) {
      e.preventDefault()
      trackUnsaved?.openDialog(href)
    }
  }

  return (
    <Link
      href={href}
      className={baseClassName}
      onClick={handleClick}
      aria-label={
        isLeavingTrackWithUnsaved
          ? `${label} (unsaved changes will prompt to save or discard)`
          : undefined
      }
    >
      {iconWithClass}
      <span className="truncate">{label}</span>
    </Link>
  )
}  