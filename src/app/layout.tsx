import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
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
  metadataBase: new URL("https://thazhuval.com"),
  title: {
    default: "House of Thazhuval — More Than a Saree, It's an Embrace",
    template: "%s · Thazhuval",
  },
  description:
    "House of Thazhuval. More than a saree — it's an embrace. Soft fabrics, thoughtful craftsmanship, pieces that hold you.",
  openGraph: {
    title: "House of Thazhuval — More Than a Saree, It's an Embrace",
    description:
      "Thazhuval means 'embrace'. Soft fabrics, thoughtful craftsmanship, sarees that hold you.",
    type: "website",
    url: "https://thazhuval.com",
  },
  authors: [{ name: "nitheesbalaji" }],
  creator: "nitheesbalaji",
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
      url: "https://thazhuval.com",
      email: "houseofthazhuval@gmail.com",
      sameAs: ["https://instagram.com/houseofthazhuval"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "House of Thazhuval",
      url: "https://thazhuval.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://thazhuval.com/search?q={search_term_string}",
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
