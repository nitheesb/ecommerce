import "server-only";

import type { SanityClient } from "@sanity/client";

import { sendPaidOrderNotifications } from "@/lib/order-email";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

type OrderLineItem = {
  productId?: string;
  variantKey?: string;
  title?: string;
  quantity?: number;
  lineTotal?: number;
};

type StoredOrder = {
  _id: string;
  _rev: string;
  orderNumber: string;
  status?: string;
  inventoryAdjusted?: boolean;
  confirmationSentAt?: string;
  notificationState?: string;
  notificationStartedAt?: string;
  customer?: { name?: string; email?: string };
  shippingAddress?: Record<string, string>;
  lineItems?: OrderLineItem[];
  total?: number;
};

const orderByRazorpayIdQuery = `
  *[_type == "order" && razorpayOrderId == $razorpayOrderId][0] {
    _id, _rev, orderNumber, status, inventoryAdjusted, confirmationSentAt,
    notificationState, notificationStartedAt,
    customer, shippingAddress, lineItems, total
  }
`;

async function markLowOrOutOfStock(client: SanityClient, lineItems: OrderLineItem[]) {
  const productIds = lineItems.map((item) => item.productId).filter(Boolean) as string[];
  if (productIds.length === 0) return;

  const products = await client.fetch<Array<{ _id: string; stockQuantity?: number }>>(
    `*[_type == "saree" && _id in $productIds]{_id, stockQuantity}`,
    { productIds },
  );

  await Promise.all(
    products.map((product) => {
      if (typeof product.stockQuantity !== "number") return Promise.resolve(null);
      const stockStatus = product.stockQuantity <= 0 ? "outOfStock" : product.stockQuantity <= 3 ? "lowStock" : "inStock";
      return client.patch(product._id).set({ stockStatus }).commit();
    }),
  );
}

export async function recordSuccessfulPayment(
  razorpayOrderId: string,
  razorpayPaymentId?: string,
  attempt = 0,
) {
  const client = getSanityWriteClient();
  const order = await client.fetch<StoredOrder | null>(orderByRazorpayIdQuery, { razorpayOrderId });
  if (!order) return false;

  const paidFields = {
    status: "paid",
    paymentStatus: "captured",
    ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
    paidAt: new Date().toISOString(),
  };

  if (!order.inventoryAdjusted) {
    try {
      let transaction = client
        .transaction()
        .patch(order._id, (patch) =>
          patch.ifRevisionId(order._rev).set({ ...paidFields, inventoryAdjusted: true }),
        );

      for (const item of order.lineItems ?? []) {
        if (!item.productId || !item.quantity || item.quantity < 1) continue;
        transaction = transaction.patch(item.productId, (patch) =>
          patch.dec({ stockQuantity: item.quantity ?? 0 }),
        );
        if (item.variantKey) {
          transaction = transaction.patch(item.productId, (patch) =>
            patch.dec({ [`variants[_key=="${item.variantKey}"].stockQuantity`]: item.quantity ?? 0 }),
          );
        }
      }

      await transaction.commit();
      await markLowOrOutOfStock(client, order.lineItems ?? []);
    } catch (error) {
      if (attempt < 1) return recordSuccessfulPayment(razorpayOrderId, razorpayPaymentId, attempt + 1);
      throw error;
    }
  } else {
    await client.patch(order._id).set(paidFields).commit();
  }

  const notificationOrder = await client.fetch<StoredOrder | null>(orderByRazorpayIdQuery, { razorpayOrderId });
  const notificationStartedAt = notificationOrder?.notificationStartedAt
    ? new Date(notificationOrder.notificationStartedAt).getTime()
    : 0;
  const notificationClaimIsFresh =
    notificationOrder?.notificationState === "sending" && Date.now() - notificationStartedAt < 10 * 60 * 1000;

  if (notificationOrder && !notificationOrder.confirmationSentAt && !notificationClaimIsFresh) {
    try {
      await client
        .patch(notificationOrder._id)
        .ifRevisionId(notificationOrder._rev)
        .set({ notificationState: "sending", notificationStartedAt: new Date().toISOString() })
        .commit();
    } catch {
      return true;
    }

    const sent = await sendPaidOrderNotifications({
      orderNumber: notificationOrder.orderNumber,
      customer: notificationOrder.customer,
      shippingAddress: notificationOrder.shippingAddress,
      lineItems: notificationOrder.lineItems,
      total: notificationOrder.total,
    });
    await client
      .patch(notificationOrder._id)
      .set(
        sent
          ? { confirmationSentAt: new Date().toISOString(), notificationState: "sent" }
          : { notificationState: "failed" },
      )
      .commit();
  }

  return true;
}

export async function recordFailedPayment(
  razorpayOrderId: string,
  razorpayPaymentId?: string,
  reason?: string,
) {
  const client = getSanityWriteClient();
  const order = await client.fetch<StoredOrder | null>(orderByRazorpayIdQuery, { razorpayOrderId });
  if (!order || order.status === "paid") return false;

  await client
    .patch(order._id)
    .set({
      status: "paymentFailed",
      paymentStatus: "failed",
      ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
      lastPaymentFailure: reason ?? "Payment failed",
    })
    .commit();
  return true;
}
