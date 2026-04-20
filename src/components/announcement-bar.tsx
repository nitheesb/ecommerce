import { Marquee } from "@/components/marquee"

const announcements = [
  "Complimentary Shipping On Orders Above ₹2,000",
  "New Arrivals — Handcrafted Sarees, Fresh From the Loom",
  "Artisan-Crafted · Ethically Sourced · Heirloom Forever",
  "Book A Private Consultation With Our Saree Stylists",
  "Each Saree Comes With A Certificate Of Origin",
]

export function AnnouncementBar() {
  return <Marquee messages={announcements} />
}
