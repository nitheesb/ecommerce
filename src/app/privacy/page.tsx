import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how House of Thazhuval collects, uses, and safeguards your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Privacy Policy
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              At <strong>House of Thazhuval</strong>, we value your trust and are committed to
              protecting your personal information. This Privacy Policy explains how we collect,
              use, and safeguard your data when you visit our website or make a purchase.
            </p>
            <p>By using our website, you agree to the terms of this Privacy Policy.</p>

            <div>
              <h2 className="text-base font-medium text-foreground">1. Information We Collect</h2>
              <p className="mt-2">We collect the following personal information when you interact with us:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Name, email address, phone number</li>
                <li>Shipping and billing address</li>
                <li>Payment details (processed securely via third-party payment gateways)</li>
                <li>Order history and preferences</li>
              </ul>
              <p className="mt-2">We also collect non-personal data such as browser type, device info, and usage patterns.</p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">2. How We Use Your Information</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Process and deliver orders</li>
                <li>Communicate order updates and confirmations</li>
                <li>Provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional emails (opt-in only)</li>
                <li>Prevent fraud</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">3. Sharing of Information</h2>
              <p className="mt-2">
                We do not sell your personal data. We may share information with payment gateways,
                courier/logistics partners, and legal authorities if required.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">4. Data Security</h2>
              <p className="mt-2">
                We implement appropriate measures to protect your information. However, no method
                of electronic transmission or storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">5. Cookies</h2>
              <p className="mt-2">
                We may use cookies to enhance your browsing experience. You can disable cookies
                in your browser settings, but some features may not work properly.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">6. Your Rights</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Request deletion (subject to legal/transactional requirements)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">7. Contact Us</h2>
              <p className="mt-2">
                For privacy-related inquiries, contact us at{" "}
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
