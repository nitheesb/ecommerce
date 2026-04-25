"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
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
      const content = contentRef.current
      const line1 = line1Ref.current
      const line2 = line2Ref.current
      const para = paraRef.current
      const scrollIndic = scrollIndicRef.current

      if (!hero || !image || !content || !line1 || !line2 || !para || !scrollIndic) return

      gsap.set(image, { scale: 1.06, opacity: 0.94 })
      gsap.set(content, { opacity: 0, y: 26 })
      gsap.set([line1, line2], { y: 28 })
      gsap.set(para, { opacity: 0, y: 22 })
      gsap.set(scrollIndic, { opacity: 0, y: 10 })

      const intro = gsap.timeline({ delay: 0.15 })
      intro.to(image, {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: "power2.out",
      })
      intro.to(content, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, 0.18)
      intro.to([line1, line2], {
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      }, 0.22)
      intro.to(para, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 0.45)
      intro.to(scrollIndic, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.7)

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      })
        .to(image, {
        yPercent: 8,
        scale: 1.08,
        ease: "none",
      }, 0)
        .to(content, {
        y: -40,
        ease: "none",
      }, 0)
        .to(scrollIndic, {
        opacity: 0,
        ease: "none",
      }, 0)
    }, heroRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={heroRef}
      aria-label="More than a saree — it's an embrace"
      className="relative hidden min-h-[100svh] overflow-hidden md:block"
    >
      <div
        className="absolute inset-0 z-0"
      >
        <div
          ref={imageRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/hero-red-portrait.png"
            alt="A woman in a red saree standing in a warmly lit heritage corridor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
        </div>
      <div
        aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-foreground/76 via-foreground/32 to-foreground/16"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-foreground/62 via-transparent to-foreground/18"
        />
        <div
          aria-hidden
          className="absolute inset-y-[16%] left-[6%] w-[42%] rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(12,10,9,0.36),rgba(12,10,9,0))] blur-3xl"
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-28 md:px-8 md:pb-14 md:pt-32 lg:pb-16 lg:pt-36">
          <div
            ref={contentRef}
            className="max-w-[43rem] rounded-[32px] border border-background/14 bg-background/6 px-7 py-8 text-background shadow-[0_20px_80px_rgba(12,10,9,0.16)] backdrop-blur-[6px] md:px-9 md:py-10 lg:px-10 lg:py-11"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-background/70">
              House of Thazhuval
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-balance md:text-7xl lg:text-[84px]">
              <span ref={line1Ref} className="block will-change-transform">
                More than a saree...
              </span>
              <span
                ref={line2Ref}
                className="mt-2 block italic text-[hsl(var(--sand))] will-change-transform"
              >
                it&apos;s an embrace.
              </span>
            </h1>
            <p
              ref={paraRef}
              className="mt-6 max-w-[34rem] text-base leading-relaxed text-background/90 md:text-lg"
            >
              Thazhuval means &lsquo;embrace&rsquo; — a feeling of comfort, love,
              and belonging. Soft fabrics, thoughtful craftsmanship, pieces
              that don&apos;t just dress you — they hold you.
            </p>
            <Image
              src="/images/logo-03.png"
              alt="The comfort that embraces you"
              width={680}
              height={92}
              priority
              className="mt-7 h-auto w-[clamp(260px,46vw,520px)] select-none [filter:invert(1)_brightness(1.05)]"
            />
          </div>

          <div
            ref={scrollIndicRef}
            className={`absolute bottom-8 right-8 text-background/60 ${reducedMotion ? "hidden" : ""}`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
              <div className="relative h-8 w-[14px] rounded-full border border-background/40">
                <span className="absolute left-1/2 top-1.5 h-1 w-[1.5px] -translate-x-1/2 rounded-full bg-background/70 animate-scroll-indicator" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
