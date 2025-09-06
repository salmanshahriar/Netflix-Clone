"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Clock, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/search-bar"
import GenreCountryFilters from "@/components/ui/genre-country-filters"
import { getWatchLaterCount } from "@/lib/watch-later"
import { getHistoryCount } from "@/lib/watch-history"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [watchLaterCount, setWatchLaterCount] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const updateCounts = () => {
      setWatchLaterCount(getWatchLaterCount())
      setHistoryCount(getHistoryCount())
    }

    updateCounts()

    // Listen for storage changes and custom events
    const handleUpdate = () => updateCounts()
    window.addEventListener("storage", handleUpdate)
    window.addEventListener("watchLaterUpdated", handleUpdate)
    window.addEventListener("historyUpdated", handleUpdate)

    return () => {
      window.removeEventListener("storage", handleUpdate)
      window.removeEventListener("watchLaterUpdated", handleUpdate)
      window.removeEventListener("historyUpdated", handleUpdate)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-lg shadow-lg" : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span className="text-2xl lg:text-3xl font-black text-red-600 group-hover:text-red-500 transition-colors">
              NETFLIX CLONE
            </span>
          </Link>

          {/* Desktop Content */}
          <div className="hidden lg:flex items-center justify-end flex-1 ml-8">
            <div className="flex items-center gap-4">
              {/* Filters */}
              <GenreCountryFilters />

              {/* Search */}
              <SearchBar />

              {/* Watch Later */}
              <Link
                href="/watch-later"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 relative group ${
                  isActive("/watch-later")
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">Watch Later</span>
                {watchLaterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {watchLaterCount > 99 ? "99+" : watchLaterCount}
                  </span>
                )}
              </Link>

              {/* History */}
              <Link
                href="/history"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 relative group ${
                  isActive("/history")
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="font-medium">History</span>
                {historyCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {historyCount > 99 ? "99+" : historyCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 rounded-full flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800/50 rounded-b-2xl">
            <div className="py-6 space-y-6">
              {/* Mobile Search */}
              <div className="px-4">
                <SearchBar />
              </div>

              {/* Mobile Filters */}
              <div className="px-4">
                <GenreCountryFilters />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2 px-4">
                {/* Watch Later */}
                <Link
                  href="/watch-later"
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    isActive("/watch-later")
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Watch Later</span>
                  </div>
                  {watchLaterCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {watchLaterCount > 99 ? "99+" : watchLaterCount}
                    </span>
                  )}
                </Link>

                {/* History */}
                <Link
                  href="/history"
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    isActive("/history")
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5" />
                    <span className="font-medium">History</span>
                  </div>
                  {historyCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {historyCount > 99 ? "99+" : historyCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
