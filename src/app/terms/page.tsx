import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for House of Thazhuval.",
}

export default function TermsPage() {
  return (
    <InnerPageShell>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Terms of Service" },
            ]}
            className="mb-8"
          />
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
                House of Thazhuval offers this website, including all information, tools, and services
                available from this site to you, the user, conditioned upon your acceptance of all terms,
                conditions, policies, and notices stated here.
              </p>
              <p className="mt-2">
                By visiting our site and/or purchasing something from us, you engage in our
                &ldquo;Service&rdquo; and agree to be bound by the following Terms of Service
                (&ldquo;Terms&rdquo;), including additional policies referenced herein or available
                by hyperlink.
              </p>
              <p className="mt-2">
                These Terms apply to all users of the site, including browsers, customers, merchants,
                and contributors.
              </p>
              <p className="mt-2">
                If you do not agree to these Terms, you may not access the website or use any services.
              </p>
              <p className="mt-2">
                We reserve the right to update or modify these Terms at any time. Continued use of the
                site after changes constitutes acceptance of those changes.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">1. Online Store Terms</h2>
              <p className="mt-2">
                By using this site, you confirm that you are of legal age in your jurisdiction or have
                given consent for any minor dependents to use this site.
              </p>
              <p className="mt-2">
                You may not use our products for any illegal or unauthorized purpose.
              </p>
              <p className="mt-2">
                You must not transmit any viruses, malware, or harmful code.
              </p>
              <p className="mt-2">
                Violation of any Terms will result in termination of services.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">2. General Conditions</h2>
              <p className="mt-2">
                We reserve the right to refuse service to anyone at any time.
              </p>
              <p className="mt-2">
                Your content (excluding credit card information) may be transferred unencrypted over networks.
              </p>
              <p className="mt-2">
                Credit card information is always encrypted.
              </p>
              <p className="mt-2">
                You agree not to reproduce, duplicate, sell, or exploit any part of the service without
                written permission.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">3. Accuracy of Information</h2>
              <p className="mt-2">
                We are not responsible if information on this site is inaccurate or outdated. Content is
                for general reference only.
              </p>
              <p className="mt-2">
                We reserve the right to modify content at any time without obligation to update it.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">4. Pricing &amp; Service Modifications</h2>
              <p className="mt-2">
                Prices are subject to change without notice.
              </p>
              <p className="mt-2">
                We may modify or discontinue services at any time without liability.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">5. Products &amp; Services</h2>
              <p className="mt-2">
                Certain products are available exclusively online and may be limited in quantity.
              </p>
              <p className="mt-2">
                Products are subject to return only according to our Refund Policy.
              </p>
              <p className="mt-2">
                We aim to display product colors and images accurately but cannot guarantee exact screen
                representation.
              </p>
              <p className="mt-2">
                We reserve the right to limit or cancel orders at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">6. Billing &amp; Account Information</h2>
              <p className="mt-2">
                We reserve the right to refuse or cancel any order.
              </p>
              <p className="mt-2">
                You agree to provide accurate and updated account and purchase information.
              </p>
              <p className="mt-2">
                We may contact you regarding order updates and cancellations.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">7. Optional Tools</h2>
              <p className="mt-2">
                We may provide third-party tools without monitoring or control.
              </p>
              <p className="mt-2">
                Use of such tools is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">8. Third-Party Links</h2>
              <p className="mt-2">
                We are not responsible for third-party websites or content linked on our site.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">9. User Comments &amp; Feedback</h2>
              <p className="mt-2">
                We may use any feedback or submissions provided by users without restriction.
              </p>
              <p className="mt-2">
                We are not responsible for user-generated content.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">10. Personal Information</h2>
              <p className="mt-2">
                Your submission of personal information is governed by our Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">11. Errors &amp; Omissions</h2>
              <p className="mt-2">
                We reserve the right to correct errors or inaccuracies at any time, including after an
                order is placed.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">12. Prohibited Uses</h2>
              <p className="mt-2">
                You are prohibited from using this site for unlawful, abusive, harmful, or unauthorized
                activities.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">13. Disclaimer &amp; Limitation of Liability</h2>
              <p className="mt-2">
                We do not guarantee uninterrupted or error-free service.
              </p>
              <p className="mt-2">
                All products and services are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;
              </p>
              <p className="mt-2">
                House of Thazhuval shall not be liable for any indirect or consequential damages arising
                from use of the service or products.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">14. Indemnification</h2>
              <p className="mt-2">
                You agree to indemnify and hold harmless House of Thazhuval from any claims arising from
                your violation of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">15. Severability</h2>
              <p className="mt-2">
                If any provision is found unenforceable, the remaining provisions remain valid.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">16. Termination</h2>
              <p className="mt-2">
                We may terminate access to services at any time for violation of Terms.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">17. Entire Agreement</h2>
              <p className="mt-2">
                These Terms, along with policies on this site, constitute the entire agreement between
                you and House of Thazhuval.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">18. Governing Law</h2>
              <p className="mt-2">
                These Terms are governed by the laws of <strong>India</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">19. Changes to Terms</h2>
              <p className="mt-2">
                We may update these Terms at any time. Continued use of the site means acceptance of changes.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">20. Contact Information</h2>
              <p className="mt-2">
                For questions regarding these Terms:{" "}
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
