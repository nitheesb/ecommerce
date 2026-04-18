"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenisStore } from "@/hooks/use-lenis"

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider() {
  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Bridge Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // Use GSAP's ticker instead of a separate rAF loop
    gsap.ticker.lagSmoothing(0)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)

    // Expose instance for modals
    useLenisStore.getState().setLenis(lenis)

    return () => {
      gsap.ticker.remove(tickerCallback)
      useLenisStore.getState().setLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}
