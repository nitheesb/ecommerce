"use client"

import { useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const shopCategories = [
  { name: "Silk", image: "/images/saree-1-a.jpg", href: "/collections/silk" },
  { name: "Cotton", image: "/images/saree-2-a.jpg", href: "/collections/cotton" },
  { name: "Linen", image: "/images/saree-5-a.jpg", href: "/collections/linen" },
  { name: "Soft Silks", image: "/images/saree-3-a.jpg", href: "/collections/soft-silks" },
  { name: "Tussar", image: "/images/saree-5-b.jpg", href: "/collections/tussar" },
  { name: "Organza", image: "/images/saree-7-a.jpg", href: "/collections/organza" },
  { name: "Crepe", image: "/images/saree-4-a.jpg", href: "/collections/crepe" },
  { name: "Chiffon", image: "/images/saree-3-b.jpg", href: "/collections/chiffon" },
  { name: "Georgette", image: "/images/saree-8-a.jpg", href: "/collections/georgette" },
  { name: "Silk Cotton", image: "/images/saree-6-a.jpg", href: "/collections/silk-cotton" },
  { name: "Kalamkari", image: "/images/saree-1-b.jpg", href: "/collections/kalamkari" },
  { name: "Ajrakh Print", image: "/images/saree-6-b.jpg", href: "/collections/ajrakh-print" },
  { name: "Bandhani", image: "/images/saree-2-b.jpg", href: "/collections/bandhani" },
  { name: "Heritage", image: "/images/saree-7-b.jpg", href: "/collections/heritage" },
  { name: "Dailywear", image: "/images/saree-8-b.jpg", href: "/collections/dailywear" },
  { name: "Festive", image: "/images/saree-4-b.jpg", href: "/collections/festive" },
  { name: "Modal", image: "/images/saree-2-a.jpg", href: "/collections/modal" },
]

// Duplicate for seamless infinite loop
const loopedCategories = [...shopCategories, ...shopCategories]

const AUTO_SPEED = 0.4 // px per frame
const DRAG_EASE = 0.92 // momentum decay

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Mutable state for the animation loop (no re-renders needed)
  const state = useRef({
    x: 0,
    targetX: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartScrollX: 0,
    velocity: 0,
    lastPointerX: 0,
    hasDragged: false,
    dragDirection: null as "horizontal" | "vertical" | null,
    singleSetWidth: 0,
    animId: 0,
  })

  const loop = useCallback(() => {
    const s = state.current
    const track = trackRef.current
    if (!track) return

    if (!s.dragging) {
      // Auto-scroll when not dragging
      s.targetX -= AUTO_SPEED

      // Apply momentum from drag release
      if (Math.abs(s.velocity) > 0.5) {
        s.targetX += s.velocity
        s.velocity *= DRAG_EASE
      } else {
        s.velocity = 0
      }
    }

    // Smooth lerp toward target
    s.x += (s.targetX - s.x) * 0.1

    // Seamless wrap: when we've scrolled one full set, reset
    if (s.singleSetWidth > 0) {
      if (s.x <= -s.singleSetWidth) {
        s.x += s.singleSetWidth
        s.targetX += s.singleSetWidth
      } else if (s.x > 0) {
        s.x -= s.singleSetWidth
        s.targetX -= s.singleSetWidth
      }
    }

    track.style.transform = `translate3d(${s.x}px, 0, 0)`
    s.animId = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Measure one set width (half of track since we doubled)
    state.current.singleSetWidth = track.scrollWidth / 2
    state.current.animId = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(state.current.animId)
  }, [loop])

  // Pointer events for universal drag (mouse, touch, trackpad)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const parent = track.parentElement!

    const onPointerDown = (e: PointerEvent) => {
      const s = state.current
      s.dragging = true
      s.hasDragged = false
      s.dragDirection = null
      s.dragStartX = e.clientX
      s.dragStartY = e.clientY
      s.dragStartScrollX = s.targetX
      s.lastPointerX = e.clientX
      s.velocity = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      const s = state.current
      if (!s.dragging) return

      const dx = e.clientX - s.dragStartX
      const dy = e.clientY - s.dragStartY

      // Determine drag direction once we have enough movement
      if (!s.dragDirection && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        s.dragDirection = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical"
      }

      // If vertical, release the drag so native scroll works
      if (s.dragDirection === "vertical") {
        s.dragging = false
        return
      }

      if (s.dragDirection === "horizontal") {
        e.preventDefault()
        s.hasDragged = true
        s.velocity = e.clientX - s.lastPointerX
        s.lastPointerX = e.clientX
        s.targetX = s.dragStartScrollX + dx
      }
    }

    const onPointerUp = () => {
      state.current.dragging = false
    }

    parent.addEventListener("pointerdown", onPointerDown)
    parent.addEventListener("pointermove", onPointerMove)
    parent.addEventListener("pointerup", onPointerUp)
    parent.addEventListener("pointercancel", onPointerUp)

    return () => {
      parent.removeEventListener("pointerdown", onPointerDown)
      parent.removeEventListener("pointermove", onPointerMove)
      parent.removeEventListener("pointerup", onPointerUp)
      parent.removeEventListener("pointercancel", onPointerUp)
    }
  }, [])

  // Block link clicks if user dragged
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (state.current.hasDragged) {
      e.preventDefault()
    }
  }, [])

  // GSAP heading reveal
  useEffect(() => {
    const heading = headingRef.current
    if (!heading) return

    gsap.set(heading.children, { opacity: 0, y: 24 })

    const trigger = ScrollTrigger.create({
      trigger: heading,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(heading.children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} className="pt-20 pb-14 lg:pt-24 lg:pb-16 overflow-hidden border-b border-border/40">
      {/* Section heading */}
      <div ref={headingRef} className="mx-auto max-w-7xl px-6 mb-10 md:mb-12 lg:px-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          Shop by Category
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
          Explore Our Weaves
        </h2>
      </div>

      {/* Infinite marquee track — draggable */}
      <div
        className="relative select-none cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ WebkitUserSelect: "none" }}
      >
        <div ref={trackRef} className="flex gap-8 will-change-transform pl-6 lg:pl-12 md:gap-10">
          {loopedCategories.map((cat, i) => (
            <Link
              key={`${cat.name}-${i}`}
              href={cat.href}
              onClick={handleClick}
              draggable={false}
              className="group shrink-0 flex flex-col items-center gap-3"
            >
              {/* Circular image — zoomed into fabric */}
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted ring-1 ring-border/30 transition-shadow duration-300 group-hover:ring-foreground/20 group-hover:shadow-lg sm:h-28 sm:w-28 md:h-32 md:w-32">
                <Image
                  src={cat.image}
                  alt={`${cat.name} weave`}
                  fill
                  sizes="128px"
                  draggable={false}
                  className="object-cover scale-[2.2] object-[center_30%] transition-transform duration-500 ease-out group-hover:scale-[2.4]"
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 transition-colors duration-300 group-hover:text-foreground sm:text-[11px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
