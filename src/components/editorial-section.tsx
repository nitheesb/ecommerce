"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const imageWrap = imageWrapRef.current
    const image = imageRef.current
    const text = textRef.current
    if (!section || !imageWrap || !image || !text) return

    // Image parallax
    gsap.to(image, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: imageWrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    })

    // Text reveal
    const textChildren = text.querySelectorAll<HTMLElement>(".reveal-item")
    gsap.set(textChildren, { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" })

    ScrollTrigger.create({
      trigger: text,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(textChildren, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "clipPath",
        })
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-border/60 bg-secondary/40 weave-texture">
      <div className="relative z-[1] mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 lg:px-12 lg:py-28">
        <div ref={imageWrapRef} className="relative order-2 aspect-[4/5] overflow-hidden md:order-1">
          <div ref={imageRef} className="absolute inset-[-30px] will-change-transform">
            <Image
              src="/images/editorial-2.jpg"
              alt="Artisan weaver at a traditional handloom"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-6 rounded-sm bg-background/90 px-4 py-3 backdrop-blur">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Chapter I
            </p>
            <p className="font-serif text-lg">The Hands Behind the Weave</p>
          </div>
        </div>
        <div ref={textRef} className="order-1 flex flex-col justify-center md:order-2">
          <p className="reveal-item text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Our Story
          </p>
          <h2 className="reveal-item mt-5 text-balance font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            What is Thazhuval?
          </h2>
          <p className="reveal-item mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Thazhuval means &lsquo;embrace&rsquo; &mdash; a feeling of comfort, love, and belonging.
            At House of Thazhuval, every saree is designed to feel like that embrace. From soft fabrics
            to thoughtful craftsmanship, we create pieces that don&apos;t just dress you &mdash; they hold you.
          </p>
          <p className="reveal-item mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Six yards of poetry, woven across generations by master artisans across Kanchipuram,
            Banaras, and Chanderi &mdash; preserving techniques that are centuries old, and stories
            that are uniquely yours.
          </p>
          <div className="reveal-item mt-10">
            <Link
              href="/our-story"
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
            >
              Discover Our Story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
