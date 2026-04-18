"use client"

import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"

export function ClientOverlays() {
  return (
    <>
      <LenisProvider />
      <CustomCursor />
      <ScrollProgress />
    </>
  )
}
