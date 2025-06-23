"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/tmdb"
import ContentCard from "@/components/ui/content-card"
import ContentSection from "@/components/ui/content-section"
import { Button } from "@/components/ui/button"

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

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (loading && page === 1) {
    return (
      <ContentSection title={title} showNavigation={false}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-48 h-72 bg-gray-900/50 animate-pulse rounded-xl flex-shrink-0" />
        ))}
      </ContentSection>
    )
  }

  return (
    <ContentSection title={title}>
      {movies.map((movie) => (
        <div key={movie.id} className="w-48 flex-shrink-0">
          <ContentCard content={{ ...movie, media_type: "movie" }} />
        </div>
      ))}
      {movies.length > 0 && (
        <div className="w-48 flex-shrink-0 flex items-center justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="bg-gray-900/50 border-gray-700 hover:bg-gray-800 text-white h-full min-h-[200px] rounded-xl"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </ContentSection>
  )
}
