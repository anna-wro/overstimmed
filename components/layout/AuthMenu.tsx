"use client"

/** @fileoverview User authentication dropdown menu with sign out. */

import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"
import { useUser, useProfile } from "@/hooks/features"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

/**
 * User menu: email and sign out. Shown in header when authenticated.
 */
export function AuthMenu() {
  const router = useRouter()
  const { user, loading, signOut } = useUser()
  const { profile, loading: profileLoading } = useProfile()

  if (loading || !user) return null

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const displayLabel = profileLoading
    ? ""
    : (profile?.name?.trim() || undefined) ?? user.email ?? "Account"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {!profileLoading && <User className="h-4 w-4" />}
          <span className="max-w-[120px] truncate sm:max-w-[180px]">{displayLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-xs text-muted-foreground truncate">{displayLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
