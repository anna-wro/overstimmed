"use client";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SiteHeader />;
} 