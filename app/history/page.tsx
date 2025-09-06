"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Play, Calendar, Star, Film, Tv, Clock, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar/navbar"
import LoadingScreen from "@/components/loading-screen"
import {
  getWatchHistory,
  removeFromHistory,
  clearAllHistory,
  type HistoryItem,
} from "@/lib/watch-history"

type FilterType = "all" | "movie" | "tv"

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")


  useEffect(() => {
    const loadHistory = () => {
      try {
        const historyItems = getWatchHistory()
        console.log("Loaded history items:", historyItems)
        setItems(historyItems)
        setLoading(false)
      } catch (error) {
        console.error("Error loading history:", error)
        setItems([])
        setLoading(false)
      }
    }

    loadHistory()

    const handleHistoryUpdate = (event: CustomEvent) => {
      console.log("History updated:", event.detail)
      setItems(event.detail || [])
    }

    window.addEventListener("historyUpdated", handleHistoryUpdate as EventListener)

    return () => {
      window.removeEventListener("historyUpdated", handleHistoryUpdate as EventListener)
    }
  }, [])


  useEffect(() => {
    let filtered = items


    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.media_type === filterType)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const title = (item.title || item.name || "").toLowerCase()
        const overview = (item.overview || "").toLowerCase()
        return title.includes(query) || overview.includes(query)
      })
    }

    setFilteredItems(filtered)
  }, [items, filterType, searchQuery])

  const handleRemove = (item: HistoryItem) => {
    removeFromHistory(item.id, item.media_type, item.season, item.episode)
  }

  const handleClearAll = () => {
    clearAllHistory()
    setShowClearConfirm(false)
  }

  const formatWatchedDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffHours < 1) return "Just now"
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
      if (diffDays === 1) return "Yesterday"
      if (diffDays < 7) return `${diffDays} days ago`

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    } catch (error) {
      return "Unknown"
    }
  }

  const getWatchHref = (item: HistoryItem) => {
    if (item.media_type === "movie") {
      return `/watch/movie/${item.id}`
    }
    return `/watch/tv/${item.id}/${item.season || 1}/${item.episode || 1}`
  }

  const getDetailsHref = (item: HistoryItem) => {
    if (item.media_type === "movie") {
      return `/movie/${item.id}`
    }
    return `/tv/${item.id}`
  }

  const groupItemsByDate = (items: HistoryItem[]) => {
    const groups: Record<string, HistoryItem[]> = {}

    items.forEach((item) => {
      const dateKey = formatWatchedDate(item.watchedAt)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(item)
    })

    return groups
  }

  if (loading) {
    return <LoadingScreen message="Loading your watch history..." />
  }

  const groupedItems = groupItemsByDate(filteredItems)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Watch History</h1>
                <p className="text-gray-400 mt-1">
                  {items.length > 0
                    ? `${items.length} item${items.length > 1 ? "s" : ""} • Last 100 entries`
                    : "No watch history yet"}
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(true)}
                className="bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30 self-start lg:self-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          {items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search your history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                {(["all", "movie", "tv"] as FilterType[]).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    onClick={() => setFilterType(type)}
                    className={`capitalize ${
                      filterType === type
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {type === "all" ? "All" : type === "movie" ? "Movies" : "TV Shows"}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Confirmation Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Clear All History?</h3>
                <p className="text-gray-400 mb-6">
                  This action cannot be undone. All your watch history will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={handleClearAll} className="flex-1">
                    Clear All
                  </Button>
                  <Button variant="outline" onClick={() => setShowClearConfirm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {items.length === 0 ? "No watch history yet" : "No results found"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {items.length === 0
                    ? "Start watching movies and TV shows to see your history here!"
                    : "Try adjusting your search or filter criteria."}
                </p>
                {items.length === 0 && (
                  <Link href="/">
                    <Button className="bg-red-600 hover:bg-red-700">Browse Content</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([date, dateItems]) => (
                <div key={date} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 sticky top-20 bg-black/80 backdrop-blur-sm py-2 z-10">
                    <Calendar className="w-4 h-4" />
                    {date}
                    <span className="text-sm text-gray-500">({dateItems.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateItems.map((item: HistoryItem) => (
                      <div
                        key={`${item.id}-${item.media_type}-${item.season ?? ""}-${item.episode ?? ""}`}
                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-200 group"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                : "/placeholder.svg?height=120&width=80"
                            }
                            alt={item.title || item.name || "Unknown"}
                            className="w-20 h-28 object-cover"
                          />
                        </div>

                        <div className="flex-1 p-4 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <Link href={getDetailsHref(item)}>
                                <h4 className="font-semibold text-white line-clamp-2 hover:text-red-400 transition-colors">
                                  {item.title || item.name || "Unknown Title"}
                                </h4>
                              </Link>
                              {item.season && item.episode && (
                                <p className="text-sm text-gray-400 mt-1">
                                  Season {item.season}, Episode {item.episode}
                                </p>
                              )}
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                item.media_type === "movie"
                                  ? "bg-blue-600/20 text-blue-400"
                                  : "bg-purple-600/20 text-purple-400"
                              }`}
                            >
                              {item.media_type === "movie" ? (
                                <Film className="w-3 h-3 mr-1" />
                              ) : (
                                <Tv className="w-3 h-3 mr-1" />
                              )}
                              {item.media_type === "movie" ? "Movie" : "TV"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                            {item.vote_average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span>{item.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                            <span>
                              {new Date(item.watchedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Link href={getWatchHref(item)} className="flex-1">
                              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                                <Play className="w-3 h-3 mr-2" />
                                {item.media_type === "movie" ? "Watch" : "Continue"}
                              </Button>
                            </Link>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemove(item)}
                              className="text-gray-400 hover:text-red-400 hover:bg-red-600/20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
