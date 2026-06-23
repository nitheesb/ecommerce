import "server-only";

import { sendTransactionalEmail } from "@/lib/resend";

type OrderForEmail = {
  orderNumber: string;
  customer?: { name?: string; email?: string };
  lineItems?: Array<{ title?: string; quantity?: number; lineTotal?: number }>;
  total?: number;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatInr(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function sendPaidOrderNotifications(order: OrderForEmail) {
  const items = (order.lineItems ?? [])
    .map(
      (item) =>
        `<li>${escapeHtml(item.quantity)} × ${escapeHtml(item.title)} — ${escapeHtml(formatInr(item.lineTotal))}</li>`,
    )
    .join("");
  const address = order.shippingAddress
    ? [
        order.shippingAddress.line1,
        order.shippingAddress.line2,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.postalCode,
        order.shippingAddress.country,
      ]
        .filter(Boolean)
        .map(escapeHtml)
        .join(", ")
    : "";
  const customerName = escapeHtml(order.customer?.name ?? "Customer");
  const content = `
    <div style="font-family:Georgia,serif;color:#24303a;line-height:1.6;max-width:640px;margin:auto">
      <h1 style="font-weight:400">Thank you, ${customerName}.</h1>
      <p>Payment for order <strong>${escapeHtml(order.orderNumber)}</strong> has been confirmed.</p>
      <ul>${items}</ul>
      <p><strong>Total: ${escapeHtml(formatInr(order.total))}</strong></p>
      ${address ? `<p><strong>Delivery address:</strong><br>${address}</p>` : ""}
      <p>House of Thazhuval will contact you when your order is shipped.</p>
    </div>`;

  const recipients: Array<Promise<boolean>> = [];
  const customerEmail = order.customer?.email;
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  if (customerEmail) {
    recipients.push(sendTransactionalEmail(customerEmail, `Order ${order.orderNumber} confirmed`, content));
  }
  if (adminEmail) {
    recipients.push(sendTransactionalEmail(adminEmail, `New paid order: ${order.orderNumber}`, content));
  }

  if (recipients.length === 0) return false;
  const results = await Promise.all(recipients);
  return results.every(Boolean);
}
