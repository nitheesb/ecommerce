import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function InnerPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
