import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "House of Thazhuval refund and return policy for handcrafted sarees.",
}

export default function RefundPolicyPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Refund Policy
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              At House of Thazhuval, we take great care in ensuring that every saree meets our
              quality standards. Each product undergoes a thorough quality check before it reaches
              you. As all our sarees are <strong>handcrafted</strong>, slight variations in color,
              weave, or texture are natural and add to the uniqueness of each piece. These are not
              considered defects.
            </p>

            <div>
              <h2 className="text-base font-medium text-foreground">Returns Eligibility</h2>
              <p className="mt-2">We accept returns <strong>only in the following cases:</strong></p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>The product received is damaged</li>
                <li>The product has a manufacturing defect</li>
              </ul>
              <p className="mt-3">To request a return:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>You must raise the request within <strong>48 hours of delivery</strong></li>
                <li>Email us at <strong>houseofthazhuval@gmail.com</strong></li>
                <li>Include your <strong>Order ID</strong></li>
                <li>Attach a clear <strong>unboxing video</strong> as proof</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Important Notes on Handcrafted Products</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Minor inconsistencies in print, color, or weaving are part of the handmade process</li>
                <li>Slight thread pulls or color variations are not defects</li>
                <li>Color bleeding in printed fabrics is normal</li>
              </ul>
              <p className="mt-3">
                Only sarees with <strong>major visible damage</strong> (such as torn fabric or large
                faded patches) will be considered eligible for return.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Non-Defect Returns</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Return may be considered on a case-by-case basis</li>
                <li><strong>Shipping charges (both forward &amp; reverse)</strong> must be borne by the customer</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Refund Process</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Once the returned product is received, it will undergo a <strong>quality inspection</strong></li>
                <li>Refunds will be processed only for the <strong>product cost</strong></li>
                <li><strong>Shipping charges are non-refundable</strong></li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Additional Terms</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Products must be <strong>unused, unwashed</strong>, and in original condition</li>
                <li>Original <strong>packaging and tags</strong> must be intact</li>
                <li>Requests raised after <strong>48 hours</strong> will not be accepted</li>
                <li><strong>Sale items are non-returnable</strong></li>
                <li><strong>Customized products cannot be returned or exchanged</strong></li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Exchange Policy</h2>
              <p className="mt-2">Currently, we do <strong>not offer exchanges</strong>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
