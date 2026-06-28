import { defineField, defineType } from "sanity";

const moneyField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "number",
    group: "summary",
    readOnly: true,
  });

export const orderSchema = defineType({
  name: "order",
  title: "Order",
  type: "document",
  groups: [
    { name: "summary", title: "Order Summary", default: true },
    { name: "customer", title: "Customer & Delivery" },
    { name: "payment", title: "Payment" },
    { name: "fulfilment", title: "Fulfilment" },
    { name: "system", title: "System" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      group: "summary",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      group: "summary",
      readOnly: true,
      options: {
        list: [
          { title: "Payment pending", value: "paymentPending" },
          { title: "Paid", value: "paid" },
          { title: "Payment failed", value: "paymentFailed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lineItems",
      title: "Purchased Items",
      type: "array",
      group: "summary",
      readOnly: true,
      of: [
        {
          type: "object",
          name: "orderLineItem",
          title: "Purchased Item",
          fields: [
            defineField({ name: "product", title: "Current Product", type: "reference", to: [{ type: "saree" }] }),
            defineField({ name: "productId", title: "Original Product ID", type: "string" }),
            defineField({ name: "title", title: "Product Name", type: "string" }),
            defineField({ name: "slug", title: "Product Slug", type: "string" }),
            defineField({ name: "sku", title: "SKU", type: "string" }),
            defineField({ name: "variantSku", title: "Variant SKU", type: "string" }),
            defineField({ name: "variantKey", title: "Variant Key", type: "string", hidden: true }),
            defineField({ name: "imageUrl", title: "Image URL", type: "url" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "unitPrice", title: "Unit Price (INR)", type: "number" }),
            defineField({ name: "lineTotal", title: "Line Total (INR)", type: "number" }),
          ],
          preview: {
            select: { title: "title", sku: "sku", variantSku: "variantSku", quantity: "quantity", lineTotal: "lineTotal" },
            prepare({ title, sku, variantSku, quantity, lineTotal }) {
              const amount = typeof lineTotal === "number" ? `₹${lineTotal.toLocaleString("en-IN")}` : "No total";
              return {
                title: `${quantity ?? 0} × ${title ?? "Product"}`,
                subtitle: `${variantSku ?? sku ?? "No SKU"} · ${amount}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    moneyField("subtotal", "Subtotal (INR)"),
    defineField({
      name: "coupon",
      title: "Discount Code",
      type: "reference",
      to: [{ type: "coupon" }],
      group: "summary",
      readOnly: true,
      weak: true,
    }),
    defineField({ name: "couponCode", title: "Coupon Code Used", type: "string", group: "summary", readOnly: true }),
    defineField({ name: "couponDiscountType", title: "Coupon Discount Type", type: "string", group: "summary", readOnly: true, hidden: true }),
    defineField({ name: "couponDiscountValue", title: "Coupon Discount Value", type: "number", group: "summary", readOnly: true, hidden: true }),
    moneyField("discountAmount", "Discount (INR)"),
    moneyField("shippingAmount", "Shipping (INR)"),
    moneyField("total", "Total (INR)"),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "summary",
      readOnly: true,
      initialValue: "INR",
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      group: "customer",
      readOnly: true,
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      group: "customer",
      readOnly: true,
      fields: [
        defineField({ name: "line1", title: "Address Line 1", type: "string" }),
        defineField({ name: "line2", title: "Address Line 2", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
      ],
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      group: "payment",
      readOnly: true,
      options: {
        list: [
          { title: "Created", value: "created" },
          { title: "Signature verified", value: "signatureVerified" },
          { title: "Captured", value: "captured" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
    }),
    defineField({ name: "razorpayOrderId", title: "Razorpay Order ID", type: "string", group: "payment", readOnly: true }),
    defineField({ name: "razorpayPaymentId", title: "Razorpay Payment ID", type: "string", group: "payment", readOnly: true }),
    defineField({ name: "paidAt", title: "Paid At", type: "datetime", group: "payment", readOnly: true }),
    defineField({
      name: "fulfilmentStatus",
      title: "Fulfilment Status",
      type: "string",
      group: "fulfilment",
      options: {
        list: [
          { title: "Unfulfilled", value: "unfulfilled" },
          { title: "Processing", value: "processing" },
          { title: "Packed", value: "packed" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Returned", value: "returned" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "courier", title: "Courier", type: "string", group: "fulfilment" }),
    defineField({ name: "trackingNumber", title: "Tracking Number", type: "string", group: "fulfilment" }),
    defineField({ name: "trackingUrl", title: "Tracking URL", type: "url", group: "fulfilment" }),
    defineField({ name: "fulfilmentNotes", title: "Internal Fulfilment Notes", type: "text", rows: 4, group: "fulfilment" }),
    defineField({ name: "receipt", title: "Razorpay Receipt", type: "string", group: "system", readOnly: true }),
    defineField({ name: "inventoryAdjusted", title: "Inventory Adjusted", type: "boolean", group: "system", readOnly: true }),
    defineField({ name: "confirmationSentAt", title: "Confirmation Sent At", type: "datetime", group: "system", readOnly: true }),
    defineField({ name: "notificationState", title: "Notification State", type: "string", group: "system", readOnly: true }),
    defineField({ name: "notificationStartedAt", title: "Notification Started At", type: "datetime", group: "system", readOnly: true }),
    defineField({ name: "lastPaymentFailure", title: "Last Payment Failure", type: "text", rows: 3, group: "system", readOnly: true }),
  ],
  orderings: [
    { title: "Newest First", name: "newestFirst", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      customer: "customer.name",
      total: "total",
      status: "status",
      fulfilmentStatus: "fulfilmentStatus",
    },
    prepare({ orderNumber, customer, total, status, fulfilmentStatus }) {
      const amount = typeof total === "number" ? `₹${total.toLocaleString("en-IN")}` : "No total";
      return {
        title: `${orderNumber ?? "Order"} · ${customer ?? "Unknown customer"}`,
        subtitle: `${status ?? "unknown"} · ${fulfilmentStatus ?? "unfulfilled"} · ${amount}`,
      };
    },
  },
});
