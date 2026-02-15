"use client"

/** @fileoverview Hook for fetching and managing the current user's display name profile. */

import { useProfileContext } from "@/contexts/ProfileContext"

export function useProfile() {
  return useProfileContext()
}
