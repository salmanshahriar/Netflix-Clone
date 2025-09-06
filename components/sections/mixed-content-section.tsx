"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/tmdb"
import ContentCard from "@/components/ui/content-card"
import ContentSection from "@/components/ui/content-section"
import { Button } from "@/components/ui/button"

interface ContentItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  overview?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  media_type?: "movie" | "tv"
}

interface MixedContentSectionProps {
  title: string
  endpoint: string
}

export default function MixedContentSection({ title, endpoint }: MixedContentSectionProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getMovies(endpoint, page)
        const contentWithMediaType = data.results.map((item: ContentItem) => ({
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }))

        if (page === 1) {
          setContent(contentWithMediaType)
        } else {
          setContent((prev) => [...prev, ...contentWithMediaType])
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
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
      {content.map((item) => (
        <div key={item.id} className="w-48 flex-shrink-0">
          <ContentCard content={item} />
        </div>
      ))}
      {content.length > 0 && (
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
