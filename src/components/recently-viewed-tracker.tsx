"use client"

import { useEffect } from "react"
import { useUiStore, type RecentlyViewedItem } from "@/hooks/use-ui-store"

export function RecentlyViewedTracker({ item }: { item: RecentlyViewedItem }) {
  const addRecentlyViewed = useUiStore((s) => s.addRecentlyViewed)

  useEffect(() => {
    addRecentlyViewed(item)
  }, [item.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
