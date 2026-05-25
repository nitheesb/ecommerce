export type Product = {
  id: string
  slug: string
  name: string
  collection: string
  category: "None" | "Silk" | "Cotton" | "Heritage" | "Designer"
  status?: "draft" | "active" | "archived"
  fabric?: string
  colorFamily?: string
  price: number
  compareAt?: number
  image: string
  hoverImage: string
  detailImage?: string
  badge?: "Limited Edition" | "New" | "Bestseller" | "Heritage"
  stockStatus?: "inStock" | "lowStock" | "madeToOrder" | "outOfStock"
  stockQuantity?: number
  palette: string[]
  description: string
}

function normalizeText(value: string) {
  return value.toLowerCase().trim()
}

function tokenizeSlug(slug: string) {
  return normalizeText(slug)
    .split("-")
    .filter(Boolean)
}

function getSearchableText(product: Product) {
  return [
    product.name,
    product.slug,
    product.collection,
    product.category === "None" ? "" : product.category,
    product.fabric ?? "",
    product.badge ?? "",
    product.description,
  ]
    .join(" ")
    .toLowerCase()
}

export function getVisibleProducts(products: Product[]) {
  return products.filter((product) => product.status !== "draft" && product.status !== "archived")
}

export function searchProducts(products: Product[], query: string) {
  const trimmedQuery = normalizeText(query)
  if (!trimmedQuery) return products

  const terms = trimmedQuery.split(/\s+/).filter(Boolean)

  return products.filter((product) => {
    const haystack = getSearchableText(product)
    return terms.every((term) => haystack.includes(term))
  })
}

export function filterProductsByCollectionSlug(products: Product[], slug: string) {
  const normalizedSlug = normalizeText(slug)

  switch (normalizedSlug) {
    case "all-sarees":
    case "sarees":
      return products
    case "best-sellers":
      return products.filter((product) => product.badge === "Bestseller")
    case "new-arrivals":
      return products.filter((product) => product.badge === "New")
    case "prints":
      return products.filter((product) =>
        /print|geometric|leopard|ikat|pattern/i.test(getSearchableText(product)),
      )
    case "by-colour":
      return products
    case "cotton":
      return products.filter((product) => product.category === "Cotton")
    case "silk":
      return products.filter((product) => product.category === "Silk")
    case "banana-silk":
      return products.filter((product) => product.fabric === "Banana Silk")
    case "heritage":
      return products.filter((product) => product.category === "Heritage")
    case "designer":
      return products.filter((product) => product.category === "Designer")
    case "dailywear":
      return products.filter((product) => product.category === "Cotton" || product.price < 15000)
    case "festive":
      return products.filter(
        (product) =>
          product.category === "Silk" ||
          product.category === "Heritage" ||
          product.category === "Designer" ||
          product.price >= 15000,
      )
    default: {
      const slugTerms = tokenizeSlug(normalizedSlug)
      if (slugTerms.length === 0) return []

      return products.filter((product) => {
        const haystack = getSearchableText(product)
        return slugTerms.every((term) => haystack.includes(term))
      })
    }
  }
}

export type ProductCategory = Product["category"]

export const products: Product[] = [
  {
    id: "p1",
    slug: "leela-leopard-print-saree",
    name: "Leela",
    collection: "Leopard Print",
    category: "Heritage",
    price: 18500,
    compareAt: 21000,
    image: "/images/client/01-leopard-print-2.webp",
    hoverImage: "/images/client/02-mustard-geometric-print-saree.webp",
    badge: "Limited Edition",
    palette: ["#2f2924", "#d8bf98"],
    description:
      "A statement leopard print saree with an earthy drape, styled for a modern editorial mood.",
  },
  {
    id: "p2",
    slug: "maira-mustard-geometric-weave",
    name: "Maira",
    collection: "Geometric Print",
    category: "Cotton",
    price: 9800,
    image: "/images/client/03-mustard-geometrical-weave.webp",
    hoverImage: "/images/client/04-navy-and-red-geometric-weave.webp",
    badge: "New",
    palette: ["#a0672c", "#14a5b2"],
    description:
      "A mustard geometric weave with bright motif work, easy to place in festive or dailywear edits.",
  },
  {
    id: "p3",
    slug: "nilaa-navy-red-geometric-saree",
    name: "Nilaa",
    collection: "Navy Geometric",
    category: "Silk",
    price: 16400,
    image: "/images/client/06-oilve-green-saree-2.webp",
    hoverImage: "/images/client/05-navy-red-geometric.webp",
    badge: "Bestseller",
    palette: ["#221f4c", "#c62828"],
    description:
      "A navy and red geometric saree with a bold print language, made for confident evening styling.",
  },
  {
    id: "p4",
    slug: "oviya-olive-green-saree",
    name: "Oviya",
    collection: "Olive Green",
    category: "Silk",
    price: 12800,
    image: "/images/client/08-olive-green.webp",
    hoverImage: "/images/client/09-pink-saree-1.webp",
    badge: "Heritage",
    palette: ["#667313", "#d4bd87"],
    description:
      "A rich olive green saree with a composed fall, ideal for colour-led catalogue browsing.",
  },
  {
    id: "p5",
    slug: "ira-pink-chiffon-saree",
    name: "Ira",
    collection: "Pink Chiffon",
    category: "Silk",
    price: 11200,
    image: "/images/client/10-pink-saree.webp",
    hoverImage: "/images/client/11-puple-chiffon.webp",
    palette: ["#d78aad", "#f1c4c8"],
    description:
      "A soft pink chiffon saree with a light, romantic drape for intimate celebrations.",
  },
  {
    id: "p6",
    slug: "vaidehi-purple-chiffon-saree",
    name: "Vaidehi",
    collection: "Purple Chiffon",
    category: "Silk",
    price: 12400,
    image: "/images/client/12-purple-chiffon.webp",
    hoverImage: "/images/client/13-purple-saree-2.webp",
    badge: "New",
    palette: ["#58105d", "#c442c7"],
    description:
      "A deep purple chiffon saree with a fluid silhouette, designed for evening and festive styling.",
  },
  {
    id: "p7",
    slug: "raga-red-chiffon-saree",
    name: "Raga",
    collection: "Red Chiffon",
    category: "Heritage",
    price: 14200,
    image: "/images/client/18-red-chiffon.webp",
    hoverImage: "/images/client/17-red-chiffon-saree.webp",
    badge: "Limited Edition",
    palette: ["#d40713", "#7a0b12"],
    description:
      "A luminous red chiffon saree with a dramatic sweep, perfect for bridal-adjacent and festive edits.",
  },
  {
    id: "p8",
    slug: "tara-teal-green-drape",
    name: "Tara",
    collection: "Teal Green",
    category: "Cotton",
    status: "archived",
    stockStatus: "outOfStock",
    stockQuantity: 0,
    price: 10800,
    image: "/images/client/20-teal-green-2.webp",
    hoverImage: "/images/client/19-teal-green-1.webp",
    palette: ["#6e7565", "#d7cec0"],
    description:
      "A muted teal green drape with a soft everyday feel, styled for warm natural light.",
  },
]

export const categories = [
  {
    title: "Sarees",
    blurb: "All sarees, Best sellers, New arrivals",
    href: "/collections/sarees",
    items: [
      { label: "All Sarees", href: "/collections/all-sarees" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Cotton", href: "/collections/cotton" },
      { label: "Linen", href: "/collections/linen" },
      { label: "Modal", href: "/collections/modal" },
      { label: "Silk", href: "/collections/silk" },
      { label: "Banana Silk", href: "/collections/banana-silk" },
      { label: "Soft Silks", href: "/collections/soft-silks" },
      { label: "Tussar", href: "/collections/tussar" },
      { label: "Silk Cotton", href: "/collections/silk-cotton" },
      { label: "Designer", href: "/collections/designer" },
      { label: "Crepe", href: "/collections/crepe" },
      { label: "Chiffon", href: "/collections/chiffon" },
      { label: "Organza", href: "/collections/organza" },
      { label: "Georgette", href: "/collections/georgette" },
    ],
  },
  {
    title: "Shop by Prints",
    blurb: "Ajrakh, Bagru, Kalamkari & more",
    href: "/collections/prints",
    items: [
      { label: "Ajrakh Print", href: "/collections/ajrakh-print" },
      { label: "Bagru Print", href: "/collections/bagru-print" },
      { label: "Sanganeri Print", href: "/collections/sanganeri-print" },
      { label: "Dabu Print", href: "/collections/dabu-print" },
      { label: "Kalamkari", href: "/collections/kalamkari" },
      { label: "Bandhani", href: "/collections/bandhani" },
      { label: "Batik Print", href: "/collections/batik-print" },
      { label: "Leheriya", href: "/collections/leheriya" },
      { label: "Pochampally Ikat", href: "/collections/pochampally-ikat" },
      { label: "Floral Prints", href: "/collections/floral-prints" },
      { label: "Geometric Prints", href: "/collections/geometric-prints" },
      { label: "Digital Prints", href: "/collections/digital-prints" },
    ],
  },
  {
    title: "Shop by Occasion",
    blurb: "Dailywear, Festive",
    href: "/collections/occasion",
    items: [
      { label: "Dailywear", href: "/collections/dailywear" },
      { label: "Festive", href: "/collections/festive" },
    ],
  },
  {
    title: "Shop by Colors",
    blurb: "Curated by colour",
    href: "/collections/by-colour",
    items: [
      { label: "Black", href: "/collections/black" },
      { label: "Blue", href: "/collections/blue" },
      { label: "Cream", href: "/collections/cream" },
      { label: "Green", href: "/collections/green" },
      { label: "Grey", href: "/collections/grey" },
      { label: "Ivory", href: "/collections/ivory" },
      { label: "Maroon", href: "/collections/maroon" },
      { label: "Mustard", href: "/collections/mustard" },
      { label: "Olive Green", href: "/collections/olive-green" },
      { label: "Peach", href: "/collections/peach" },
      { label: "Pink", href: "/collections/pink" },
      { label: "Purple", href: "/collections/purple" },
      { label: "Red", href: "/collections/red" },
      { label: "Violet", href: "/collections/violet" },
      { label: "White", href: "/collections/white" },
      { label: "Yellow", href: "/collections/yellow" },
    ],
  },
] as const
