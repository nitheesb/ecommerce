"use client"

import { LenisProvider } from "@/components/lenis-provider"
import { ScrollProgress } from "@/components/scroll-progress"
import { CustomCursor } from "@/components/custom-cursor"

export function ClientOverlays() {
  return (
    <>
      <LenisProvider />
      <ScrollProgress />
      <CustomCursor />
    </>
  )
}
