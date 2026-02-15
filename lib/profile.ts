/** @fileoverview Supabase profile CRUD operations: fetch and update display name. */

export type Profile = {
  id: string
  name: string | null
  theme: string
  high_contrast_mode: boolean
  font_size: number
  updated_at: string
}

export type ProfileUpdate = {
  name?: string | null
  theme?: string
  high_contrast_mode?: boolean
  font_size?: number
}
