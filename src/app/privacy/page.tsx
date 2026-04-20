import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how House of Thazhuval collects, uses, and safeguards your personal information.",
}

export default function PrivacyPage() {
  return (
    <InnerPageShell>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
            ]}
            className="mb-8"
          />
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Privacy Policy
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="text-base font-medium text-foreground">Overview</h2>
              <p className="mt-2">
                At <strong>House of Thazhuval</strong>, we value your trust and are committed to
                protecting your personal information. This Privacy Policy explains how we collect,
                use, and safeguard your data when you visit our website or make a purchase.
              </p>
              <p className="mt-2">By using our website, you agree to the terms of this Privacy Policy.</p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">1. Information We Collect</h2>
              <p className="mt-2">When you interact with our store, we may collect the following information:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping and billing address</li>
                <li>Payment details (processed securely via third-party payment gateways)</li>
                <li>Order history and preferences</li>
              </ul>
              <p className="mt-2">
                We may also collect non-personal data such as browser type, device information, and
                website usage patterns.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">2. How We Use Your Information</h2>
              <p className="mt-2">We use your information to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Process and deliver your orders</li>
                <li>Communicate order updates and confirmations</li>
                <li>Provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional emails or offers (only if you opt in)</li>
                <li>Prevent fraudulent transactions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">3. Sharing of Information</h2>
              <p className="mt-2">
                We respect your privacy and do not sell your personal data.
              </p>
              <p className="mt-2">We may share your information only with:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Payment gateways (for secure transactions)</li>
                <li>Courier and logistics partners (for delivery purposes)</li>
                <li>Legal authorities, if required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">4. Data Security</h2>
              <p className="mt-2">
                We take appropriate measures to protect your personal information from unauthorized
                access, misuse, or disclosure.
              </p>
              <p className="mt-2">
                However, no online transmission or storage system is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">5. Cookies</h2>
              <p className="mt-2">
                Our website may use cookies to enhance your browsing experience, remember preferences,
                and analyze website traffic.
              </p>
              <p className="mt-2">
                You can choose to disable cookies through your browser settings, but some features
                may not function properly.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">6. Third-Party Services</h2>
              <p className="mt-2">
                We may use third-party services such as payment gateways, analytics tools, and shipping
                providers. These services have their own privacy policies, and we are not responsible
                for their practices.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">7. Your Rights</h2>
              <p className="mt-2">You may request to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Request deletion of your data (subject to legal and transactional requirements)</li>
              </ul>
              <p className="mt-2">
                To make any such request, contact us at the email below.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">8. Data Retention</h2>
              <p className="mt-2">
                We retain your personal information only as long as necessary to fulfill orders,
                comply with legal obligations, and resolve disputes.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">9. Changes to This Policy</h2>
              <p className="mt-2">
                We may update this Privacy Policy from time to time. Any changes will be posted on
                this page, and continued use of the website implies acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">10. Contact Us</h2>
              <p className="mt-2">
                If you have any questions about this Privacy Policy, you can contact us at:{" "}
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
