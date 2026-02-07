"use client"

import { useProfileContext } from "@/contexts/ProfileContext"

export function useProfile() {
  return useProfileContext()
}
