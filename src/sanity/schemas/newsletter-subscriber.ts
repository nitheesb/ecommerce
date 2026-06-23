import { defineField, defineType } from "sanity";

export const newsletterSubscriberSchema = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", readOnly: true, validation: (Rule) => Rule.required().email() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: [{ title: "Subscribed", value: "subscribed" }, { title: "Unsubscribed", value: "unsubscribed" }], layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "source", title: "Signup Source", type: "string", readOnly: true }),
    defineField({ name: "subscribedAt", title: "Subscribed At", type: "datetime", readOnly: true }),
    defineField({ name: "unsubscribedAt", title: "Unsubscribed At", type: "datetime", readOnly: true }),
    defineField({ name: "lastSubmittedAt", title: "Last Submitted At", type: "datetime", readOnly: true }),
    defineField({ name: "welcomeEmailSentAt", title: "Welcome Email Sent At", type: "datetime", readOnly: true }),
    defineField({ name: "consentText", title: "Consent Recorded", type: "text", rows: 2, readOnly: true }),
  ],
  orderings: [{ title: "Newest First", name: "newestFirst", by: [{ field: "subscribedAt", direction: "desc" }] }],
  preview: {
    select: { email: "email", status: "status", subscribedAt: "subscribedAt" },
    prepare({ email, status, subscribedAt }) {
      return { title: email ?? "Subscriber", subtitle: `${status ?? "unknown"} · ${subscribedAt ? new Date(subscribedAt).toLocaleDateString("en-IN") : "No date"}` };
    },
  },
});
