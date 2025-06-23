"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContentSectionProps {
  title: string
  children: React.ReactNode
  showNavigation?: boolean
}

export default function ContentSection({ title, children, showNavigation = true }: ContentSectionProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-")}`)
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const checkScrollButtons = () => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-")}`)
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  useEffect(() => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-")}`)
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      checkScrollButtons()
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [title])

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">{title}</h2>

        {showNavigation && (
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollContainer("left")}
              disabled={!canScrollLeft}
              className="text-white hover:bg-white/10 disabled:opacity-30 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollContainer("right")}
              disabled={!canScrollRight}
              className="text-white hover:bg-white/10 disabled:opacity-30 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="relative">
        <div
          id={`scroll-${title.replace(/\s+/g, "-")}`}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
