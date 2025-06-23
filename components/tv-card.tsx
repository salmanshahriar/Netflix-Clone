import Link from "next/link"
import { Star, Tv, Play } from "lucide-react"

const safeYear = (date?: string | null) => {
  if (!date) return undefined
  const y = new Date(date).getFullYear()
  return Number.isNaN(y) ? undefined : y
}

interface TVShow {
  id: number
  name: string
  poster_path: string
  overview: string
  vote_average: number
  first_air_date: string
  genre_ids: number[]
}

interface TVCardProps {
  tvShow: TVShow
}

export default function TVCard({ tvShow }: TVCardProps) {
  return (
    <Link href={`/tv/${tvShow.id}`}>
      <div className="flex-shrink-0 w-40 md:w-48 group cursor-pointer transition-all duration-300 hover-scale">
        <div className="relative overflow-hidden rounded-lg glass-card">
          <img
            src={
              tvShow.poster_path
                ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                : "/placeholder.svg?height=288&width=192"
            }
            alt={tvShow.name}
            className="w-full h-56 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-effect p-3 rounded-full">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 text-white">{tvShow.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Tv className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400">TV Show</span>
                <span>•</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{tvShow.vote_average.toFixed(1)}</span>
                {safeYear(tvShow.first_air_date) !== undefined && (
                  <>
                    <span>•</span>
                    <span>{safeYear(tvShow.first_air_date)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
