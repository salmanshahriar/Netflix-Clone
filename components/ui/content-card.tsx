import Link from "next/link"
import { Star, Play } from "lucide-react"
import WatchLaterButton from "@/components/ui/watch-later-button"

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

interface ContentCardProps {
  content: ContentItem
  showWatchLater?: boolean
}

export default function ContentCard({ content, showWatchLater = true }: ContentCardProps) {
  const getTitle = () => content.title || content.name || "Unknown"
  const getImagePath = () => content.poster_path || content.profile_path
  const getYear = () => {
    const date = content.release_date || content.first_air_date
    return date ? new Date(date).getFullYear() : null
  }

  const getHref = () => {
    if (content.media_type === "movie") return `/movie/${content.id}`
    if (content.media_type === "tv") return `/tv/${content.id}`
    return `/person/${content.id}`
  }

  const getWatchHref = () => {
    if (content.media_type === "movie") return `/watch/movie/${content.id}`
    if (content.media_type === "tv") return `/watch/tv/${content.id}/1/1`
    return getHref()
  }

  if (content.media_type === "person") {
    return (
      <Link href={getHref()}>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src={
                getImagePath()
                  ? `https://image.tmdb.org/t/p/w500${getImagePath()}`
                  : "/placeholder.svg?height=300&width=200"
              }
              alt={getTitle()}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">{getTitle()}</h3>
                {content.known_for_department && (
                  <p className="text-xs text-gray-300">{content.known_for_department}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const watchLaterItem =
    showWatchLater && content.media_type !== "person"
      ? {
          id: content.id,
          title: content.title || content.name || "",
          poster_path: content.poster_path || "",
          media_type: content.media_type,
          vote_average: content.vote_average || 0,
          release_date: content.release_date,
          first_air_date: content.first_air_date,
        }
      : null

  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <Link href={getHref()}>
          <img
            src={
              getImagePath()
                ? `https://image.tmdb.org/t/p/w500${getImagePath()}`
                : "/placeholder.svg?height=300&width=200"
            }
            alt={getTitle()}
            className="w-full h-64 md:h-80 object-cover"
          />
        </Link>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Link href={getWatchHref()}>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            </Link>
          </div>

          {/* Content Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{getTitle()}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  {content.vote_average && content.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{content.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  {getYear() && <span>{getYear()}</span>}
                  <span className="capitalize text-gray-400">{content.media_type}</span>
                </div>
              </div>

              {/* Watch Later Button */}
              {watchLaterItem && (
                <div className="flex-shrink-0">
                  <WatchLaterButton item={watchLaterItem} variant="ghost" size="sm" showText={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
