import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "commerce", title: "Commerce" },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      group: "brand",
      initialValue: "House of Thazhuval",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "brand",
      initialValue: "The comfort that embraces you",
      validation: (Rule) => Rule.max(90),
    }),
    defineField({
      name: "announcement",
      title: "Announcement Bar Text",
      type: "string",
      group: "commerce",
      description: "Short message for shipping, drops, or launch updates.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "supportPhone",
      title: "WhatsApp Support Number",
      type: "string",
      group: "commerce",
      description: "Use international format without spaces, for example 919585628565.",
      validation: (Rule) =>
        Rule.regex(/^\d{10,15}$/, {
          name: "international phone number",
          invert: false,
        }).warning("Use digits only, including country code."),
    }),
    defineField({
      name: "shippingNote",
      title: "Shipping Note",
      type: "string",
      group: "commerce",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Default Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "Default Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "Default Social Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.max(140),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global brand, commerce, and SEO settings",
      };
    },
  },
});
