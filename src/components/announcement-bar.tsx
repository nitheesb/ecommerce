import { Marquee } from "@/components/marquee"

const announcements = [
  "Complimentary Worldwide Shipping On Orders Above ₹25,000",
  "New Arrivals — The Monsoon Edit, Vol. III",
  "Artisan-Crafted · Ethically Sourced · Heirloom Forever",
  "Book A Private Consultation With Our Saree Stylists",
  "Limited Edition — Kanchi Bridal Drop, Only 24 Pieces",
]

export function AnnouncementBar() {
  return <Marquee messages={announcements} />
}
