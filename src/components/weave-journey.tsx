"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const chapters = [
  {
    label: "Chapter I",
    title: "Where It Begins",
    image: "/images/hero.jpg",
    alt: "Raw silk threads in golden light",
    text: "Every saree begins as a single thread — raw, humble, full of possibility. Sourced from the finest regions of India, each fibre carries the promise of something extraordinary.",
  },
  {
    label: "Chapter II",
    title: "The Hands Behind the Weave",
    image: "/images/editorial-2.jpg",
    alt: "Master weaver working on a traditional loom",
    text: "In the hands of master weavers, threads become poetry. Each pattern is a language passed down through generations — one shuttle, one row, one story at a time.",
  },
  {
    label: "Chapter III",
    title: "From Loom to Life",
    image: "/images/editorial-1.jpg",
    alt: "Saree fabric being finished by artisan hands",
    text: "Dyeing, finishing, folding — each step is guided by care, patience, and a deep love for the craft. No shortcuts, no compromises, just devotion to the art.",
  },
  {
    label: "Chapter IV",
    title: "Six Yards of Belonging",
    image: "/images/saree-4-a.jpg",
    alt: "Woman draped in an elegant Kanjeevaram saree",
    text: "More than a saree — it's an embrace. Six yards of comfort, tradition, and individuality. When you drape a Thazhuval, you carry a piece of someone's heart.",
  },
]

export function WeaveJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    // Desktop: horizontal scroll with pin
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const panels = track.querySelectorAll<HTMLElement>(".journey-panel")
        const totalScroll = track.scrollWidth - section.offsetWidth

        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            end: () => `+=${totalScroll}`,
            invalidateOnRefresh: true,
          },
        })

        // Stagger text reveals per panel
        panels.forEach((panel) => {
          const textEls = panel.querySelectorAll(".journey-reveal")
          gsap.set(textEls, { opacity: 0, y: 30 })

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: gsap.getById?.("__weaveJourney") ?? undefined,
            start: "left 70%",
            end: "left 30%",
            onEnter: () => {
              gsap.to(textEls, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
              })
            },
          })
        })
      }, section)

      return () => ctx.revert()
    })

    // Mobile: vertical layout with fade-in reveals
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        const items = track.querySelectorAll<HTMLElement>(".journey-reveal")
        gsap.set(items, { opacity: 0, y: 20 })

        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              })
            },
          })
        })
      }, section)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex flex-col gap-16 py-10 md:flex-row md:gap-0 md:py-0"
        style={{ width: "fit-content" }}
      >
        {chapters.map((ch, i) => (
          <div
            key={i}
            className="journey-panel flex w-full flex-col px-6 md:h-screen md:w-screen md:flex-row md:items-center md:gap-0 md:px-0"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted md:aspect-auto md:h-full md:w-[55%]">
              <Image
                src={ch.image}
                alt={ch.alt}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
                priority={i === 0}
              />
              {/* Subtle vignette */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/30 hidden md:block"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center px-0 py-8 md:w-[45%] md:px-16 lg:px-24">
              <p className="journey-reveal text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {ch.label}
              </p>
              <h3 className="journey-reveal mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl">
                {ch.title}
              </h3>
              <p className="journey-reveal mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {ch.text}
              </p>
              {i === chapters.length - 1 && (
                <p className="journey-reveal mt-6 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/60">
                  This is Thazhuval.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
