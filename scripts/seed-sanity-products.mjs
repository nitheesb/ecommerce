import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

loadDotEnv(path.join(rootDir, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "njd3ihcc";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!token || token.startsWith("your-")) {
  console.error("Missing SANITY_API_TOKEN in .env.local. Create a Sanity token with write access, add it locally, then rerun npm run sanity:seed.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const products = [
  {
    id: "p1",
    name: "Leela",
    slug: "leela-leopard-print-saree",
    collection: "Leopard Print",
    category: "Heritage",
    fabric: "Chiffon",
    printType: "Digital Print",
    occasion: ["Party", "Festive"],
    colorFamily: "Brown",
    price: 18500,
    compareAtPrice: 21000,
    mainImage: "01-leopard-print-2.webp",
    hoverImage: "02-mustard-geometric-print-saree.webp",
    badge: "Limited Edition",
    palette: ["#2f2924", "#d8bf98"],
    stockQuantity: 2,
    highlights: ["Statement leopard print", "Lightweight festive drape", "Limited preview edit"],
    description: "A statement leopard print saree with an earthy drape, styled for a modern editorial mood.",
  },
  {
    id: "p2",
    name: "Maira",
    slug: "maira-mustard-geometric-weave",
    collection: "Geometric Print",
    category: "Cotton",
    fabric: "Handloom Cotton",
    printType: "Geometric Print",
    occasion: ["Dailywear", "Festive"],
    colorFamily: "Mustard",
    price: 9800,
    mainImage: "03-mustard-geometrical-weave.webp",
    hoverImage: "04-navy-and-red-geometric-weave.webp",
    badge: "New",
    palette: ["#a0672c", "#14a5b2"],
    stockQuantity: 6,
    highlights: ["Bold geometric motifs", "Comfort-led cotton styling", "Easy day-to-evening piece"],
    description: "A mustard geometric weave with bright motif work, easy to place in festive or dailywear edits.",
  },
  {
    id: "p3",
    name: "Nilaa",
    slug: "nilaa-navy-red-geometric-saree",
    collection: "Navy Geometric",
    category: "Silk",
    fabric: "Soft Silk",
    printType: "Geometric Print",
    occasion: ["Festive", "Party"],
    colorFamily: "Blue",
    price: 16400,
    mainImage: "06-oilve-green-saree-2.webp",
    hoverImage: "05-navy-red-geometric.webp",
    badge: "Bestseller",
    palette: ["#221f4c", "#c62828"],
    stockQuantity: 4,
    highlights: ["Bold print language", "Mirror-shot styling reference", "Strong evening mood"],
    description: "A navy and red geometric saree with a bold print language, made for confident evening styling.",
  },
  {
    id: "p4",
    name: "Oviya",
    slug: "oviya-olive-green-saree",
    collection: "Olive Green",
    category: "Silk",
    fabric: "Soft Silk",
    printType: "Solid",
    occasion: ["Festive", "Office"],
    colorFamily: "Green",
    price: 12800,
    mainImage: "08-olive-green.webp",
    hoverImage: "09-pink-saree-1.webp",
    badge: "Heritage",
    palette: ["#667313", "#d4bd87"],
    stockQuantity: 5,
    highlights: ["Rich olive tone", "Warm interior styling", "Elegant everyday-festive crossover"],
    description: "A rich olive green saree with a composed fall, ideal for colour-led catalogue browsing.",
  },
  {
    id: "p5",
    name: "Ira",
    slug: "ira-pink-chiffon-saree",
    collection: "Pink Chiffon",
    category: "Silk",
    fabric: "Chiffon",
    printType: "Solid",
    occasion: ["Gifting", "Festive"],
    colorFamily: "Pink",
    price: 11200,
    mainImage: "10-pink-saree.webp",
    hoverImage: "11-puple-chiffon.webp",
    palette: ["#d78aad", "#f1c4c8"],
    stockQuantity: 7,
    highlights: ["Soft romantic colour", "Light chiffon fall", "Ideal for intimate celebrations"],
    description: "A soft pink chiffon saree with a light, romantic drape for intimate celebrations.",
  },
  {
    id: "p6",
    name: "Vaidehi",
    slug: "vaidehi-purple-chiffon-saree",
    collection: "Purple Chiffon",
    category: "Silk",
    fabric: "Chiffon",
    printType: "Solid",
    occasion: ["Party", "Festive"],
    colorFamily: "Purple",
    price: 12400,
    mainImage: "12-purple-chiffon.webp",
    hoverImage: "13-purple-saree-2.webp",
    badge: "New",
    palette: ["#58105d", "#c442c7"],
    stockQuantity: 3,
    highlights: ["Deep purple evening tone", "Fluid chiffon silhouette", "Detail image for fabric confidence"],
    description: "A deep purple chiffon saree with a fluid silhouette, designed for evening and festive styling.",
  },
  {
    id: "p7",
    name: "Raga",
    slug: "raga-red-chiffon-saree",
    collection: "Red Chiffon",
    category: "Heritage",
    fabric: "Chiffon",
    printType: "Solid",
    occasion: ["Bridal", "Festive"],
    colorFamily: "Red",
    price: 14200,
    mainImage: "18-red-chiffon.webp",
    hoverImage: "17-red-chiffon-saree.webp",
    badge: "Limited Edition",
    palette: ["#d40713", "#7a0b12"],
    stockQuantity: 2,
    highlights: ["Luminous red tone", "Dramatic festive sweep", "Bridal-adjacent styling"],
    description: "A luminous red chiffon saree with a dramatic sweep, perfect for bridal-adjacent and festive edits.",
  },
  {
    id: "p8",
    name: "Tara",
    slug: "tara-teal-green-drape",
    collection: "Teal Green",
    category: "Cotton",
    fabric: "Cotton",
    printType: "Solid",
    occasion: ["Dailywear", "Office"],
    colorFamily: "Teal",
    price: 10800,
    mainImage: "20-teal-green-2.webp",
    hoverImage: "19-teal-green-1.webp",
    palette: ["#6e7565", "#d7cec0"],
    stockQuantity: 8,
    highlights: ["Muted teal everyday mood", "Warm natural-light styling", "Comfort-first drape"],
    description: "A muted teal green drape with a soft everyday feel, styled for warm natural light.",
  },
];

const imageCache = new Map();

for (const [index, product] of products.entries()) {
  const documentId = `saree.${product.slug}`;
  const existing = await client.getDocument(documentId);

  const mainImage = existing?.mainImage ?? await uploadImage(product.mainImage, `${product.name} main image`);
  const hoverImage = existing?.hoverImage ?? await uploadImage(product.hoverImage, `${product.name} hover image`);

  const doc = {
    _id: documentId,
    _type: "saree",
    title: product.name,
    slug: { _type: "slug", current: product.slug },
    shortDescription: product.highlights[0],
    description: product.description,
    status: "active",
    sku: `THZ-${String(index + 1).padStart(3, "0")}`,
    category: product.category,
    fabric: product.fabric,
    collection: product.collection,
    printType: product.printType,
    occasion: product.occasion,
    colorFamily: product.colorFamily,
    mainImage,
    hoverImage,
    imageGallery: [hoverImage],
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    badge: product.badge,
    palette: product.palette,
    stockStatus: product.stockQuantity <= 3 ? "lowStock" : "inStock",
    stockQuantity: product.stockQuantity,
    blouseIncluded: true,
    careInstructions: "Dry clean recommended.",
    featured: index < 4,
    sortOrder: (index + 1) * 10,
    contentStatus: "approved",
    highlights: product.highlights,
    variants: [],
    seo: {
      metaTitle: `${product.name} ${product.collection} Saree`,
      metaDescription: product.description,
      ogImage: mainImage,
    },
  };

  await client.createOrReplace(doc);
  console.log(`Seeded ${product.name} (${product.slug})`);
}

await client.createOrReplace({
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "House of Thazhuval",
  tagline: "The comfort that embraces you",
  announcement: "Complimentary shipping on orders above ₹2,000",
  announcementEnabled: true,
  currency: "INR",
  freeShippingThreshold: 2000,
  shippingLeadTime: "Ships in 2-4 business days.",
  returnWindowHours: 48,
  publicEmail: "houseofthazhuval@gmail.com",
  supportPhone: "919585628565",
  whatsappDefaultMessage: "Hi, I need help with House of Thazhuval.",
  shippingNote: "Complimentary shipping above ₹2,000 and support throughout delivery.",
  defaultSeo: {
    metaTitle: "House of Thazhuval",
    metaDescription: "Sarees chosen for the way the house wants to be remembered.",
  },
  socialLinks: [],
});
console.log("Seeded site settings");

const total = await client.fetch('count(*[_type == "saree"])');
console.log(`Done. Sanity now has ${total} saree document(s).`);

async function uploadImage(filename, alt) {
  if (imageCache.has(filename)) return imageCache.get(filename);

  const imagePath = path.join(rootDir, "public", "images", "client", filename);
  const asset = await client.assets.upload("image", fs.createReadStream(imagePath), { filename });
  const image = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt,
  };

  imageCache.set(filename, image);
  return image;
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
