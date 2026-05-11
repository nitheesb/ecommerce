import type { StructureResolver } from "sanity/structure";

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
        .title("Sarees")
        .id("sarees")
        .child(
          S.list()
            .title("Sarees")
            .items([
              S.documentTypeListItem("saree").title("All Sarees"),
              S.divider(),
              S.listItem()
                .title("Active")
                .child(
                  S.documentList()
                    .title("Active Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && status == "active"')
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentList()
                    .title("Draft Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && status == "draft"')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  S.documentList()
                    .title("Archived Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && status == "archived"')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("Featured")
                .child(
                  S.documentList()
                    .title("Featured Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && featured == true')
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.listItem()
                .title("Low Stock")
                .child(
                  S.documentList()
                    .title("Low Stock Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && (stockStatus == "lowStock" || stockQuantity <= 3)')
                    .defaultOrdering([{ field: "stockQuantity", direction: "asc" }]),
                ),
              S.listItem()
                .title("Out of Stock")
                .child(
                  S.documentList()
                    .title("Out of Stock Sarees")
                    .schemaType("saree")
                    .filter('_type == "saree" && (stockStatus == "outOfStock" || stockQuantity == 0)')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Missing SEO")
                .child(
                  S.documentList()
                    .title("Sarees Missing SEO")
                    .schemaType("saree")
                    .filter('_type == "saree" && (!defined(seo.metaTitle) || !defined(seo.metaDescription))')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
            ]),
        ),
    ]);
