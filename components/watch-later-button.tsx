"use client"

import { useState, useEffect } from "react"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToWatchLater, removeFromWatchLater, isInWatchLater, type WatchLaterItem } from "@/lib/watch-later"

interface WatchLaterButtonProps {
  item: Omit<WatchLaterItem, "addedAt">
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showText?: boolean
}

export default function WatchLaterButton({
  item,
  variant = "outline",
  size = "default",
  showText = true,
}: WatchLaterButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsAdded(isInWatchLater(item.id, item.media_type))
  }, [item.id, item.media_type])

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      if (isAdded) {
        removeFromWatchLater(item.id, item.media_type)
        setIsAdded(false)
      } else {
        addToWatchLater(item)
        setIsAdded(true)
      }

      // Dispatch custom event to update navbar count
      window.dispatchEvent(new CustomEvent("watchLaterUpdated"))
    } catch (error) {
      console.error("Error toggling watch later:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isAdded
          ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
          : "glass-effect border-gray-600 hover:bg-white/20 text-white"
      }`}
    >
      {isAdded ? (
        <Check className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${showText ? "mr-2" : ""}`} />
      ) : (
        <Clock className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${showText ? "mr-2" : ""}`} />
      )}
      {showText && (isAdded ? "Added" : "Watch Later")}
    </Button>
  )
}
