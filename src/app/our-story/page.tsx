import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"
import { WeaveJourney } from "@/components/weave-journey"

export const metadata: Metadata = {
  title: "Our Story",
  description: "House of Thazhuval was born from a simple, powerful feeling — the comfort of being held.",
}

export default function OurStoryPage() {
  return (
    <InnerPageShell>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Our Story" },
            ]}
            className="mb-8"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Our Story
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            House of Thazhuval
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              House of Thazhuval was born from a simple, powerful feeling &mdash; the comfort
              of being held.
            </p>
            <p>
              In a world that moves fast, we wanted to create something that slows you down,
              something that feels personal, meaningful, and close to the heart. The word
              &ldquo;Thazhuval&rdquo; itself speaks of an embrace, and that emotion lives in
              everything we create.
            </p>
            <p>
              Our journey began with a deep appreciation for traditional craftsmanship &mdash;
              the artistry of hands that weave, dye, and bring fabric to life. We chose to
              focus only on <strong>handcrafted sarees</strong>, because we believe every piece
              should carry a story, a touch of human effort, and a sense of individuality.
            </p>
            <p>
              Each saree at House of Thazhuval is thoughtfully created, not mass-made. From the
              choice of fabric to the smallest detail, every step is guided by care, quality,
              and a love for the craft.
            </p>
          </div>

          {/* Story of the Weave — scroll journey */}
          <div className="mt-16 -mx-6 lg:-mx-12">
            <WeaveJourney />
          </div>

          <div className="mt-14 border-t border-border/60 pt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Our Mission
            </p>
            <p className="mt-4 font-serif text-xl leading-relaxed md:text-2xl">
              To create handcrafted sarees that celebrate tradition, craftsmanship, and
              individuality &mdash; bringing timeless elegance and comfort to every woman.
            </p>
          </div>
        </section>
    </InnerPageShell>
  )
}
