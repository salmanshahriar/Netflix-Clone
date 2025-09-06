"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Clock, Home, Film, Tv, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import GenreCountryFilters from "@/components/genre-country-filters"
import { getWatchLaterCount } from "@/lib/watch-later"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [watchLaterCount, setWatchLaterCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const updateCount = () => setWatchLaterCount(getWatchLaterCount())
    updateCount()

    // Listen for storage changes
    window.addEventListener("storage", updateCount)
    // Listen for custom events
    window.addEventListener("watchLaterUpdated", updateCount)

    return () => {
      window.removeEventListener("storage", updateCount)
      window.removeEventListener("watchLaterUpdated", updateCount)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/browse", label: "Browse", icon: Globe },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl lg:text-3xl font-black text-red-600">NETFLIX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-white bg-red-600/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {/* Watch Later */}
            <Link
              href="/watch-later"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
                isActive("/watch-later")
                  ? "text-white bg-red-600/20"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-medium">Watch Later</span>
              {watchLaterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {watchLaterCount > 99 ? "99+" : watchLaterCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Search & Filters */}
          <div className="hidden lg:flex items-center gap-4">
            <GenreCountryFilters />
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="py-4 space-y-4">
              {/* Mobile Search */}
              <div className="px-2">
                <SearchBar />
              </div>

              {/* Mobile Filters */}
              <div className="px-2">
                <GenreCountryFilters />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isActive(item.href)
                          ? "text-white bg-red-600/20 border-r-2 border-red-600"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}

                {/* Mobile Watch Later */}
                <Link
                  href="/watch-later"
                  className={`flex items-center gap-3 px-4 py-3 transition-colors relative ${
                    isActive("/watch-later")
                      ? "text-white bg-red-600/20 border-r-2 border-red-600"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Watch Later</span>
                  {watchLaterCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {watchLaterCount > 99 ? "99+" : watchLaterCount}
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
