import { defineField, defineType } from "sanity";

export const sareeSchema = defineType({
  name: "saree",
  title: "Saree",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
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
      name: "weaveType",
      title: "Weave Type",
      type: "string",
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
      title: "Collection",
      type: "string",
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hoverImage",
      title: "Hover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageGallery",
      title: "Image Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
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
      name: "badge",
      title: "Badge",
      type: "string",
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
      of: [{ type: "string" }],
      description: "Hex color values for product card swatches",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
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
              validation: (Rule) => Rule.required(),
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
              validation: (Rule) => Rule.required(),
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
            }),
            defineField({
              name: "stockQuantity",
              title: "Stock Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "image",
              title: "Variant Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "color", subtitle: "sku" },
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "mainImage",
    },
  },
});
