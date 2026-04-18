"use client"

import { useRef, useEffect, useCallback, type ReactNode } from "react"
import gsap from "gsap"

interface MagneticButtonProps {
  children: ReactNode
  strength?: number
}

export function MagneticButton({ children, strength = 0.3 }: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const enabled = useRef(true)

  useEffect(() => {
    // Desktop fine pointer only + respect reduced motion
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      enabled.current = false
    }
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled.current || !wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength

      gsap.to(wrapRef.current, {
        x: dx,
        y: dy,
        duration: 0.4,
        ease: "power3.out",
      })
    },
    [strength]
  )

  const onMouseLeave = useCallback(() => {
    if (!enabled.current || !wrapRef.current) return
    gsap.to(wrapRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    })
  }, [])

  return (
    <div
      ref={wrapRef}
      className="inline-block"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
