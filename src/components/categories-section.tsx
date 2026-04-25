"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight } from "lucide-react"

import { categories } from "@/lib/products"

gsap.registerPlugin(ScrollTrigger)

const categoryImages: Record<(typeof categories)[number]["title"], string> = {
  Sarees: "/images/saree-1-a.jpg",
  "Shop by Prints": "/images/saree-6-b.jpg",
  "Shop by Occasion": "/images/saree-4-a.jpg",
  "Shop by Colors": "/images/saree-3-a.jpg",
}

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const topTrackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const motionStateRef = useRef({
    x: 0,
    targetX: 0,
    trackWidth: 0,
    frameId: 0,
    dragging: false,
    dragStartX: 0,
    dragStartOffset: 0,
    lastPointerX: 0,
    velocity: 0,
    hasDragged: false,
  })

  const topCards = useMemo(() => [...categories, ...categories], [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches)

    updateReducedMotion()
    mediaQuery.addEventListener("change", updateReducedMotion)

    return () => mediaQuery.removeEventListener("change", updateReducedMotion)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.2 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const introItems = section.querySelectorAll<HTMLElement>("[data-browse-intro]")
      const motionItems = section.querySelectorAll<HTMLElement>("[data-browse-motion]")

      if (reducedMotion) {
        gsap.set([...introItems, ...motionItems], { clearProps: "all" })
        return
      }

      gsap.set([...introItems, ...motionItems], { opacity: 0, y: 28 })

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(introItems, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          })

          gsap.to(motionItems, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
            delay: 0.12,
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const viewport = viewportRef.current
    const topTrack = topTrackRef.current
    const state = motionStateRef.current
    if (!topTrack || !viewport) return

    const measure = () => {
      state.trackWidth = topTrack.scrollWidth / 2
    }

    const loop = () => {
      if (isVisible) {
        if (!state.dragging) {
          state.targetX -= 0.45

          if (Math.abs(state.velocity) > 0.1) {
            state.targetX += state.velocity
            state.velocity *= 0.94
          } else {
            state.velocity = 0
          }
        }

        state.x += (state.targetX - state.x) * (state.dragging ? 0.22 : 0.1)

        if (state.trackWidth > 0 && state.x <= -state.trackWidth) {
          state.x += state.trackWidth
          state.targetX += state.trackWidth
        } else if (state.trackWidth > 0 && state.x > 0) {
          state.x -= state.trackWidth
          state.targetX -= state.trackWidth
        }

        topTrack.style.transform = `translate3d(${state.x}px, 0, 0)`
      }

      state.frameId = window.requestAnimationFrame(loop)
    }

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      state.dragging = true
      state.dragStartX = event.clientX
      state.dragStartOffset = state.targetX
      state.lastPointerX = event.clientX
      state.velocity = 0
      state.hasDragged = false
      setIsDragging(true)
      viewport.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging) return

      event.preventDefault()
      const deltaX = event.clientX - state.dragStartX
      if (Math.abs(deltaX) > 4) {
        state.hasDragged = true
      }
      state.targetX = state.dragStartOffset + deltaX
      state.velocity = event.clientX - state.lastPointerX
      state.lastPointerX = event.clientX
    }

    const endDrag = (pointerId?: number) => {
      if (!state.dragging) return

      state.dragging = false
      setIsDragging(false)

      if (pointerId !== undefined && viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId)
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      endDrag(event.pointerId)
    }

    const onPointerCancel = (event: PointerEvent) => {
      endDrag(event.pointerId)
    }

    const onLostPointerCapture = () => {
      endDrag()
    }

    measure()
    loop()

    viewport.addEventListener("pointerdown", onPointerDown)
    viewport.addEventListener("pointermove", onPointerMove)
    viewport.addEventListener("pointerup", onPointerUp)
    viewport.addEventListener("pointercancel", onPointerCancel)
    viewport.addEventListener("lostpointercapture", onLostPointerCapture)
    window.addEventListener("resize", measure)

    return () => {
      window.cancelAnimationFrame(state.frameId)
      viewport.removeEventListener("pointerdown", onPointerDown)
      viewport.removeEventListener("pointermove", onPointerMove)
      viewport.removeEventListener("pointerup", onPointerUp)
      viewport.removeEventListener("pointercancel", onPointerCancel)
      viewport.removeEventListener("lostpointercapture", onLostPointerCapture)
      window.removeEventListener("resize", measure)
    }
  }, [isVisible, reducedMotion])

  useEffect(() => {
    if (reducedMotion || isDragging || !isVisible) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length)
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [isDragging, isVisible, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-b border-border/40 bg-[linear-gradient(180deg,#fbf8f1_0%,#f6f1e6_55%,#fbf8f1_100%)] py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl" data-browse-intro>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Products
          </p>
          <h2 className="mt-3 font-serif text-2xl leading-[1.1] tracking-tight md:text-3xl lg:text-4xl">
            Shop by collection.
          </h2>
        </div>
      </div>

      <div className="mt-7 md:mt-10">
        <div
          ref={viewportRef}
          className={`cursor-grab overflow-hidden touch-pan-y select-none [webkit-user-select:none] ${isDragging ? "cursor-grabbing" : ""}`}
          data-browse-motion
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (motionStateRef.current.hasDragged) {
              event.preventDefault()
              event.stopPropagation()
            }
          }}
        >
          <div
            ref={topTrackRef}
            className="flex w-max gap-5 px-6 will-change-transform lg:px-12"
          >
            {topCards.map((category, index) => {
              const categoryIndex = index % categories.length
              const isActive = categoryIndex === activeIndex

              return (
                <article
                  key={`${category.title}-${index}`}
                  className={`group relative w-[17.5rem] shrink-0 overflow-hidden rounded-[28px] border transition-all duration-500 md:w-[21rem] ${
                    isActive
                      ? "border-foreground/20 shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
                      : "border-border/50 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
                  }`}
                  onMouseEnter={() => {
                    setActiveIndex(categoryIndex)
                  }}
                  onFocusCapture={() => setActiveIndex(categoryIndex)}
                >
                  <div className="relative min-h-[15rem] overflow-hidden">
                    <Image
                      src={categoryImages[category.title]}
                      alt={category.title}
                      fill
                      draggable={false}
                      sizes="(max-width: 768px) 280px, 336px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-background select-none [webkit-user-select:none]">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-background/72">
                        Major Category
                      </p>
                      <h3 className="mt-3 font-serif text-3xl tracking-tight">{category.title}</h3>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-background/82">{category.blurb}</p>
                      <Link
                        href={category.href}
                        className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-background/90 transition-colors hover:text-background"
                      >
                        Explore
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
