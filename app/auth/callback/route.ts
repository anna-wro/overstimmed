/** @fileoverview OAuth callback route handler that exchanges auth code for session. */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

function safeRedirectPath(next: string | null): string {
  if (next == null || typeof next !== "string") return "/"
  const path = String(next).trim()
  if (path === "" || !path.startsWith("/") || path.includes("//")) return "/"
  return path
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = safeRedirectPath(requestUrl.searchParams.get("next"))

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
