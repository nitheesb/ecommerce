import type { StructureResolver } from "sanity/structure";

const publishedOnly = '!(_id in path("drafts.**"))';
const saree = `_type == "saree" && ${publishedOnly}`;
const order = `_type == "order" && ${publishedOnly}`;
const coupon = `_type == "coupon" && ${publishedOnly}`;
const subscriber = `_type == "newsletterSubscriber" && ${publishedOnly}`;

const productList = (
  S: Parameters<StructureResolver>[0],
  title: string,
  filter: string,
  ordering: { field: string; direction: "asc" | "desc" }[] = [
    { field: "sortOrder", direction: "asc" },
  ],
) =>
  S.documentList()
    .title(title)
    .schemaType("saree")
    .filter(filter)
    .defaultOrdering(ordering);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("House of Thazhuval")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      S.listItem()
        .title("Newsletter")
        .id("newsletter")
        .child(
          S.list()
            .title("Newsletter Subscribers")
            .items([
              S.listItem()
                .title("Active Subscribers")
                .child(
                  S.documentList()
                    .title("Active Subscribers")
                    .schemaType("newsletterSubscriber")
                    .filter(`${subscriber} && status == "subscribed"`)
                    .defaultOrdering([{ field: "subscribedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Unsubscribed")
                .child(
                  S.documentList()
                    .title("Unsubscribed")
                    .schemaType("newsletterSubscriber")
                    .filter(`${subscriber} && status == "unsubscribed"`)
                    .defaultOrdering([{ field: "unsubscribedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Discount Codes")
        .id("discountCodes")
        .child(
          S.list()
            .title("Discount Codes")
            .items([
              S.listItem()
                .title("All Codes")
                .child(
                  S.documentList()
                    .title("All Discount Codes")
                    .schemaType("coupon")
                    .filter(coupon)
                    .defaultOrdering([{ field: "code", direction: "asc" }]),
                ),
              S.listItem()
                .title("Active Codes")
                .child(
                  S.documentList()
                    .title("Active Discount Codes")
                    .schemaType("coupon")
                    .filter(`${coupon} && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(expiresAt) || expiresAt > now())`)
                    .defaultOrdering([{ field: "expiresAt", direction: "asc" }]),
                ),
              S.listItem()
                .title("Inactive & Expired")
                .child(
                  S.documentList()
                    .title("Inactive & Expired Codes")
                    .schemaType("coupon")
                    .filter(`${coupon} && (active != true || (defined(expiresAt) && expiresAt <= now()))`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Orders")
        .id("orders")
        .child(
          S.list()
            .title("Order Management")
            .items([
              S.listItem()
                .title("All Orders")
                .child(
                  S.documentList()
                    .title("All Orders")
                    .schemaType("order")
                    .filter(order)
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("New Paid Orders")
                .child(
                  S.documentList()
                    .title("New Paid Orders")
                    .schemaType("order")
                    .filter(`${order} && status == "paid" && fulfilmentStatus == "unfulfilled"`)
                    .defaultOrdering([{ field: "paidAt", direction: "asc" }]),
                ),
              S.listItem()
                .title("Processing & Packed")
                .child(
                  S.documentList()
                    .title("Processing & Packed")
                    .schemaType("order")
                    .filter(`${order} && fulfilmentStatus in ["processing", "packed"]`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "asc" }]),
                ),
              S.listItem()
                .title("Shipped")
                .child(
                  S.documentList()
                    .title("Shipped Orders")
                    .schemaType("order")
                    .filter(`${order} && fulfilmentStatus == "shipped"`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Payment Problems")
                .child(
                  S.documentList()
                    .title("Payment Problems")
                    .schemaType("order")
                    .filter(`${order} && status in ["paymentPending", "paymentFailed"]`)
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Sarees")
        .id("sarees")
        .child(
          S.list()
            .title("Sarees")
            .items([
              S.listItem()
                .title("All Sarees")
                .child(productList(S, "All Sarees", saree)),
              S.listItem()
                .title("Active")
                .child(productList(S, "Active Sarees", `${saree} && status == "active"`)),
              S.listItem()
                .title("Drafts")
                .child(
                  productList(
                    S,
                    "Draft Sarees",
                    `${saree} && status == "draft"`,
                    [{ field: "_updatedAt", direction: "desc" }],
                  ),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  productList(
                    S,
                    "Archived Sarees",
                    `${saree} && status == "archived"`,
                    [{ field: "_updatedAt", direction: "desc" }],
                  ),
                ),
              S.listItem()
                .title("Unpublished Changes")
                .child(
                  S.documentList()
                    .title("Sarees With Unpublished Changes")
                    .schemaType("saree")
                    .filter('_type == "saree" && _id in path("drafts.**")')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.listItem()
        .title("Merchandising")
        .id("merchandising")
        .child(
          S.list()
            .title("Merchandising")
            .items([
              S.listItem()
                .title("Homepage Featured")
                .child(productList(S, "Homepage Featured", `${saree} && featured == true`)),
              S.listItem()
                .title("Bestsellers")
                .child(productList(S, "Bestsellers", `${saree} && badge == "Bestseller"`)),
              S.listItem()
                .title("New Arrivals")
                .child(productList(S, "New Arrivals", `${saree} && badge == "New"`)),
              S.listItem()
                .title("Limited Edition")
                .child(productList(S, "Limited Edition", `${saree} && badge == "Limited Edition"`)),
              S.listItem()
                .title("Manual Sort Review")
                .child(productList(S, "Manual Sort Review", saree)),
            ]),
        ),
      S.listItem()
        .title("Inventory")
        .id("inventory")
        .child(
          S.list()
            .title("Inventory")
            .items([
              S.listItem()
                .title("Low Stock")
                .child(
                  productList(
                    S,
                    "Low Stock Sarees",
                    `${saree} && (stockStatus == "lowStock" || stockQuantity <= 3)`,
                    [{ field: "stockQuantity", direction: "asc" }],
                  ),
                ),
              S.listItem()
                .title("Out of Stock")
                .child(
                  productList(
                    S,
                    "Out of Stock Sarees",
                    `${saree} && (stockStatus == "outOfStock" || stockQuantity == 0)`,
                    [{ field: "_updatedAt", direction: "desc" }],
                  ),
                ),
              S.listItem()
                .title("Made to Order")
                .child(productList(S, "Made to Order Sarees", `${saree} && stockStatus == "madeToOrder"`)),
              S.listItem()
                .title("Missing SKU")
                .child(productList(S, "Missing SKU", `${saree} && !defined(sku) && count(variants[]) == 0`)),
              S.listItem()
                .title("Inventory Mismatch")
                .child(
                  productList(
                    S,
                    "Inventory Mismatch",
                    `${saree} && ((stockStatus == "outOfStock" && stockQuantity != 0) || (stockStatus in ["inStock", "lowStock"] && stockQuantity < 1) || (stockStatus == "lowStock" && stockQuantity > 3))`,
                    [{ field: "_updatedAt", direction: "desc" }],
                  ),
                ),
            ]),
        ),
      S.listItem()
        .title("Browse by Category")
        .id("browseByCategory")
        .child(
          S.list()
            .title("Browse by Category")
            .items([
              S.listItem()
                .title("Silk")
                .child(productList(S, "Silk Sarees", `${saree} && category == "Silk"`)),
              S.listItem()
                .title("Cotton")
                .child(productList(S, "Cotton Sarees", `${saree} && category == "Cotton"`)),
              S.listItem()
                .title("Heritage")
                .child(productList(S, "Heritage Sarees", `${saree} && category == "Heritage"`)),
              S.listItem()
                .title("Designer")
                .child(productList(S, "Designer Sarees", `${saree} && category == "Designer"`)),
            ]),
        ),
      S.listItem()
        .title("Browse by Fabric")
        .id("browseByFabric")
        .child(
          S.list()
            .title("Browse by Fabric")
            .items([
              S.listItem()
                .title("Banana Silk")
                .child(productList(S, "Banana Silk Sarees", `${saree} && fabric == "Banana Silk"`)),
              S.listItem()
                .title("Soft Silk")
                .child(productList(S, "Soft Silk Sarees", `${saree} && fabric == "Soft Silk"`)),
              S.listItem()
                .title("Silk Cotton")
                .child(productList(S, "Silk Cotton Sarees", `${saree} && fabric == "Silk Cotton"`)),
              S.listItem()
                .title("Tussar")
                .child(productList(S, "Tussar Sarees", `${saree} && fabric == "Tussar"`)),
              S.listItem()
                .title("Chiffon")
                .child(productList(S, "Chiffon Sarees", `${saree} && fabric == "Chiffon"`)),
              S.listItem()
                .title("Cotton")
                .child(productList(S, "Cotton Sarees", `${saree} && fabric == "Cotton"`)),
            ]),
        ),
    ]);
