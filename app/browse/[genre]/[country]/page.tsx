"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { getFilteredMovies, getGenres, getCountries } from "@/lib/tmdb"
import ContentCard from "@/components/content-card"
import { Film, Globe, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar/navbar"

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

interface Genre {
  id: number
  name: string
}

interface Country {
  iso_3166_1: string
  english_name: string
  native_name: string
}

export default function BrowsePage() {
  const params = useParams()
  const genreId = Number.parseInt(params.genre as string)
  const countryCode = params.country as string

  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [genreName, setGenreName] = useState("")
  const [countryName, setCountryName] = useState("")
  const observer = useRef<IntersectionObserver | null>(null)

  const lastContentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore],
  )

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const [genresData, countriesData] = await Promise.all([getGenres(), getCountries()])

        const genre = genresData.genres.find((g: Genre) => g.id === genreId)
        setGenreName(genre?.name || "Unknown Genre")

        const country = countriesData.find((c: Country) => c.iso_3166_1 === countryCode)
        setCountryName(country?.english_name || "Unknown Country")
      } catch (error) {
        console.error("Error fetching names:", error)
        setGenreName("Unknown Genre")
        setCountryName("Unknown Country")
      }
    }

    fetchNames()
    fetchContent(1)
  }, [genreId, countryCode])

  const fetchContent = async (pageNum: number) => {
    if (pageNum === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const data = await getFilteredMovies(genreId, countryCode, pageNum)
      const contentWithMediaType = data.results.map((item: ContentItem) => ({
        ...item,
        media_type: item.media_type
          ? item.media_type
          : item.title
          ? "movie"
          : item.name
          ? "tv"
          : "person",
      }))

      if (pageNum === 1) {
        setContent(contentWithMediaType)
      } else {
        setContent((prev) => [...prev, ...contentWithMediaType])
      }

      setTotalPages(data.total_pages)
      setHasMore(pageNum < data.total_pages)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchContent(page + 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Film className="w-6 h-6 text-red-600" />
              <Globe className="w-6 h-6 text-blue-600" />
              <h1 className="text-4xl font-bold">
                {genreName} from {countryName}
              </h1>
            </div>
            <p className="text-gray-400">
              Discover {genreName.toLowerCase()} movies and TV shows from {countryName}
              {content.length > 0 && ` (${content.length} results)`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-full h-72 bg-gray-800 animate-pulse rounded" />
              ))}
            </div>
          ) : content.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
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

              {loadingMore && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full h-72 bg-gray-800 animate-pulse rounded" />
                  ))}
                </div>
              )}

              {loadingMore && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more content...</span>
                  </div>
                </div>
              )}

              {!hasMore && content.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    You've reached the end of {genreName.toLowerCase()} content from {countryName}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Film className="w-16 h-16 text-gray-600" />
                <Globe className="w-16 h-16 text-gray-600" />
              </div>
              <p className="text-xl text-gray-400">
                No {genreName.toLowerCase()} content found from {countryName}
              </p>
              <p className="text-gray-500 mt-2">Try different genre and country combinations</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
