"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/tmdb"
import { Play, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroContent {
  id: number
  title?: string
  name?: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  media_type?: string
}

export default function Hero() {
  const [heroItems, setHeroItems] = useState<HeroContent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const { results } = await getMovies("trending/all/day")
        setHeroItems(results.slice(0, 5))
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch hero content:", error)
        setIsLoading(false)
      }
    }

    fetchHeroContent()
  }, [])

  useEffect(() => {
    if (heroItems.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [heroItems.length])

  if (isLoading) {
    return (
      <div className="h-[70vh] lg:h-[80vh] bg-gradient-to-br from-gray-900 to-black animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading featured content...</p>
        </div>
      </div>
    )
  }

  if (heroItems.length === 0) return null

  const currentItem = heroItems[currentIndex]

  return (
    <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentItem.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl space-y-6">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              {currentItem.title || currentItem.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 backdrop-blur-sm px-3 py-1 rounded-full bg-black">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="font-semibold text-white">{currentItem.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-300 text-sm">IMDb Rating</span>
            </div>

            {/* Overview */}
            <p className="text-lg lg:text-xl text-gray-200 leading-relaxed line-clamp-3 max-w-xl">
              {currentItem.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 text-lg rounded-lg transition-all duration-200 hover:scale-105"
                asChild
              >
                <Link
                  href={`/watch/${currentItem.media_type || "movie"}/${currentItem.id}${
                    currentItem.media_type === "tv" ? "/1/1" : ""
                  }`}
                >
                  <Play className="w-6 h-6 mr-3 fill-current" />
                  Play
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-gray-600/30 backdrop-blur-sm border-gray-400 text-white hover:bg-gray-600/50 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-200"
                asChild
              >
                <Link href={`/${currentItem.media_type || "movie"}/${currentItem.id}`}>
                  <Info className="w-6 h-6 mr-3" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {heroItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-red-600 w-8" : "bg-white/50 hover:bg-white/70 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
