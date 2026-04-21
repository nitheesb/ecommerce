"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import { useLenisStore } from "@/hooks/use-lenis"

interface LightboxImage {
  src: string
  alt: string
  lqip?: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  initialIndex: number
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const panRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, dragging: false })
  const pinchRef = useRef({ active: false, initialDistance: 0, initialScale: 1 })
  const scaleRef = useRef(1)
  const justPinchedRef = useRef(false)

  const current = images[index]
  const hasMultiple = images.length > 1

  // Stop Lenis on mount, restore on unmount
  useEffect(() => {
    const lenis = useLenisStore.getState().lenis
    lenis?.stop()
    document.body.style.overflow = "hidden"
    return () => {
      lenis?.start()
      document.body.style.overflow = ""
    }
  }, [])

  // GSAP open animation
  useEffect(() => {
    const backdrop = backdropRef.current
    const img = imageRef.current
    if (!backdrop || !img) return

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
    gsap.fromTo(
      img,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.05 }
    )
  }, [])

  const animateClose = useCallback(() => {
    const backdrop = backdropRef.current
    const img = imageRef.current
    if (!backdrop || !img) return

    gsap.to(img, { scale: 0.95, opacity: 0, duration: 0.25, ease: "power2.in" })
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.2,
      delay: 0.1,
      ease: "power2.in",
      onComplete: onClose,
    })
  }, [onClose])

  const goTo = useCallback(
    (dir: -1 | 1) => {
      if (!hasMultiple) return
      setZoomed(false)
      panRef.current = { x: 0, y: 0, startX: 0, startY: 0, dragging: false }

      const img = imageRef.current
      if (img) {
        gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0 })
        gsap.fromTo(img, { opacity: 0.4 }, { opacity: 1, duration: 0.3 })
      }

      setIndex((prev) => (prev + dir + images.length) % images.length)
    },
    [hasMultiple, images.length]
  )

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") animateClose()
      else if (e.key === "ArrowLeft") goTo(-1)
      else if (e.key === "ArrowRight") goTo(1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [animateClose, goTo])

  // Toggle zoom on click
  const handleImageClick = useCallback(() => {
    if (justPinchedRef.current) return
    const img = imageRef.current
    if (!img) return

    if (zoomed) {
      gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.4, ease: "power3.out" })
      panRef.current = { x: 0, y: 0, startX: 0, startY: 0, dragging: false }
      scaleRef.current = 1
      setZoomed(false)
    } else {
      gsap.to(img, { scale: 2, duration: 0.4, ease: "power3.out" })
      scaleRef.current = 2
      setZoomed(true)
    }
  }, [zoomed])

  // Pan when zoomed
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!zoomed) return
      e.preventDefault()
      const p = panRef.current
      p.dragging = true
      p.startX = e.clientX - p.x
      p.startY = e.clientY - p.y
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [zoomed]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const p = panRef.current
      if (!p.dragging || !zoomed) return
      p.x = e.clientX - p.startX
      p.y = e.clientY - p.startY

      // Constrain pan (scale-aware)
      const maxPan = 150 * scaleRef.current
      p.x = Math.max(-maxPan, Math.min(maxPan, p.x))
      p.y = Math.max(-maxPan, Math.min(maxPan, p.y))

      gsap.set(imageRef.current, { x: p.x, y: p.y })
    },
    [zoomed]
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    panRef.current.dragging = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Pinch-to-zoom (mobile)
  const getTouchDistance = (touches: React.TouchList) => {
    const t1 = touches[0]
    const t2 = touches[1]
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const p = pinchRef.current
      p.active = true
      p.initialDistance = getTouchDistance(e.touches)
      p.initialScale = scaleRef.current
    }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const p = pinchRef.current
    if (!p.active || e.touches.length < 2) return
    const dist = getTouchDistance(e.touches)
    const newScale = Math.min(3, Math.max(1, p.initialScale * (dist / p.initialDistance)))
    scaleRef.current = newScale
    gsap.set(imageRef.current, { scale: newScale })
    if (newScale > 1 && !zoomed) setZoomed(true)
  }, [zoomed])

  const onTouchEnd = useCallback(() => {
    const p = pinchRef.current
    if (!p.active) return
    p.active = false

    if (scaleRef.current <= 1.1) {
      gsap.to(imageRef.current, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" })
      scaleRef.current = 1
      panRef.current = { x: 0, y: 0, startX: 0, startY: 0, dragging: false }
      setZoomed(false)
    }

    justPinchedRef.current = true
    setTimeout(() => { justPinchedRef.current = false }, 150)
  }, [])

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-foreground/90 backdrop-blur-md"
        onClick={animateClose}
      />

      {/* Close button */}
      <button
        onClick={animateClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={() => goTo(-1)}
            className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(1)}
            className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-background/60">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Image container */}
      <div
        className="flex h-full w-full items-center justify-center p-8 md:p-16"
        onClick={(e) => {
          if (e.target === e.currentTarget) animateClose()
        }}
      >
        <div
          ref={imageRef}
          className={`relative max-h-[85vh] w-full max-w-4xl ${
            zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          }`}
          style={{ aspectRatio: "4 / 5", touchAction: "none" }}
          onClick={!panRef.current.dragging ? handleImageClick : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            className="object-contain select-none pointer-events-none"
            draggable={false}
            priority
            {...(current.lqip ? { placeholder: "blur", blurDataURL: current.lqip } : {})}
          />
        </div>
      </div>
    </div>
  )
}
