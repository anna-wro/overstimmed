"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode, ReactElement } from "react"
import { cn } from "@/lib/utils"
import React from "react"

interface NavLinkProps {
  href: string
  icon: ReactNode
  label: string
}

export function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const iconWithClass = icon && typeof icon === "object" && "type" in icon
    ? React.cloneElement(
        icon as React.ReactElement<any, any>,
        {
          className: cn(
            "h-4 w-4 mr-1",
            (icon as any).props?.className // preserve any custom classes
          ),
        }
      )
    : icon
 
  return (
    <Link
      href={href}
      className={cn(
        "group",
        "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
        isActive
          ? "bg-accent/40 text-accent-foreground shadow"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {iconWithClass}
      <span className="truncate">{label}</span>
    </Link>
  )
}  