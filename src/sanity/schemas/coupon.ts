import { defineField, defineType } from "sanity";

const categoryOptions = ["Silk", "Cotton", "Heritage", "Designer"];

export const couponSchema = defineType({
  name: "coupon",
  title: "Discount Code",
  type: "document",
  groups: [
    { name: "discount", title: "Discount", default: true },
    { name: "eligibility", title: "Eligibility" },
    { name: "limits", title: "Schedule & Limits" },
  ],
  fields: [
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      group: "discount",
      description: "Customers enter this code at checkout. Use uppercase letters, numbers, hyphens, or underscores.",
      validation: (Rule) =>
        Rule.required()
          .max(40)
          .regex(/^[A-Z0-9_-]+$/, { name: "coupon code" })
          .custom(async (value, context) => {
            if (!value) return true;
            const documentId = String(context.document?._id ?? "").replace(/^drafts\./, "");
            const client = context.getClient({ apiVersion: "2024-01-01" });
            const duplicateCount = await client.fetch<number>(
              `count(*[_type == "coupon" && code == $code && !(_id in [$publishedId, $draftId])])`,
              { code: value, publishedId: documentId, draftId: `drafts.${documentId}` },
            );
            return duplicateCount === 0 || "This coupon code already exists.";
          }),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      group: "discount",
      initialValue: true,
      description: "Turn this off to stop the code immediately without deleting it.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      group: "discount",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Fixed amount (INR)", value: "fixed" },
        ],
        layout: "radio",
      },
      initialValue: "percentage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      group: "discount",
      description: "For percentage discounts enter 10 for 10%. For fixed discounts enter the INR amount.",
      validation: (Rule) =>
        Rule.required().positive().custom((value, context) => {
          const parent = context.parent as { discountType?: string } | undefined;
          return parent?.discountType !== "percentage" || Number(value) <= 100 || "Percentage cannot exceed 100%.";
        }),
    }),
    defineField({
      name: "maximumDiscountAmount",
      title: "Maximum Discount (INR)",
      type: "number",
      group: "discount",
      description: "Recommended for large percentage offers such as 50%. Leave empty for no cap.",
      hidden: ({ parent }) => parent?.discountType !== "percentage",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "minimumSubtotal",
      title: "Minimum Cart Subtotal (INR)",
      type: "number",
      group: "eligibility",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "appliesTo",
      title: "Applies To",
      type: "string",
      group: "eligibility",
      options: {
        list: [
          { title: "All products", value: "all" },
          { title: "Selected primary categories", value: "categories" },
          { title: "Selected sarees", value: "products" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eligibleCategories",
      title: "Eligible Categories",
      type: "array",
      group: "eligibility",
      of: [{ type: "string" }],
      options: { list: categoryOptions },
      hidden: ({ parent }) => parent?.appliesTo !== "categories",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { appliesTo?: string } | undefined;
          return parent?.appliesTo !== "categories" || (Array.isArray(value) && value.length > 0) || "Select at least one category.";
        }),
    }),
    defineField({
      name: "eligibleProducts",
      title: "Eligible Sarees",
      type: "array",
      group: "eligibility",
      of: [{ type: "reference", to: [{ type: "saree" }] }],
      hidden: ({ parent }) => parent?.appliesTo !== "products",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { appliesTo?: string } | undefined;
          return parent?.appliesTo !== "products" || (Array.isArray(value) && value.length > 0) || "Select at least one saree.";
        }),
    }),
    defineField({
      name: "startsAt",
      title: "Starts At",
      type: "datetime",
      group: "limits",
      description: "Optional. Leave empty to make the code available immediately.",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      group: "limits",
      description: "Optional. The code stops working at this exact time.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { startsAt?: string } | undefined;
          return !value || !parent?.startsAt || new Date(value) > new Date(parent.startsAt) || "Expiry must be after the start time.";
        }),
    }),
    defineField({
      name: "usageLimit",
      title: "Total Redemption Limit",
      type: "number",
      group: "limits",
      description: "Optional. Counts paid orders only.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "perCustomerLimit",
      title: "Uses Per Customer Email",
      type: "number",
      group: "limits",
      initialValue: 1,
      description: "Checked against paid orders for the checkout email address.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "internalNote",
      title: "Internal Note",
      type: "text",
      rows: 3,
      group: "limits",
      description: "Private context for your team. Customers never see this.",
    }),
  ],
  orderings: [{ title: "Code A-Z", name: "codeAsc", by: [{ field: "code", direction: "asc" }] }],
  preview: {
    select: { code: "code", type: "discountType", value: "discountValue", active: "active", expiresAt: "expiresAt" },
    prepare({ code, type, value, active, expiresAt }) {
      const discount = type === "percentage" ? `${value ?? 0}% off` : `₹${Number(value ?? 0).toLocaleString("en-IN")} off`;
      const expired = expiresAt && new Date(expiresAt) <= new Date();
      return { title: code ?? "Untitled code", subtitle: `${discount} · ${!active ? "Inactive" : expired ? "Expired" : "Active"}` };
    },
  },
});

