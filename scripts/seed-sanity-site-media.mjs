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
  console.error("Missing SANITY_API_TOKEN in .env.local. Create a Sanity token with write access, then rerun this script.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const imageCache = new Map();

const chapters = [
  {
    _key: "chapter-where-it-begins",
    label: "Chapter I",
    title: "Where It Begins",
    image: "hero.jpg",
    alt: "Raw silk threads in golden light",
    text: "Every saree begins as a single thread — raw, humble, full of possibility. Sourced from the finest regions of India, each fibre carries the promise of something extraordinary.",
  },
  {
    _key: "chapter-hands-behind-the-weave",
    label: "Chapter II",
    title: "The Hands Behind the Weave",
    image: "editorial-2.jpg",
    alt: "Master weaver working on a traditional loom",
    text: "In the hands of master weavers, threads become poetry. Each pattern is a language passed down through generations — one shuttle, one row, one story at a time.",
  },
  {
    _key: "chapter-loom-to-life",
    label: "Chapter III",
    title: "From Loom to Life",
    image: "editorial-1.jpg",
    alt: "Saree fabric being finished by artisan hands",
    text: "Dyeing, finishing, folding — each step is guided by care, patience, and a deep love for the craft. No shortcuts, no compromises, just devotion to the art.",
  },
  {
    _key: "chapter-six-yards-belonging",
    label: "Chapter IV",
    title: "Six Yards of Belonging",
    image: "saree-4-a.jpg",
    alt: "Woman draped in an elegant Kanjeevaram saree",
    text: "More than a saree — it's an embrace. Six yards of comfort, tradition, and individuality. When you drape a Thazhuval, you carry a piece of someone's heart.",
  },
];

await client.createIfNotExists({
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "House of Thazhuval",
  tagline: "The comfort that embraces you",
});

const heroImage = await uploadPublicImage(
  "cover-test-2.jpg",
  "A woman in a saree styled in warm natural light",
);
const homepageStoryImage = await uploadPublicImage(
  "editorial-2.jpg",
  "Artisan weaver at a traditional handloom",
);
const weaveJourneyChapters = await Promise.all(
  chapters.map(async (chapter) => ({
    _key: chapter._key,
    _type: "chapter",
    label: chapter.label,
    title: chapter.title,
    text: chapter.text,
    image: await uploadPublicImage(chapter.image, chapter.alt),
  })),
);

await client
  .patch("siteSettings")
  .set({
    heroImage,
    homepageStoryImage,
    weaveJourneyChapters,
  })
  .commit({ autoGenerateArrayKeys: false });

console.log("Seeded editable hero, homepage story, and chapter images into Sanity siteSettings.");

async function uploadPublicImage(filename, alt) {
  if (imageCache.has(filename)) return imageCache.get(filename);

  const imagePath = path.join(rootDir, "public", "images", filename);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Missing image: ${imagePath}`);
  }

  const asset = await client.assets.upload("image", fs.createReadStream(imagePath), {
    filename,
  });
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
