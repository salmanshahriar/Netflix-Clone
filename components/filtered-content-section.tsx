"use client"

import { useState, useEffect } from "react"
import { getFilteredMovies } from "@/lib/tmdb"
import ContentCard from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface ContentItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  overview?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  media_type: "movie" | "tv" | "person"
}

interface FilteredContentSectionProps {
  genreId: number | null
  genreName: string
  countryCode: string | null
  countryName: string
}

export default function FilteredContentSection({
  genreId,
  genreName,
  countryCode,
  countryName,
}: FilteredContentSectionProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (genreId || countryCode) {
      setPage(1)
      setContent([])
      fetchContent(1)
    }
  }, [genreId, countryCode])

  const fetchContent = async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await getFilteredMovies(genreId, countryCode, pageNum)
      const contentWithMediaType = data.results.map((item: ContentItem) => ({
        ...item,
        media_type: item.media_type || (item.title ? "movie" : "tv"),
      }))

      if (pageNum === 1) {
        setContent(contentWithMediaType)
      } else {
        setContent((prev) => [...prev, ...contentWithMediaType])
      }
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error("Error fetching filtered content:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    const container = document.getElementById("filtered-scroll")
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 300)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("filtered-scroll")
    if (container) {
      const newPosition = scrollPosition + 300
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchContent(nextPage)
    }
  }

  if (!genreId && !countryCode) {
    return null
  }

  const getTitle = () => {
    if (genreId && countryCode) {
      return `${genreName} from ${countryName}`
    } else if (genreId) {
      return genreName
    } else if (countryCode) {
      return `Movies from ${countryName}`
    }
    return "Filtered Content"
  }

  if (loading && content.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold">{getTitle()}</h2>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-48 h-72 bg-gray-800 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Filter className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
        <span className="text-gray-400">({content.length} results)</span>
      </div>

      {content.length > 0 ? (
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollLeft}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div
            id="filtered-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {content.map((item) => (
              <ContentCard key={`${item.media_type}-${item.id}`} content={item} />
            ))}
            {content.length > 0 && page < totalPages && (
              <div className="flex-shrink-0 w-48 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollRight}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No content found for the selected filters</p>
        </div>
      )}
    </div>
  )
}
