"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "./search-bar"
import FilterDropdowns from "./filter-dropdowns"
import NavLinks from "./nav-links"
import { getWatchLaterCount } from "@/lib/watch-later"
import { getHistoryCount } from "@/lib/watch-history"

export interface NavLinksProps {
  pathname: string
  watchLaterCount: number
  historyCount: number
}
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-gray-800/50"
          : "bg-gradient-to-b from-black/90 via-black/60 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-2xl lg:text-3xl font-black">
              <span className="text-red-600 group-hover:text-red-500 transition-colors">NUTTTFLIX</span>
              {/* <span className="text-white/80 ml-1 text-lg font-normal">CLONE</span> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks pathname={pathname} watchLaterCount={watchLaterCount} historyCount={historyCount} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <FilterDropdowns />
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50 rounded-b-2xl mt-1">
            <div className="py-6 space-y-6">
              {/* Mobile Search */}
              <div className="px-4">
                <SearchBar />
              </div>

              {/* Mobile Filters */}
              <div className="px-4">
                <FilterDropdowns />
              </div>

              {/* Mobile Navigation */}
              <div className="px-4">
                <NavLinks
                  pathname={pathname}
                  watchLaterCount={watchLaterCount}
                  historyCount={historyCount}
                  isMobile={true}
                  onItemClick={() => setIsMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
