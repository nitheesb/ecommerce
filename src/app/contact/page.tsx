import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with House of Thazhuval. We value your feedback and inquiries.",
}

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Contact Us
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              Thank you for reaching out to <strong>House of Thazhuval</strong>. We value your
              feedback, questions, and inquiries. There are several ways you can get in touch with us.
            </p>

            <div>
              <h2 className="text-base font-medium text-foreground">Customer Support</h2>
              <p className="mt-2">
                Our dedicated customer support team is here to assist you with any questions
                or concerns you may have. Please feel free to reach out to us via email:
              </p>
              <p className="mt-3">
                <a
                  href="mailto:houseofthazhuval@gmail.com"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  houseofthazhuval@gmail.com
                </a>
              </p>
              <p className="mt-3">
                Our customer support hours are <strong>9:00 AM &ndash; 6:30 PM</strong>,{" "}
                <strong>Monday &ndash; Saturday</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Business Inquiries</h2>
              <p className="mt-2">
                For business-related inquiries, collaborations, or partnership opportunities,
                please contact our business development team at{" "}
                <a href="mailto:houseofthazhuval@gmail.com" className="text-foreground underline underline-offset-4">
                  houseofthazhuval@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-foreground">Feedback</h2>
              <p className="mt-2">
                We appreciate your feedback, and it helps us improve our products and services.
                If you have any suggestions or comments, please send them to{" "}
                <a href="mailto:houseofthazhuval@gmail.com" className="text-foreground underline underline-offset-4">
                  houseofthazhuval@gmail.com
                </a>
              </p>
            </div>

            <p>
              We look forward to hearing from you and assisting you in any way we can. Your
              satisfaction is our priority at House of Thazhuval.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
