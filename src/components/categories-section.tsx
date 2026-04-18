"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const shopCategories = [
  {
    name: "Kanjeevaram",
    image: "/images/saree-1-a.jpg",
    href: "/collections/silk/kanjeevaram",
  },
  {
    name: "Banarasi",
    image: "/images/saree-3-a.jpg",
    href: "/collections/silk/banarasi",
  },
  {
    name: "Chanderi",
    image: "/images/saree-5-a.jpg",
    href: "/collections/silk/chanderi",
  },
  {
    name: "Handloom Cotton",
    image: "/images/saree-2-a.jpg",
    href: "/collections/cotton/handloom",
  },
  {
    name: "Patola",
    image: "/images/saree-7-a.jpg",
    href: "/collections/heritage/patola",
  },
  {
    name: "Bridal",
    image: "/images/saree-4-a.jpg",
    href: "/collections/heritage/bridal",
  },
  {
    name: "Raw Silk",
    image: "/images/saree-8-a.jpg",
    href: "/collections/silk/raw",
  },
  {
    name: "Khadi",
    image: "/images/saree-6-a.jpg",
    href: "/collections/cotton/khadi",
  },
  {
    name: "Tussar",
    image: "/images/saree-1-b.jpg",
    href: "/collections/silk/tussar",
  },
  {
    name: "Jamdani",
    image: "/images/saree-3-b.jpg",
    href: "/collections/cotton/jamdani",
  },
  {
    name: "Paithani",
    image: "/images/saree-7-b.jpg",
    href: "/collections/heritage/paithani",
  },
  {
    name: "Chettinad",
    image: "/images/saree-6-b.jpg",
    href: "/collections/cotton/chettinad",
  },
]

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const heading = headingRef.current
      const grid = gridRef.current
      if (!section || !heading || !grid) return

      const tiles = grid.querySelectorAll<HTMLElement>(".category-tile")

      // Initial states
      gsap.set(heading.children, { opacity: 0, y: 30 })
      gsap.set(tiles, { opacity: 0, y: 60, scale: 0.95 })

      // Heading reveal
      ScrollTrigger.create({
        trigger: heading,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(heading.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          })
        },
      })

      // Staggered tile reveal
      ScrollTrigger.create({
        trigger: grid,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: {
              amount: 0.6,
              grid: "auto",
              from: "start",
            },
            ease: "power3.out",
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      {/* Section heading */}
      <div ref={headingRef} className="mb-12 text-center md:mb-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          Shop by Category
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          Explore Our Weaves
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
          From ceremonial Kanjeevarams to everyday handlooms — find the weave that speaks to you.
        </p>
      </div>

      {/* Category grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        {shopCategories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="category-tile group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
              <Image
                src={cat.image}
                alt={`${cat.name} saree collection`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              {/* Subtle bottom gradient for depth */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 transition-colors duration-300 group-hover:text-foreground sm:text-[13px]">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
