import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"

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
    default: "Thazhuval — The Art of the Embrace",
    template: "%s · Thazhuval",
  },
  description:
    "House of Thazhuval. Heirloom sarees, hand-woven by master artisans. Silk, Cotton and Heritage weaves — each a quiet embrace.",
  openGraph: {
    title: "Thazhuval — The Art of the Embrace",
    description:
      "Heirloom sarees, hand-woven by master artisans. Silk, Cotton and Heritage weaves.",
    type: "website",
    url: "https://thazhuval.com",
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
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
