"use client"

import { useState } from "react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { ImageLightbox } from "@/components/image-lightbox"

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

  const mainImage = images[0]
  const galleryImages = images.slice(1)

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div
          className="group/zoom relative cursor-zoom-in overflow-hidden bg-muted"
          onClick={() => setLightboxIndex(0)}
        >
          <AspectRatio ratio={4 / 5}>
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              priority
              sizes={mainImage.sizes ?? "(max-width: 1024px) 100vw, 50vw"}
              className="object-cover transition-transform duration-500 ease-out group-hover/zoom:scale-[1.06]"
              {...(mainImage.lqip ? { placeholder: "blur", blurDataURL: mainImage.lqip } : {})}
            />
          </AspectRatio>
          {badge && (
            <Badge variant={badge.variant as any} className="absolute left-4 top-4">
              {badge.text}
            </Badge>
          )}
        </div>

        {/* Gallery grid */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={img.src + i}
                className="group/zoom relative cursor-zoom-in overflow-hidden bg-muted"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <AspectRatio ratio={4 / 5}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={img.sizes ?? "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-500 ease-out group-hover/zoom:scale-[1.06]"
                    {...(img.lqip ? { placeholder: "blur", blurDataURL: img.lqip } : {})}
                  />
                </AspectRatio>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images.map((img) => ({ src: img.src, alt: img.alt, lqip: img.lqip }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
