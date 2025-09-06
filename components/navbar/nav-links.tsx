"use client"

import Link from "next/link"

export interface NavLinksProps {
  pathname: string
  watchLaterCount: number
  historyCount: number
  isMobile?: boolean
  onItemClick?: () => void
}

export default function NavLinks({ pathname, watchLaterCount, historyCount, isMobile = false, onItemClick }: NavLinksProps) {
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const linkClass = (href: string) => {
    const baseClass = isMobile
      ? "flex items-center justify-between p-4 rounded-xl transition-all duration-200"
      : "px-4 py-2 rounded-full transition-all duration-200 relative"

    const activeClass = isActive(href)
      ? "bg-red-600 text-white shadow-lg"
      : "text-gray-300 hover:text-white hover:bg-white/10"

    return `${baseClass} ${activeClass}`
  }

  const CountBadge = ({ count }: { count: number }) => {
    if (count === 0) return null

    return (
      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px] text-center">
        {count > 99 ? "99+" : count}
      </span>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Link href="/watch-later" className={linkClass("/watch-later")} onClick={onItemClick}>
          <span className="bg-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/60 text-white rounded-full px-4 py-2 transition-all duration-200">Watch Later</span>
          <CountBadge count={watchLaterCount} />
        </Link>

        {/* <Link href="/history" className={linkClass("/history")} onClick={onItemClick}>
          <span className="font-medium">History</span>
        </Link> */}
      </div>
    )
  }

  return (
    <>
      <Link href="/watch-later" className={linkClass("/watch-later")}>
        <span className="bg-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/60 text-white rounded-full px-4 py-2 transition-all duration-200">Watch Later</span>
        {watchLaterCount > 0 && (
          <div className="absolute -top-2 -right-2">
            <CountBadge count={watchLaterCount} />
          </div>
        )}
      </Link>
{/* 
      <Link href="/history" className={linkClass("/history")}>
        <span className="font-medium">History</span>
      </Link> */}
    </>
  )
}
