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

  const displayImages = images.slice(0, 2)
  const mainImage = displayImages[0]
  const secondImage = displayImages[1]

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div
          className="group/zoom relative cursor-zoom-in overflow-hidden bg-[radial-gradient(circle_at_top,#f5eadc_0%,#eee3d2_55%,#e3d4be_100%)]"
          onClick={() => setLightboxIndex(0)}
        >
          <AspectRatio ratio={4 / 5}>
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              priority
              sizes={mainImage.sizes ?? "(max-width: 1024px) 100vw, 50vw"}
              className="object-contain transition-transform duration-500 ease-out group-hover/zoom:scale-[1.04]"
              {...(mainImage.lqip ? { placeholder: "blur", blurDataURL: mainImage.lqip } : {})}
            />
          </AspectRatio>
          {badge && (
            <Badge variant={badge.variant as any} className="absolute left-4 top-4">
              {badge.text}
            </Badge>
          )}
        </div>

        {/* Second image */}
        {secondImage && (
          <div
            className="group/zoom relative cursor-zoom-in overflow-hidden bg-[radial-gradient(circle_at_top,#f5eadc_0%,#eee3d2_55%,#e3d4be_100%)]"
            onClick={() => setLightboxIndex(1)}
          >
            <AspectRatio ratio={4 / 5}>
              <Image
                src={secondImage.src}
                alt={secondImage.alt}
                fill
                sizes={secondImage.sizes ?? "(max-width: 1024px) 100vw, 50vw"}
                className="object-contain transition-transform duration-500 ease-out group-hover/zoom:scale-[1.04]"
                {...(secondImage.lqip ? { placeholder: "blur", blurDataURL: secondImage.lqip } : {})}
              />
            </AspectRatio>
          </div>
        )}
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
