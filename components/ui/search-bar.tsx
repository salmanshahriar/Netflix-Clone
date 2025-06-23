"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Film, Tv, User, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchMulti } from "@/lib/tmdb"

interface SuggestionItem {
  id: number
  title?: string
  name?: string
  media_type: "movie" | "tv" | "person"
  poster_path?: string
  profile_path?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const trendingQueries = ["Avengers", "Breaking Bad", "The Office", "Stranger Things", "Marvel", "Game of Thrones"]

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true)
      const debounceTimer = setTimeout(async () => {
        try {
          const data = await searchMulti(query, 1)
          setSuggestions(data.results.slice(0, 6))
        } catch (error) {
          console.error("Search suggestions error:", error)
        } finally {
          setLoading(false)
        }
      }, 300)

      return () => clearTimeout(debounceTimer)
    } else {
      setSuggestions([])
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSuggestions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0)
  }

  const handleSuggestionClick = (selectedQuery: string) => {
    setQuery(selectedQuery)
    router.push(`/search?q=${encodeURIComponent(selectedQuery)}`)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setQuery("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getIcon = (mediaType: string) => {
    switch (mediaType) {
      case "movie":
        return <Film className="w-4 h-4 text-red-400" />
      case "tv":
        return <Tv className="w-4 h-4 text-blue-400" />
      case "person":
        return <User className="w-4 h-4 text-green-400" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  const getHref = (item: SuggestionItem) => {
    if (item.media_type === "movie") return `/movie/${item.id}`
    if (item.media_type === "tv") return `/tv/${item.id}`
    return `/person/${item.id}`
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search movies, shows, people..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            className="bg-gray-900/50 backdrop-blur-sm border-gray-700 text-white placeholder-gray-400 pl-10 pr-8 focus:border-red-600 focus:ring-red-600/20 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
        <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700 rounded-full flex-shrink-0">
          <Search className="w-4 h-4" />
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            ) : query.length >= 2 && suggestions.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => {
                      const href = getHref(item)
                      router.push(href)
                      setShowSuggestions(false)
                    }}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <img
                      src={
                        item.poster_path || item.profile_path
                          ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}`
                          : "/placeholder.svg?height=60&width=40"
                      }
                      alt={item.title || item.name}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(item.media_type)}
                        <span className="text-white font-medium truncate text-sm">{item.title || item.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs capitalize">{item.media_type}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Trending Searches</span>
                </div>
                <div className="space-y-1">
                  {trendingQueries.map((trendingQuery) => (
                    <button
                      key={trendingQuery}
                      onClick={() => handleSuggestionClick(trendingQuery)}
                      className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-800/50 rounded transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 text-sm">{trendingQuery}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
