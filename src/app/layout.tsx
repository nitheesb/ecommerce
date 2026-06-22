import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { absoluteUrl, cn, SITE_URL } from "@/lib/utils"
import { SnipcartProvider } from "@/components/snipcart-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientOverlays } from "@/components/client-overlays"
import { PageTransition } from "@/components/page-transition"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "House of Thazhuval",
  title: {
    default: "House of Thazhuval — More Than a Saree, It's an Embrace",
    template: "%s · Thazhuval",
  },
  description:
    "House of Thazhuval. More than a saree — it's an embrace. Soft fabrics, thoughtful craftsmanship, pieces that hold you.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "House of Thazhuval — More Than a Saree, It's an Embrace",
    description:
      "Thazhuval means 'embrace'. Soft fabrics, thoughtful craftsmanship, sarees that hold you.",
    type: "website",
    url: SITE_URL,
    siteName: "House of Thazhuval",
    locale: "en_IN",
    images: [
      {
        url: "/images/cover-test-2.jpg",
        width: 2048,
        height: 1152,
        alt: "House of Thazhuval saree collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Thazhuval — More Than a Saree, It's an Embrace",
    description: "Thoughtfully crafted sarees designed to feel like an embrace.",
    images: ["/images/cover-test-2.jpg"],
  },
  authors: [{ name: "House of Thazhuval", url: SITE_URL }],
  creator: "House of Thazhuval",
  publisher: "House of Thazhuval",
  category: "Fashion and apparel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Thazhuval",
    "House of Thazhuval",
    "saree",
    "silk saree",
    "kanjeevaram",
    "banarasi",
    "handloom",
    "heritage saree",
  ],
}

export const viewport: Viewport = {
  themeColor: "#FBF8F1",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "House of Thazhuval",
      url: SITE_URL,
      logo: absoluteUrl("/images/logo-02.png"),
      description:
        "Thoughtfully crafted sarees designed to feel like an embrace.",
      email: "houseofthazhuval@gmail.com",
      sameAs: ["https://instagram.com/houseofthazhuval"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "houseofthazhuval@gmail.com",
        availableLanguage: ["English"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "House of Thazhuval",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/search")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ]

  return (
    <html
      lang="en"
      className={cn(
        playfair.variable,
        inter.variable,
        "bg-background antialiased"
      )}
    >
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background focus:outline-none"
        >
          Skip to content
        </a>
        <ClientOverlays />
        <PageTransition>{children}</PageTransition>
        <SnipcartProvider />
        <Toaster />
      </body>
    </html>
  )
}
