"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/tmdb"
import { Play, Info, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroContent {
  id: number
  title?: string
  name?: string
  overview: string
  backdrop_path: string
  media_type?: string
}

export default function Hero() {
  const [heroItems, setHeroItems] = useState<HeroContent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const { results } = await getMovies("trending/all/day")
        setHeroItems(results.slice(0, 10))
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
    }, 6000)

    return () => clearInterval(interval)
  }, [heroItems.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (isLoading) {
    return <div className="h-[50vh] md:h-[70vh] bg-gray-900 animate-pulse" />
  }

  if (heroItems.length === 0) return null

  const currentItem = heroItems[currentIndex]

  return (
    <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden group">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 glass-effect hover:bg-black/70 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus-netflix"
        aria-label="Previous trending item"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 glass-effect hover:bg-black/70 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus-netflix"
        aria-label="Next trending item"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-20 glass-effect hover:bg-black/70 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus-netflix"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-xl lg:max-w-2xl space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black transition-all duration-500 leading-tight">
              {currentItem.title || currentItem.name}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-gray-200 line-clamp-3 transition-all duration-500 leading-relaxed">
              {currentItem.overview}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                size="lg"
                className="netflix-gradient hover:netflix-gradient-hover text-white font-semibold px-6 md:px-8 py-3 md:py-4 text-sm md:text-base btn-netflix focus-netflix"
                asChild
              >
                <Link
                  href={`/watch/${currentItem.media_type || "movie"}/${currentItem.id}${
                    currentItem.media_type === "tv" ? "/1/1" : ""
                  }`}
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" />
                  Play
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-gray-600 hover:bg-white/20 text-white font-semibold px-6 md:px-8 py-3 md:py-4 text-sm md:text-base btn-netflix focus-netflix"
                asChild
              >
                <Link href={`/${currentItem.media_type || "movie"}/${currentItem.id}`}>
                  <Info className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 md:h-2 rounded-full transition-all duration-300 focus-netflix ${
              index === currentIndex ? "bg-red-600 w-6 md:w-8" : "bg-white/50 hover:bg-white/70 w-2 md:w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full netflix-gradient transition-all duration-100 ease-linear"
          style={{
            width: `${((currentIndex + 1) / heroItems.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
