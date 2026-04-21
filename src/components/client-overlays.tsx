"use client"

import { LenisProvider } from "@/components/lenis-provider"
import { ScrollProgress } from "@/components/scroll-progress"

export function ClientOverlays() {
  return (
    <>
      <LenisProvider />
      <ScrollProgress />
    </>
  )
}
