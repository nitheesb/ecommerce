import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ProductCare() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_1.3fr] md:gap-20 lg:px-12 lg:py-28">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Forever Yours
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Care, crafted with the same love as the weave.
          </h2>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            A Thazhuval saree is a lifelong companion. Here&apos;s how to keep yours as luminous as the
            day you first draped it.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-full divide-y divide-border/60 border-y border-border/60"
        >
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger>Everyday Care &amp; Storage</AccordionTrigger>
            <AccordionContent>
              Store each saree folded in a breathable muslin pouch, away from direct sunlight. Refold
              every 2&ndash;3 months along different lines to prevent crease fatigue. Keep a small
              sachet of cloves nearby to gently repel insects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none">
            <AccordionTrigger>Cleaning &amp; Washing</AccordionTrigger>
            <AccordionContent>
              We recommend dry cleaning from a trusted specialist for all silk and zari pieces. Cotton
              sarees may be hand-washed in cold water with a mild, pH-neutral detergent. Never wring
              &mdash; gently press water out and line-dry in shade.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-none">
            <AccordionTrigger>Ironing the Weave</AccordionTrigger>
            <AccordionContent>
              Iron on the reverse side on a low, silk-safe setting. Place a thin muslin cloth over any
              zari or embroidered section. Avoid steam on metallic threads; it can tarnish fine gold
              and silver work over time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-none">
            <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
            <AccordionContent>
              Each saree is hand-packed in our signature ivory box with a certificate of origin.
              Complimentary shipping on all orders above ₹2,000. Returns accepted within 48 hours for
              damaged or defective items. Please refer to our Refund Policy for full details.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger>The Thazhuval Promise</AccordionTrigger>
            <AccordionContent>
              Complimentary lifetime restoration on every piece. Should the threads ever falter, our
              atelier in Kanchipuram will revive your saree to its original splendor &mdash; no
              questions, no fees.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
