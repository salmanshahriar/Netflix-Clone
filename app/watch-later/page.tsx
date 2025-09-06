"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Clock, Trash2, Play, Calendar, Star, Film, Tv, Search, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar/navbar"
import { getWatchLaterItems, removeFromWatchLater, clearWatchLater, type WatchLaterItem } from "@/lib/watch-later"

type FilterType = "all" | "movie" | "tv"
type SortType = "newest" | "oldest" | "title" | "rating"

export default function WatchLaterPage() {
  const [items, setItems] = useState<WatchLaterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortBy, setSortBy] = useState<SortType>("newest")
  const [searchQuery, setSearchQuery] = useState("")

  const loadItems = useCallback(() => {
    try {
      setLoading(true)
      setError(null)

      const watchLaterItems = getWatchLaterItems()
      console.log("Raw watch later items:", watchLaterItems)
      console.log("Sample item structure:", watchLaterItems[0])
      console.log("Loaded watch later items:", watchLaterItems)

      setItems(watchLaterItems)
    } catch (err) {
      console.error("Error loading watch later items:", err)
      setError("Failed to load watch later items")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Listen for updates
  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      console.log("Watch later updated:", event.detail)
      loadItems()
    }

    window.addEventListener("watchLaterUpdated", handleUpdate as EventListener)

    return () => {
      window.removeEventListener("watchLaterUpdated", handleUpdate as EventListener)
    }
  }, [loadItems])

  // Handle remove item
  const handleRemove = async (id: number, mediaType: "movie" | "tv") => {
    try {
      const success = removeFromWatchLater(id, mediaType)
      if (success) {
        setItems((prev) => prev.filter((item) => !(item.id === id && item.media_type === mediaType)))
      }
    } catch (error) {
      console.error("Error removing item:", error)
      setError("Failed to remove item")
    }
  }

  // Handle clear all
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to remove all items from your watch later list?")) {
      return
    }

    try {
      const success = clearWatchLater()
      if (success) {
        setItems([])
      }
    } catch (error) {
      console.error("Error clearing watch later:", error)
      setError("Failed to clear watch later list")
    }
  }

  // Filter and sort items
  const processedItems = items
    .filter((item) => {
      // Filter by type
      if (filter !== "all" && item.media_type !== filter) return false

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const title = (item.title || item.name || "").toLowerCase()
        const overview = (item.overview || "").toLowerCase()
        return title.includes(query) || overview.includes(query)
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        case "oldest":
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        case "title":
          const titleA = (a.title || a.name || "").toLowerCase()
          const titleB = (b.title || b.name || "").toLowerCase()
          return titleA.localeCompare(titleB)
        case "rating":
          return (b.vote_average || 0) - (a.vote_average || 0)
        default:
          return 0
      }
    })

  const movieCount = items.filter((item) => item.media_type === "movie").length
  const tvCount = items.filter((item) => item.media_type === "tv").length

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
                <p className="text-gray-400">Loading your watch later list...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <Button onClick={loadItems} className="bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-red-600" />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Watch Later</h1>
                  <p className="text-gray-400 mt-1">
                    {items.length === 0
                      ? "No saved items"
                      : `${items.length} saved ${items.length === 1 ? "item" : "items"}`}
                  </p>
                </div>
              </div>

              {items.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Controls */}
            {items.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search your watch later list..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-gray-900/50 rounded-lg p-1">
                    <Button
                      size="sm"
                      variant={filter === "all" ? "default" : "ghost"}
                      onClick={() => setFilter("all")}
                      className={filter === "all" ? "bg-red-600 hover:bg-red-700" : "text-gray-400 hover:text-white"}
                    >
                      All ({items.length})
                    </Button>
                    <Button
                      size="sm"
                      variant={filter === "movie" ? "default" : "ghost"}
                      onClick={() => setFilter("movie")}
                      className={filter === "movie" ? "bg-red-600 hover:bg-red-700" : "text-gray-400 hover:text-white"}
                    >
                      <Film className="w-4 h-4 mr-1" />
                      Movies ({movieCount})
                    </Button>
                    <Button
                      size="sm"
                      variant={filter === "tv" ? "default" : "ghost"}
                      onClick={() => setFilter("tv")}
                      className={filter === "tv" ? "bg-red-600 hover:bg-red-700" : "text-gray-400 hover:text-white"}
                    >
                      <Tv className="w-4 h-4 mr-1" />
                      TV Shows ({tvCount})
                    </Button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {processedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {searchQuery
                    ? "No results found"
                    : items.length === 0
                      ? "No items in your watch later list"
                      : `No ${filter === "movie" ? "movies" : "TV shows"} found`}
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : items.length === 0
                      ? "Start adding movies and TV shows you want to watch later!"
                      : `No ${filter === "movie" ? "movies" : "TV shows"} match your current filter.`}
                </p>
                {!searchQuery && items.length === 0 && (
                  <Link href="/">
                    <Button className="bg-red-600 hover:bg-red-700">Browse Content</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {processedItems.map((item) => {
                const title = item.title || item.name || "Unknown Title"
                const posterUrl = item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "/placeholder.svg?height=400&width=300&text=No+Image"
                const rating = item.vote_average || 0
                const year = item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : item.first_air_date
                    ? new Date(item.first_air_date).getFullYear()
                    : null

                console.log("Rendering item:", { title, posterUrl, rating, year, item }) // Debug log

                return (
                  <div key={`${item.media_type}-${item.id}`} className="group">
                    <div className="glass-card rounded-lg overflow-hidden hover-scale transition-all duration-300 hover:shadow-2xl">
                      <div className="relative">
                        <img
                          src={posterUrl || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-64 sm:h-80 object-cover"
                          onLoad={() => console.log("Image loaded:", posterUrl)}
                          onError={(e) => {
                            console.log("Image error:", posterUrl)
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=400&width=300&text=No+Image"
                          }}
                        />

                        {/* Media Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                              item.media_type === "movie"
                                ? "bg-blue-600/90 text-blue-100"
                                : "bg-purple-600/90 text-purple-100"
                            }`}
                          >
                            {item.media_type === "movie" ? (
                              <>
                                <Film className="w-3 h-3 mr-1" /> Movie
                              </>
                            ) : (
                              <>
                                <Tv className="w-3 h-3 mr-1" /> TV Show
                              </>
                            )}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        {rating > 0 && (
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600/90 text-yellow-100 backdrop-blur-sm">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay - Fixed positioning and z-index */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                          <div className="flex gap-3">
                            <Link
                              href={`/watch/${item.media_type}/${item.id}${item.media_type === "tv" ? "/1/1" : ""}`}
                            >
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 shadow-lg">
                                <Play className="w-4 h-4 mr-1" />
                                Watch
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemove(item.id, item.media_type)}
                              className="bg-red-600/80 hover:bg-red-600 border-red-600/50 shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2" title={title}>
                          {title}
                        </h3>

                        {item.overview && (
                          <p className="text-sm text-gray-400 line-clamp-3 mb-3" title={item.overview}>
                            {item.overview}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{year || "N/A"}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              Added{" "}
                              {new Date(item.addedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
