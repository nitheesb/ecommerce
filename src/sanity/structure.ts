import type { StructureResolver } from "sanity/structure";

const publishedOnly = '!(_id in path("drafts.**"))';

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
              S.listItem()
                .title("All Sarees")
                .child(
                  S.documentList()
                    .title("All Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly}`)
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("Active")
                .child(
                  S.documentList()
                    .title("Active Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && status == "active"`)
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentList()
                    .title("Draft Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && status == "draft"`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  S.documentList()
                    .title("Archived Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && status == "archived"`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
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
              S.divider(),
              S.listItem()
                .title("Featured")
                .child(
                  S.documentList()
                    .title("Featured Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && featured == true`)
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.listItem()
                .title("Low Stock")
                .child(
                  S.documentList()
                    .title("Low Stock Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && (stockStatus == "lowStock" || stockQuantity <= 3)`)
                    .defaultOrdering([{ field: "stockQuantity", direction: "asc" }]),
                ),
              S.listItem()
                .title("Out of Stock")
                .child(
                  S.documentList()
                    .title("Out of Stock Sarees")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && (stockStatus == "outOfStock" || stockQuantity == 0)`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Missing SEO")
                .child(
                  S.documentList()
                    .title("Sarees Missing SEO")
                    .schemaType("saree")
                    .filter(`_type == "saree" && ${publishedOnly} && (!defined(seo.metaTitle) || !defined(seo.metaDescription))`)
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
            ]),
        ),
    ]);
