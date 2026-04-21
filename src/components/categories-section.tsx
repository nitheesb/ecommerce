"use client"

import { useEffect, useRef } from "react"
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
]

export function CategoriesSection() {
  const headingRef = useRef<HTMLDivElement>(null)

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
    <section className="border-b border-border/40 bg-[linear-gradient(180deg,rgba(251,248,241,0.82),rgba(251,248,241,1))] py-16 lg:py-20">
      <div
        ref={headingRef}
        className="mx-auto mb-10 flex max-w-7xl flex-col gap-4 px-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12"
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Shop by Category
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
            Explore the weave library
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A calmer way to browse the collection by feel, weight, and occasion, without the moving rail.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shopCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col items-start gap-4 rounded-[28px] border border-border/50 bg-background/78 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_18px_36px_-28px_rgba(27,31,35,0.35)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-muted">
                <Image
                  src={cat.image}
                  alt={`${cat.name} weave`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Collection
                </span>
                <p className="mt-1 font-serif text-xl text-foreground">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
