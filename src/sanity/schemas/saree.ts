import { defineField, defineType } from "sanity";

const imageWithAltFields = [
  defineField({
    name: "alt",
    title: "Alt Text",
    type: "string",
    description: "Describe the image for accessibility and SEO.",
    validation: (Rule) =>
      Rule.max(140).warning("Keep alt text short and descriptive."),
  }),
];

const hexColorValidation = (Rule: any) =>
  Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    name: "hex color",
    invert: false,
  }).warning("Use a hex colour such as #667313.");

export const sareeSchema = defineType({
  name: "saree",
  title: "Saree",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "merchandising", title: "Merchandising" },
    { name: "inventory", title: "Inventory" },
    { name: "seo", title: "SEO" },
    { name: "admin", title: "Admin" },
  ],
  orderings: [
    {
      title: "Manual Sort",
      name: "manualSort",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Price: Low to High",
      name: "priceLowToHigh",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
  initialValue: {
    status: "draft",
    stockStatus: "inStock",
    stockQuantity: 1,
    blouseIncluded: true,
    careInstructions: "Dry clean recommended.",
    featured: false,
    sortOrder: 100,
    variants: [],
  },
  fields: [
    defineField({
      name: "title",
      title: "Product Name",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required().min(2).max(80).error("Product name is required."),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "content",
      description: "Used in the product URL. Generate from the product name, then keep stable.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Card Description",
      type: "string",
      group: "content",
      description: "Optional short line for future cards, ads, and quick previews.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "text",
      rows: 4,
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .min(40)
          .max(420)
          .warning("Aim for 40-420 characters for a polished product detail page."),
    }),
    defineField({
      name: "highlights",
      title: "Product Highlights",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description: "Short bullets such as 'Lightweight chiffon' or 'Ready to ship'.",
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "category",
      title: "Primary Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Silk", value: "Silk" },
          { title: "Cotton", value: "Cotton" },
          { title: "Heritage", value: "Heritage" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fabric",
      title: "Fabric",
      type: "string",
      group: "content",
      options: {
        list: [
          "Chiffon",
          "Cotton",
          "Crepe",
          "Georgette",
          "Handloom Cotton",
          "Linen",
          "Modal",
          "Organza",
          "Raw Silk",
          "Silk Cotton",
          "Soft Silk",
          "Tussar",
        ],
      },
    }),
    defineField({
      name: "weaveType",
      title: "Weave Type",
      type: "string",
      group: "content",
      options: {
        list: [
          "Kanjeevaram",
          "Banarasi",
          "Chanderi",
          "Raw Silk",
          "Tussar",
          "Handloom",
          "Khadi",
          "Jamdani",
          "Chettinad",
          "Linen Blend",
          "Patola",
          "Paithani",
          "Bridal",
          "Bespoke",
        ],
      },
    }),
    defineField({
      name: "collection",
      title: "Collection / Edit Name",
      type: "string",
      group: "content",
      description: "Shown on cards, filters, product detail pages, and search results.",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "printType",
      title: "Print Type",
      type: "string",
      group: "content",
      options: {
        list: [
          "Ajrakh Print",
          "Bagru Print",
          "Bandhani",
          "Batik Print",
          "Dabu Print",
          "Digital Print",
          "Floral Print",
          "Geometric Print",
          "Kalamkari",
          "Leheriya",
          "Pochampally Ikat",
          "Sanganeri Print",
          "Solid",
        ],
      },
    }),
    defineField({
      name: "occasion",
      title: "Occasion",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Dailywear", value: "Dailywear" },
          { title: "Festive", value: "Festive" },
          { title: "Bridal", value: "Bridal" },
          { title: "Office", value: "Office" },
          { title: "Party", value: "Party" },
          { title: "Gifting", value: "Gifting" },
        ],
      },
    }),
    defineField({
      name: "colorFamily",
      title: "Color Family",
      type: "string",
      group: "content",
      options: {
        list: [
          "Black",
          "Blue",
          "Brown",
          "Cream",
          "Gold",
          "Green",
          "Grey",
          "Ivory",
          "Maroon",
          "Mustard",
          "Orange",
          "Pink",
          "Purple",
          "Red",
          "Teal",
          "White",
          "Yellow",
        ],
      },
    }),
    defineField({
      name: "mainImage",
      title: "Main Product Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: imageWithAltFields,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hoverImage",
      title: "Hover / Detail Image",
      type: "image",
      group: "media",
      description: "Used as product-card hover image and gallery secondary image.",
      options: { hotspot: true },
      fields: imageWithAltFields,
    }),
    defineField({
      name: "imageGallery",
      title: "Product Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: imageWithAltFields,
        },
      ],
      validation: (Rule) => Rule.max(10).warning("Keep galleries focused; 3-6 images is ideal."),
    }),
    defineField({
      name: "price",
      title: "Price (INR)",
      type: "number",
      group: "merchandising",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price (INR)",
      type: "number",
      group: "merchandising",
      validation: (Rule) =>
        Rule.positive().custom((compareAtPrice, context) => {
          const price = (context.document?.price ?? 0) as number;
          if (!compareAtPrice || !price) return true;
          return compareAtPrice > price || "Compare-at price should be greater than the selling price.";
        }),
    }),
    defineField({
      name: "badge",
      title: "Product Badge",
      type: "string",
      group: "merchandising",
      options: {
        list: [
          { title: "Limited Edition", value: "Limited Edition" },
          { title: "New", value: "New" },
          { title: "Bestseller", value: "Bestseller" },
          { title: "Heritage", value: "Heritage" },
        ],
      },
    }),
    defineField({
      name: "palette",
      title: "Palette Colors",
      type: "array",
      group: "merchandising",
      of: [
        defineField({
          name: "color",
          title: "Hex Color",
          type: "string",
          validation: hexColorValidation,
        }),
      ],
      description: "Hex color values for product card swatches.",
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      group: "merchandising",
    }),
    defineField({
      name: "sortOrder",
      title: "Manual Sort Order",
      type: "number",
      group: "merchandising",
      description: "Lower numbers appear earlier in featured and collection lists.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "status",
      title: "Publishing Status",
      type: "string",
      group: "inventory",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sku",
      title: "Base SKU",
      type: "string",
      group: "inventory",
      description: "Internal product code used when there are no separate variants.",
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "stockStatus",
      title: "Stock Status",
      type: "string",
      group: "inventory",
      options: {
        list: [
          { title: "In stock", value: "inStock" },
          { title: "Low stock", value: "lowStock" },
          { title: "Made to order", value: "madeToOrder" },
          { title: "Out of stock", value: "outOfStock" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      group: "inventory",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "blouseIncluded",
      title: "Blouse Piece Included",
      type: "boolean",
      group: "inventory",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "text",
      rows: 3,
      group: "inventory",
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      group: "inventory",
      description: "Use variants only when colour/size/SKU/stock differs.",
      of: [
        {
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: "color",
              title: "Color Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "colorHex",
              title: "Color Hex",
              type: "string",
              validation: hexColorValidation,
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
            }),
            defineField({
              name: "price",
              title: "Price (INR)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare-at Price (INR)",
              type: "number",
              validation: (Rule) => Rule.positive(),
            }),
            defineField({
              name: "stockQuantity",
              title: "Stock Quantity",
              type: "number",
              validation: (Rule) => Rule.required().integer().min(0),
            }),
            defineField({
              name: "image",
              title: "Variant Image",
              type: "image",
              options: { hotspot: true },
              fields: imageWithAltFields,
            }),
          ],
          preview: {
            select: {
              title: "color",
              subtitle: "sku",
              media: "image",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Variant",
                subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning("Search titles usually perform best under 60 characters."),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning("Search descriptions usually perform best under 160 characters."),
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          options: { hotspot: true },
          fields: imageWithAltFields,
        }),
      ],
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
      group: "admin",
      description: "Private notes for the team. Not shown on the website.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      price: "price",
      stockStatus: "stockStatus",
      media: "mainImage",
    },
    prepare({ title, status, price, stockStatus, media }) {
      const formattedPrice =
        typeof price === "number"
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(price)
          : "No price";

      return {
        title: title ?? "Untitled saree",
        subtitle: `${status ?? "draft"} · ${stockStatus ?? "stock unknown"} · ${formattedPrice}`,
        media,
      };
    },
  },
});
