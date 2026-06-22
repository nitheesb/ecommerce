"use client"

import { LenisProvider } from "@/components/lenis-provider"
import { ScrollProgress } from "@/components/scroll-progress"
import { RecentlyViewedDrawer } from "@/components/recently-viewed-drawer"
import { CartDrawer } from "@/components/cart-drawer"

export function ClientOverlays() {
  return (
    <>
      <LenisProvider />
      <ScrollProgress />
      <RecentlyViewedDrawer />
      <CartDrawer />
    </>
  )
}
