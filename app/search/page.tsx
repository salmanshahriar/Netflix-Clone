"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { searchMulti } from "@/lib/tmdb"
import ContentCard from "@/components/content-card"
import Navbar from "@/components/navbar/navbar"
import LoadingScreen from "@/components/loading-screen"

interface ContentItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  profile_path?: string
  overview?: string
  biography?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  media_type: "movie" | "tv" | "person"
  known_for_department?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver>()

  const lastContentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  useEffect(() => {
    if (query) {
      setPage(1)
      setContent([])
      setHasMore(true)
      performSearch(query, 1)
    }
  }, [query])

  const performSearch = async (searchQuery: string, pageNum: number) => {
    setLoading(true)
    try {
      const data = await searchMulti(searchQuery, pageNum)
      const filteredResults = data.results.filter(
        (item: ContentItem) => item.media_type !== "person" || item.profile_path,
      )

      if (pageNum === 1) {
        setContent(filteredResults)
      } else {
        setContent((prev) => [...prev, ...filteredResults])
      }
      setTotalPages(data.total_pages)
      setHasMore(pageNum < data.total_pages)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      performSearch(query, nextPage)
    }
  }

  const getContentTypeCount = (type: string) => {
    return content.filter((item) => item.media_type === type).length
  }

  if (loading && content.length === 0) {
    return <LoadingScreen message="Searching content..." />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Search Results</h1>
            {query && (
              <div className="space-y-2">
                <p className="text-gray-400">
                  Showing results for "{query}" ({content.length} results found)
                </p>
                {content.length > 0 && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="glass-card px-3 py-1 rounded-full">Movies: {getContentTypeCount("movie")}</span>
                    <span className="glass-card px-3 py-1 rounded-full">TV Shows: {getContentTypeCount("tv")}</span>
                    <span className="glass-card px-3 py-1 rounded-full">People: {getContentTypeCount("person")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {content.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
                {content.map((item, index) => {
                  if (content.length === index + 1) {
                    return (
                      <div key={`${item.media_type}-${item.id}`} ref={lastContentElementRef}>
                        <ContentCard content={item} />
                      </div>
                    )
                  } else {
                    return <ContentCard key={`${item.media_type}-${item.id}`} content={item} />
                  }
                })}
              </div>

              {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full h-56 md:h-72 glass-card animate-pulse rounded-lg" />
                  ))}
                </div>
              )}

              {!hasMore && content.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">You've reached the end of the results</p>
                </div>
              )}
            </>
          ) : query ? (
            <div className="text-center py-12">
              <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
                <p className="text-xl text-gray-400 mb-2">No content found for "{query}"</p>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
                <p className="text-xl text-gray-400">Enter a search term to find movies, TV shows, and people</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
