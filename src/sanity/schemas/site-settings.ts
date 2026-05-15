import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "commerce", title: "Commerce" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social" },
    { name: "legal", title: "Legal" },
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
      name: "announcementEnabled",
      title: "Show Announcement Bar",
      type: "boolean",
      group: "commerce",
      initialValue: true,
    }),
    defineField({
      name: "announcementLink",
      title: "Announcement Link",
      type: "url",
      group: "commerce",
      description: "Optional URL for the announcement bar.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "currency",
      title: "Store Currency",
      type: "string",
      group: "commerce",
      initialValue: "INR",
      options: {
        list: [
          { title: "Indian Rupee (INR)", value: "INR" },
          { title: "US Dollar (USD)", value: "USD" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "freeShippingThreshold",
      title: "Free Shipping Threshold",
      type: "number",
      group: "commerce",
      description: "Amount in store currency. Example: 2000 for ₹2,000.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "shippingLeadTime",
      title: "Shipping Lead Time",
      type: "string",
      group: "commerce",
      description: "Example: Ships in 2-4 business days.",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "returnWindowHours",
      title: "Return Window (Hours)",
      type: "number",
      group: "commerce",
      description: "Example: 48 for a 48-hour return reporting window.",
      validation: (Rule) => Rule.integer().min(0).max(720),
    }),
    defineField({
      name: "publicEmail",
      title: "Public Support Email",
      type: "string",
      group: "contact",
      validation: (Rule) =>
        Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email address",
          invert: false,
        }),
    }),
    defineField({
      name: "supportPhone",
      title: "WhatsApp Support Number",
      type: "string",
      group: "contact",
      description: "Use international format without spaces, for example 919585628565.",
      validation: (Rule) =>
        Rule.regex(/^\d{10,15}$/, {
          name: "international phone number",
          invert: false,
        }).warning("Use digits only, including country code."),
    }),
    defineField({
      name: "whatsappDefaultMessage",
      title: "WhatsApp Default Message",
      type: "string",
      group: "contact",
      description: "Starter message used by product enquiry links.",
      validation: (Rule) => Rule.max(180),
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
    defineField({
      name: "businessName",
      title: "Legal Business Name",
      type: "string",
      group: "legal",
      description: "Shown in invoices/policies once checkout is connected.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "businessAddress",
      title: "Business Address",
      type: "text",
      rows: 3,
      group: "legal",
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: "policyLastUpdated",
      title: "Policy Last Updated",
      type: "date",
      group: "legal",
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
