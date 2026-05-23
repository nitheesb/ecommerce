"use client"

import { type ReactNode, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ImageLightbox } from "@/components/image-lightbox"
import { cn } from "@/lib/utils"

interface GalleryImage {
  src: string
  alt: string
  lqip?: string
  sizes?: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  badge?: {
    text: string
    variant: string
  }
}

export function ProductGallery({ images, badge }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const displayImages = images.slice(0, 3)
  const mainImage = displayImages[0]
  const detailImages = displayImages.slice(1)

  return (
    <>
      <div
        className="grid gap-3 sm:grid-cols-2 lg:sticky lg:top-32 lg:grid-cols-[minmax(0,1fr)_minmax(150px,0.36fr)] lg:gap-4"
        data-product-gallery
      >
        <GalleryFrame
          image={mainImage}
          index={0}
          total={displayImages.length}
          priority
          className="sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:aspect-auto lg:h-[calc(100svh-12rem)] lg:min-h-[520px] lg:max-h-[690px]"
          onOpen={() => setLightboxIndex(0)}
        >
          {badge && (
            <Badge variant={badge.variant as any} className="absolute left-4 top-4">
              {badge.text}
            </Badge>
          )}
        </GalleryFrame>

        {detailImages.map((image, index) => (
          <GalleryFrame
            key={`${image.src}-${index}`}
            image={image}
            index={index + 1}
            total={displayImages.length}
            className="lg:aspect-auto lg:h-[calc((100svh-12.75rem)/2)] lg:min-h-[252px] lg:max-h-[337px]"
            onOpen={() => setLightboxIndex(index + 1)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={displayImages.map((img) => ({ src: img.src, alt: img.alt, lqip: img.lqip }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

function GalleryFrame({
  image,
  index,
  total,
  priority,
  className,
  children,
  onOpen,
}: {
  image: GalleryImage
  index: number
  total: number
  priority?: boolean
  className?: string
  children?: ReactNode
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        "group/zoom relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_top,#f8efe2_0%,#eadcc8_58%,#dac4a5_100%)] text-left shadow-[0_18px_55px_rgba(15,23,42,0.08)] ring-1 ring-border/50 transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
        className,
      )}
      onClick={onOpen}
      aria-label={`Open product image ${index + 1} of ${total}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={image.sizes ?? "(max-width: 1024px) 100vw, 50vw"}
        className="object-cover object-top transition-transform duration-700 ease-out group-hover/zoom:scale-[1.035]"
        {...(image.lqip ? { placeholder: "blur", blurDataURL: image.lqip } : {})}
      />
      <span className="absolute bottom-4 right-4 rounded-full bg-background/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground shadow-sm backdrop-blur">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {children}
    </button>
  )
}
