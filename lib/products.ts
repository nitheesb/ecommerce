export type Product = {
  id: string
  slug: string
  name: string
  collection: string
  category: "Silk" | "Cotton" | "Heritage"
  price: number
  compareAt?: number
  image: string
  hoverImage: string
  badge?: "Limited Edition" | "New" | "Bestseller" | "Heritage"
  palette: string[]
  description: string
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "meenakshi-maroon-kanjeevaram",
    name: "Meenakshi",
    collection: "Kanjeevaram",
    category: "Silk",
    price: 38500,
    compareAt: 42000,
    image: "/images/saree-1-a.jpg",
    hoverImage: "/images/saree-1-b.jpg",
    badge: "Limited Edition",
    palette: ["#6b1d2a", "#c9a24a"],
    description:
      "A ceremonial Kanjeevaram in deep maroon, hand-woven with a pure zari peacock pallu.",
  },
  {
    id: "p2",
    slug: "vanya-sage-cotton",
    name: "Vanya",
    collection: "Handloom",
    category: "Cotton",
    price: 8900,
    image: "/images/saree-2-a.jpg",
    hoverImage: "/images/saree-2-b.jpg",
    badge: "New",
    palette: ["#b9c7a9", "#d9c79b"],
    description:
      "A whisper-soft handloom cotton in sage, finished with an understated temple border.",
  },
  {
    id: "p3",
    slug: "nilambari-banarasi",
    name: "Nilambari",
    collection: "Banarasi",
    category: "Silk",
    price: 46800,
    image: "/images/saree-3-a.jpg",
    hoverImage: "/images/saree-3-b.jpg",
    badge: "Bestseller",
    palette: ["#1a2340", "#c9c2a4"],
    description:
      "Midnight Banarasi silk with antique silver zari, meant for evenings of quiet drama.",
  },
  {
    id: "p4",
    slug: "anaika-bridal-kanjeevaram",
    name: "Anaika",
    collection: "Bridal",
    category: "Heritage",
    price: 84500,
    image: "/images/saree-4-a.jpg",
    hoverImage: "/images/saree-4-b.jpg",
    badge: "Heritage",
    palette: ["#efe3c7", "#b08a3e"],
    description:
      "An ivory bridal Kanjeevaram weighted with 22k plated zari mango motifs on the pallu.",
  },
  {
    id: "p5",
    slug: "shivangi-blush-chanderi",
    name: "Shivangi",
    collection: "Chanderi",
    category: "Silk",
    price: 16400,
    image: "/images/saree-5-a.jpg",
    hoverImage: "/images/saree-5-b.jpg",
    palette: ["#e9c8c4", "#c8b68a"],
    description:
      "Blush Chanderi silk with silver buttis, as light as morning mist on the shoulders.",
  },
  {
    id: "p6",
    slug: "bhoomi-rust-handloom",
    name: "Bhoomi",
    collection: "Handloom",
    category: "Cotton",
    price: 7400,
    image: "/images/saree-6-a.jpg",
    hoverImage: "/images/saree-6-b.jpg",
    badge: "New",
    palette: ["#a7562f", "#d6b892"],
    description:
      "An earth-dyed rust handloom with tribal geometry, made with naturally sourced cotton.",
  },
  {
    id: "p7",
    slug: "saanvi-emerald-patola",
    name: "Saanvi",
    collection: "Patola",
    category: "Heritage",
    price: 128000,
    image: "/images/saree-7-a.jpg",
    hoverImage: "/images/saree-7-b.jpg",
    badge: "Limited Edition",
    palette: ["#235a3a", "#e1d2a6"],
    description:
      "Double-ikat emerald Patola, woven over months by a single heritage atelier in Patan.",
  },
  {
    id: "p8",
    slug: "ira-slate-raw-silk",
    name: "Ira",
    collection: "Modern",
    category: "Silk",
    price: 22400,
    image: "/images/saree-8-a.jpg",
    hoverImage: "/images/saree-8-b.jpg",
    palette: ["#454a53", "#c59966"],
    description:
      "Matte raw silk in slate, kissed by a rose-gold selvedge for the quiet modernist.",
  },
]

export const categories = [
  {
    title: "Silk",
    blurb: "Kanjeevaram, Banarasi, Chanderi",
    href: "/collections/silk",
    items: [
      { label: "Kanjeevaram", href: "/collections/silk/kanjeevaram" },
      { label: "Banarasi", href: "/collections/silk/banarasi" },
      { label: "Chanderi", href: "/collections/silk/chanderi" },
      { label: "Raw Silk", href: "/collections/silk/raw" },
      { label: "Tussar", href: "/collections/silk/tussar" },
    ],
  },
  {
    title: "Cotton",
    blurb: "Handloom, Khadi, Linen blends",
    href: "/collections/cotton",
    items: [
      { label: "Handloom Cotton", href: "/collections/cotton/handloom" },
      { label: "Khadi", href: "/collections/cotton/khadi" },
      { label: "Jamdani", href: "/collections/cotton/jamdani" },
      { label: "Chettinad", href: "/collections/cotton/chettinad" },
      { label: "Linen Blend", href: "/collections/cotton/linen" },
    ],
  },
  {
    title: "Heritage",
    blurb: "Bridal, Patola, Archival weaves",
    href: "/collections/heritage",
    items: [
      { label: "Bridal Couture", href: "/collections/heritage/bridal" },
      { label: "Patola", href: "/collections/heritage/patola" },
      { label: "Paithani", href: "/collections/heritage/paithani" },
      { label: "The Archive", href: "/collections/heritage/archive" },
      { label: "Atelier Bespoke", href: "/collections/heritage/bespoke" },
    ],
  },
] as const
