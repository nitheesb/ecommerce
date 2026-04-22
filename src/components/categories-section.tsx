"use client"

import { useEffect, useRef } from "react"
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

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) return

    const ctx = gsap.context(() => {
      const heading = section.querySelectorAll<HTMLElement>("[data-browse-heading]")
      const cards = section.querySelectorAll<HTMLElement>("[data-browse-card]")

      gsap.set([...heading, ...cards], { opacity: 0, y: 24 })

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          })

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.12,
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="border-b border-border/40 bg-[linear-gradient(180deg,#fbf8f1_0%,#f6f1e6_100%)] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl" data-browse-heading>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Browse the House
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
            Explore collections through the same pathways as the navigation.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Start with a category, then dive into the exact weaves, prints, occasions, and colour stories you
            want to explore.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {categories.map((category) => (
            <article
              key={category.title}
              data-browse-card
              className="overflow-hidden rounded-[28px] border border-border/50 bg-background/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-[1.1fr_1fr]">
                <div className="relative min-h-[240px] overflow-hidden">
                  <Image
                    src={categoryImages[category.title]}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-background/75">Navigation Category</p>
                    <h3 className="mt-2 font-serif text-3xl tracking-tight">{category.title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-background/82">{category.blurb}</p>
                    <Link
                      href={category.href}
                      className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-background/90 transition-colors hover:text-background"
                    >
                      Explore Category
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-6 md:p-7">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      Subsections
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full border border-border/60 bg-secondary/30 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/78 transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border/50 pt-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Browse from the overview or jump straight into a specific subsection from here.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
