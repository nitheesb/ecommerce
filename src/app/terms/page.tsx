import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for House of Thazhuval.",
}

export default function TermsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Terms of Service
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="text-base font-medium text-foreground">Overview</h2>
              <p className="mt-2">
                This website is operated by <strong>House of Thazhuval</strong>. Throughout the site,
                the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to House of Thazhuval.
              </p>
              <p className="mt-2">
                By visiting our site and/or purchasing something from us, you engage in our
                &ldquo;Service&rdquo; and agree to be bound by the following Terms of Service. These
                Terms apply to all users of the site, including browsers, customers, merchants,
                and contributors.
              </p>
              <p className="mt-2">
                If you do not agree to these Terms, you may not access the website or use any services.
                We reserve the right to update or modify these Terms at any time. Continued use of the
                site after changes constitutes acceptance of those changes.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">1. Online Store Terms</h2>
              <p className="mt-2">
                By agreeing to these Terms, you confirm that you are of legal age in your jurisdiction.
                You may not use our products for any illegal or unauthorized purpose. You must not transmit
                any worms, viruses, or destructive code. A breach of any of the Terms will result in
                immediate termination of your services.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">2. General Conditions</h2>
              <p className="mt-2">
                We reserve the right to refuse service to anyone for any reason at any time. Content
                (not including credit card information) may be transferred unencrypted. You agree not
                to reproduce, duplicate, or exploit any portion of the Service without express written
                permission.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">3. Accuracy of Information</h2>
              <p className="mt-2">
                We are not responsible if information made available on this site is not accurate,
                complete, or current. We reserve the right to modify the contents of this site at any time.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">4. Pricing &amp; Service Modifications</h2>
              <p className="mt-2">
                Prices for our products are subject to change without notice. We reserve the right to
                modify or discontinue the Service at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">5. Products &amp; Services</h2>
              <p className="mt-2">
                Certain products or services may be available exclusively online through the website.
                These may have limited quantities and are subject to return only according to our
                Refund Policy. We have made every effort to display colors and images of products
                accurately. We reserve the right to limit quantities and to cancel orders at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">6. Billing &amp; Account Information</h2>
              <p className="mt-2">
                We reserve the right to refuse any order. You agree to provide current, complete, and
                accurate purchase and account information for all purchases made at our store.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">7. Prohibited Uses</h2>
              <p className="mt-2">
                You are prohibited from using the site for any unlawful purpose, to solicit others to
                perform unlawful acts, to violate any regulations, to infringe upon our intellectual
                property rights, to harass or discriminate, to submit false information, to upload
                malware, or to interfere with the security features of the Service.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">8. Limitation of Liability</h2>
              <p className="mt-2">
                We do not guarantee that your use of our service will be uninterrupted, timely, secure,
                or error-free. The service and all products are provided &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo;. In no event shall House of Thazhuval be liable for any
                indirect, incidental, special, or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">9. Governing Law</h2>
              <p className="mt-2">
                These Terms of Service shall be governed by and construed in accordance with the
                laws of <strong>India</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">10. Contact Information</h2>
              <p className="mt-2">
                Questions about the Terms of Service should be sent to us at{" "}
                <a href="mailto:houseofthazhuval@gmail.com" className="text-foreground underline underline-offset-4">
                  houseofthazhuval@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
