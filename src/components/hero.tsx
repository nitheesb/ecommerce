"use client"

import { useRef, useLayoutEffect } from "react"
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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const hero = heroRef.current
      const image = imageRef.current
      const vignette = vignetteRef.current
      const eyebrow = eyebrowRef.current
      const line1 = line1Ref.current
      const line2 = line2Ref.current
      const para = paraRef.current
      const scrollIndic = scrollIndicRef.current

      if (!hero || !image || !vignette || !eyebrow || !line1 || !line2 || !para || !scrollIndic) return

      const fixedBg = fixedBgRef.current
      if (!fixedBg) return

      // ── Initial states ──
      gsap.set(image, { scale: 1.3, filter: "blur(8px)" })
      gsap.set(vignette, { opacity: 1 })
      gsap.set(eyebrow, { opacity: 0, y: 20 })
      gsap.set([line1, line2], { clipPath: "inset(100% 0 0 0)", y: 40 })
      gsap.set(para, { opacity: 0, y: 30 })
      gsap.set(scrollIndic, { opacity: 0, y: 10 })

      // Hairlines inside eyebrow
      const hairlines = eyebrow.querySelectorAll<HTMLSpanElement>(".hero-hairline")
      gsap.set(hairlines, { width: 0, opacity: 0 })

      // ── Intro timeline ──
      const intro = gsap.timeline({ delay: 0.3 })

      // Cinematic camera settle
      intro.to(image, {
        scale: 1.05,
        filter: "blur(0px)",
        duration: 2,
        ease: "power3.out",
      })

      // Dramatic vignette reveal
      intro.to(vignette, {
        opacity: 0.85,
        duration: 1.8,
        ease: "power2.out",
      }, 0)

      // Eyebrow fade in
      intro.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 0.8)

      // Hairlines slide in
      intro.to(hairlines, {
        width: 40,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      }, 1.0)

      // Masked text reveal — line 1
      intro.to(line1, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1,
        ease: "power4.out",
      }, 1.1)

      // Masked text reveal — line 2
      intro.to(line2, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1,
        ease: "power4.out",
      }, 1.35)

      // Paragraph
      intro.to(para, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 1.7)

      // Scroll indicator
      intro.to(scrollIndic, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 2.0)

      // ── Scroll-driven parallax timeline ──
      // Each element exits at a different speed + blur for cinematic depth
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      })

      // Image: slow zoom creates depth
      scrollTl.to(image, {
        scale: 1.18,
        ease: "none",
      }, 0)

      // Vignette darkens
      scrollTl.to(vignette, {
        opacity: 1,
        ease: "none",
      }, 0)

      // Scroll indicator: instant exit
      scrollTl.to(scrollIndic, {
        opacity: 0,
        ease: "none",
      }, 0)

      // Eyebrow: fast exit with blur
      scrollTl.to(eyebrow, {
        y: -100,
        opacity: 0,
        filter: "blur(8px)",
        ease: "none",
      }, 0)

      // Heading line 1: deep parallax with scale + blur
      scrollTl.to(line1, {
        y: -160,
        opacity: 0,
        scale: 0.9,
        filter: "blur(6px)",
        ease: "none",
      }, 0.03)

      // Heading line 2: different speed for split effect
      scrollTl.to(line2, {
        y: -120,
        opacity: 0,
        scale: 0.92,
        filter: "blur(6px)",
        ease: "none",
      }, 0.07)

      // Paragraph: medium exit with blur
      scrollTl.to(para, {
        y: -80,
        opacity: 0,
        filter: "blur(4px)",
        ease: "none",
      }, 0.04)

      // Hide fixed background once hero is scrolled past
      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnterBack: () => gsap.set(fixedBg, { visibility: "visible" }),
        onLeave: () => gsap.set(fixedBg, { visibility: "hidden" }),
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      aria-label="More than a saree — it's an embrace"
      className="relative -mt-14 min-h-[100svh] md:-mt-16"
    >
      {/* Fixed background — stays in place while page scrolls over it */}
      <div ref={fixedBgRef} className="fixed inset-0 z-0">
        <div
          ref={imageRef}
          className="absolute inset-[-10%] will-change-transform"
        >
          <Image
            src="/images/hero-cover.jpg"
            alt="A woman in a red and gold saree standing in a golden mustard field"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Cinematic vignette — stronger for bright image */}
        <div
          ref={vignetteRef}
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-foreground/70"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(17,22,30,0.5)_100%)]"
        />
      </div>

      {/* Content overlay — positioned over fixed background */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center">

      {/* Top hairline + eyebrow */}
      <div
        ref={eyebrowRef}
        className="absolute inset-x-0 top-20 flex justify-center md:top-24"
      >
        <div className="flex items-center gap-4 text-background/90">
          <span className="hero-hairline h-px bg-background/70" />
          <span className="text-[11px] font-medium uppercase tracking-[0.32em]">
            House of Thazhuval
          </span>
          <span className="hero-hairline h-px bg-background/70" />
        </div>
      </div>

      {/* Centered copy */}
      <div className="relative mx-auto max-w-4xl px-6 text-center text-background">
        <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.015em] md:text-7xl lg:text-[88px] text-balance">
          <span ref={line1Ref} className="block will-change-transform">
            More than a saree...
          </span>
          <span ref={line2Ref} className="block italic text-[hsl(var(--sand))] will-change-transform">
            it&apos;s an embrace.
          </span>
        </h1>
        <p
          ref={paraRef}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-background/90 md:text-base text-pretty"
        >
          Thazhuval means &lsquo;embrace&rsquo; — a feeling of comfort, love, and
          belonging. Soft fabrics, thoughtful craftsmanship, pieces that
          don&apos;t just dress you — they hold you.
        </p>
      </div>

      {/* Scroll indicator — subtle, bottom right */}
      <div
        ref={scrollIndicRef}
        className="absolute bottom-8 right-8 text-background/50"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="relative h-8 w-[14px] rounded-full border border-background/40">
            <span className="absolute left-1/2 top-1.5 h-1 w-[1.5px] -translate-x-1/2 rounded-full bg-background/60 animate-scroll-indicator" />
          </div>
        </div>
      </div>

      </div>{/* end content overlay */}
    </section>
  )
}
