import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "njd3ihcc";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "thazhuval",
  title: "House of Thazhuval",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, context) => {
      if (context.schemaType !== "siteSettings") return actions;
      return actions.filter(
        (action) => !["delete", "duplicate", "unpublish"].includes(action.action ?? ""),
      );
    },
  },
});
