"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { useLenisStore } from "@/hooks/use-lenis"

export function PageTransition({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip animation on initial page load so hero intro plays undisturbed
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const el = contentRef.current
    if (!el) return

    // Scroll to top on navigation
    const lenis = useLenisStore.getState().lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }

    // Enter animation
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" }
    )
  }, [pathname])

  return <div ref={contentRef}>{children}</div>
}
