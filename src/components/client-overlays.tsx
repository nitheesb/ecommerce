"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"

export function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
    </>
  )
}
