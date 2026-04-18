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
    name: "Handloom",
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
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heading = headingRef.current
      const scrollContainer = scrollRef.current
      if (!heading || !scrollContainer) return

      const tiles = scrollContainer.querySelectorAll<HTMLElement>(".category-tile")

      // Initial states
      gsap.set(heading.children, { opacity: 0, y: 24 })
      gsap.set(tiles, { opacity: 0, x: 40 })

      // Heading reveal
      ScrollTrigger.create({
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

      // Staggered tile slide-in from right
      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      {/* Section heading */}
      <div ref={headingRef} className="mx-auto max-w-7xl px-6 mb-10 md:mb-12 lg:px-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          Shop by Category
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
          Explore Our Weaves
        </h2>
      </div>

      {/* Horizontally scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide lg:px-12 md:gap-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {shopCategories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="category-tile group shrink-0"
          >
            <div className="relative h-36 w-28 overflow-hidden rounded-lg bg-muted sm:h-44 sm:w-34 md:h-48 md:w-36">
              <Image
                src={cat.image}
                alt={`${cat.name} saree`}
                fill
                sizes="144px"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.08]"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10"
                aria-hidden
              />
            </div>
            <p className="mt-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:text-xs">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
