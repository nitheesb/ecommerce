"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const fixedBgRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const scrollIndicRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches)

    updateReducedMotion()
    mediaQuery.addEventListener("change", updateReducedMotion)

    return () => mediaQuery.removeEventListener("change", updateReducedMotion)
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const hero = heroRef.current
      const image = imageRef.current
      const fixedBg = fixedBgRef.current
      const vignette = vignetteRef.current
      const eyebrow = eyebrowRef.current
      const line1 = line1Ref.current
      const line2 = line2Ref.current
      const para = paraRef.current
      const scrollIndic = scrollIndicRef.current

      if (!hero || !image || !fixedBg || !vignette || !eyebrow || !line1 || !line2 || !para || !scrollIndic) {
        return
      }

      gsap.set(image, { scale: 1.08 })
      gsap.set(vignette, { opacity: 0.9 })
      gsap.set(eyebrow, { opacity: 0, y: 16 })
      gsap.set([line1, line2, para], { opacity: 0, y: 28 })
      gsap.set(scrollIndic, { opacity: 0, y: 8 })

      const intro = gsap.timeline({ delay: 0.15 })
      intro.to(image, {
        scale: 1,
        duration: 1.6,
        ease: "power2.out",
      })
      intro.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, 0.2)
      intro.to([line1, line2], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }, 0.35)
      intro.to(para, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }, 0.65)
      intro.to(scrollIndic, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.95)

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      })

      scrollTl.to(image, {
        scale: 1.08,
        ease: "none",
      }, 0)
      scrollTl.to(vignette, {
        opacity: 1,
        ease: "none",
      }, 0)
      scrollTl.to(scrollIndic, {
        opacity: 0,
        ease: "none",
      }, 0)
      scrollTl.to(eyebrow, {
        y: -56,
        opacity: 0,
        ease: "none",
      }, 0)
      scrollTl.to(line1, {
        y: -72,
        opacity: 0,
        ease: "none",
      }, 0.04)
      scrollTl.to(line2, {
        y: -56,
        opacity: 0,
        ease: "none",
      }, 0.08)
      scrollTl.to(para, {
        y: -36,
        opacity: 0,
        ease: "none",
      }, 0.1)

      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnterBack: () => gsap.set(fixedBg, { visibility: "visible" }),
        onLeave: () => gsap.set(fixedBg, { visibility: "hidden" }),
      })
    }, heroRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={heroRef}
      aria-label="Quiet grandeur by House of Thazhuval"
      className="relative hidden min-h-[100svh] md:block"
    >
      <div
        ref={fixedBgRef}
        className={reducedMotion ? "absolute inset-0 z-0" : "fixed inset-0 z-0"}
      >
        <div ref={imageRef} className="absolute inset-[-6%] will-change-transform">
          <Image
            src="/images/hero-cover.jpg"
            alt="A woman in a red and gold saree standing in a golden mustard field"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_40%]"
          />
        </div>
        <div
          ref={vignetteRef}
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-foreground/78 via-foreground/44 to-foreground/18"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_35%,_transparent_0%,_transparent_32%,_rgba(17,22,30,0.38)_100%)]"
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end">
        <div className="mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-12 px-6 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32 lg:pb-24">
          <div className="col-span-7 flex items-end lg:col-span-6">
            <div className="max-w-2xl text-background">
              <div
                ref={eyebrowRef}
                className="mb-6 flex items-center gap-4 text-background/88"
              >
                <span className="h-px w-12 bg-background/60" />
                <span className="text-[11px] font-medium uppercase tracking-[0.32em]">
                  House of Thazhuval
                </span>
              </div>

              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.02em] text-balance md:text-7xl lg:text-[82px]">
                <span ref={line1Ref} className="block will-change-transform">
                  Sarees with
                </span>
                <span
                  ref={line2Ref}
                  className="block text-[hsl(var(--sand))] will-change-transform"
                >
                  quiet grandeur.
                </span>
              </h1>

              <p
                ref={paraRef}
                className="mt-6 max-w-xl text-base leading-relaxed text-background/84 lg:text-lg"
              >
                Thoughtful drapes, heirloom weaves, and soft structure made to feel
                composed the moment they touch the skin.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/collections/all-sarees"
                  className="bg-background px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-background/92"
                >
                  Shop the collection
                </Link>
                <Link
                  href="/our-story"
                  className="border border-background/40 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-background transition-colors hover:bg-background/10"
                >
                  Our story
                </Link>
              </div>
            </div>
          </div>

          <div
            ref={scrollIndicRef}
            className={`col-span-5 hidden items-end justify-end pb-2 text-background/68 lg:flex ${reducedMotion ? "opacity-0" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.28em]">Scroll to explore</span>
              <div className="relative h-8 w-[14px] rounded-full border border-background/38">
                <span className="absolute left-1/2 top-1.5 h-1.5 w-[1.5px] -translate-x-1/2 rounded-full bg-background/70 animate-scroll-indicator" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
