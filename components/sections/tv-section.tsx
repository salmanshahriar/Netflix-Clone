"use client"

import { useState, useEffect } from "react"
import { getTVShows } from "@/lib/tmdb"
import ContentCard from "@/components/ui/content-card"
import ContentSection from "@/components/ui/content-section"
import { Button } from "@/components/ui/button"

interface TVShow {
  id: number
  name: string
  poster_path: string
  overview: string
  vote_average: number
  first_air_date: string
  genre_ids: number[]
}

interface TVSectionProps {
  title: string
  endpoint: string
}

export default function TVSection({ title, endpoint }: TVSectionProps) {
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const data = await getTVShows(endpoint, page)
        if (page === 1) {
          setTVShows(data.results)
        } else {
          setTVShows((prev) => [...prev, ...data.results])
        }
      } catch (error) {
        console.error("Error fetching TV shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTVShows()
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
      {tvShows.map((tvShow) => (
        <div key={tvShow.id} className="w-48 flex-shrink-0">
          <ContentCard content={{ ...tvShow, title: tvShow.name, media_type: "tv" }} />
        </div>
      ))}
      {tvShows.length > 0 && (
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
