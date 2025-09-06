"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToWatchLater, removeFromWatchLater, isInWatchLater, type WatchLaterItem } from "@/lib/watch-later"

interface WatchLaterButtonProps {
  item: Omit<WatchLaterItem, "addedAt">
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showText?: boolean
  className?: string
}

export default function WatchLaterButton({
  item,
  variant = "ghost",
  size = "sm",
  showText = true,
  className = "",
}: WatchLaterButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsAdded(isInWatchLater(item.id, item.media_type))
  }, [item.id, item.media_type])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
          ? "bg-green-600/20 text-green-400 border-green-600/50 hover:bg-green-600/30"
          : "bg-gray-600/20 text-gray-300 border-gray-600/50 hover:bg-gray-600/30"
      } ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : isAdded ? (
        <Check className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${showText ? "mr-2" : ""}`} />
      ) : (
        <Plus className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${showText ? "mr-2" : ""}`} />
      )}
      {showText && !isLoading && (isAdded ? "Added to Watch Later" : "Add to Watch Later")}
    </Button>
  )
}
