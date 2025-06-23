"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  vote_average: number
  release_date: string
}

interface MovieSectionProps {
  title: string
  endpoint: string
}

export default function MovieSection({ title, endpoint }: MovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies(endpoint, page)
        if (page === 1) {
          setMovies(data.results)
        } else {
          setMovies((prev) => [...prev, ...data.results])
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [endpoint, page])

  const scrollLeft = () => {
    const container = document.getElementById(`scroll-${title}`)
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById(`scroll-${title}`)
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (loading && page === 1) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-bold px-4 lg:px-0">{title}</h2>
        <div className="flex gap-4 md:gap-6 overflow-hidden px-4 lg:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-40 md:w-48 h-56 md:h-72 glass-card animate-pulse rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold px-4 lg:px-0">{title}</h2>
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 glass-effect hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-netflix hidden md:flex"
          onClick={scrollLeft}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div id={`scroll-${title}`} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 lg:px-0">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {movies.length > 0 && (
            <div className="flex-shrink-0 w-40 md:w-48 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="glass-effect border-gray-600 hover:bg-gray-700 text-white btn-netflix focus-netflix"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 glass-effect hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-netflix hidden md:flex"
          onClick={scrollRight}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
