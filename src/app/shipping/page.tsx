import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "House of Thazhuval shipping information for domestic and international orders.",
}

export default function ShippingPage() {
  return (
    <InnerPageShell>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping Policy" },
            ]}
            className="mb-8"
          />
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Shipping Policy
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              At House of Thazhuval, we ensure that your handcrafted sarees are carefully
              packed and delivered to you with reliability and care.
            </p>

            <div>
              <h2 className="text-base font-medium text-foreground">Domestic Shipping (Within India)</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>Free shipping</strong> on all orders above <strong>INR 2,000</strong></li>
                <li>Orders are shipped from <strong>Coimbatore</strong> through trusted courier partners such as India Post, DTDC, and others</li>
                <li>Orders are processed within <strong>1&ndash;2 business days</strong></li>
                <li>Delivery typically takes <strong>5&ndash;7 business days</strong></li>
              </ul>
              <p className="mt-3">
                Once your order is dispatched, a <strong>tracking number</strong> will be shared via email.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Change of Address</h2>
              <p className="mt-2">
                If you need to update your delivery address, please email us at{" "}
                <a href="mailto:houseofthazhuval@gmail.com" className="text-foreground underline underline-offset-4">
                  houseofthazhuval@gmail.com
                </a>{" "}
                within <strong>4 hours</strong> of placing your order.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">International Shipping</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Shipping charges are <strong>calculated based on weight and number of products</strong></li>
                <li>Orders are usually shipped within <strong>3&ndash;4 working days</strong></li>
                <li>Estimated delivery time is <strong>10&ndash;15 business days</strong> (may vary based on location)</li>
              </ul>
              <p className="mt-3">
                Any <strong>customs duties or import taxes</strong> are to be borne by the customer.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Additional Information</h2>
              <p className="mt-2">
                Delivery timelines may vary slightly due to external factors such as courier delays
                or unforeseen circumstances. We strive to ensure timely delivery, but delays beyond
                our control may occur.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Contact Us</h2>
              <p className="mt-2">
                For any shipping-related queries, feel free to reach out:{" "}
                <a href="mailto:houseofthazhuval@gmail.com" className="text-foreground underline underline-offset-4">
                  houseofthazhuval@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
    </InnerPageShell>
  )
}
