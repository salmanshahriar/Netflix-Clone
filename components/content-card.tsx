import Link from "next/link"
import { Star, Tv, User, Play } from "lucide-react"

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
}

export default function ContentCard({ content }: ContentCardProps) {
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

  const getMediaIcon = () => {
    switch (content.media_type) {
      case "tv":
        return <Tv className="w-3 h-3 text-blue-400" />
      case "person":
        return <User className="w-3 h-3 text-green-400" />
      default:
        return null
    }
  }

  return (
    <Link href={getHref()}>
      <div className="flex-shrink-0 w-40 md:w-48 group cursor-pointer transition-all duration-300 hover-scale">
        <div className="relative overflow-hidden rounded-lg glass-card">
          <img
            src={
              getImagePath()
                ? `https://image.tmdb.org/t/p/w500${getImagePath()}`
                : "/placeholder.svg?height=288&width=192"
            }
            alt={getTitle()}
            className="w-full h-56 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {content.media_type !== "person" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-effect p-3 rounded-full">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 text-white">{getTitle()}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                {getMediaIcon()}
                <span className="capitalize">{content.media_type}</span>
                {content.vote_average && content.vote_average > 0 && (
                  <>
                    <span>•</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{content.vote_average.toFixed(1)}</span>
                  </>
                )}
                {getYear() && (
                  <>
                    <span>•</span>
                    <span>{getYear()}</span>
                  </>
                )}
              </div>
              {content.known_for_department && (
                <p className="text-xs text-gray-400 mt-1">{content.known_for_department}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
