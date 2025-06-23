"use client"

import { useState, useEffect } from "react"
import { Play, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTVSeasonDetails } from "@/lib/tmdb"

interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  air_date: string
  runtime: number
  still_path: string | null
  vote_average: number
}

interface EpisodeListWatchProps {
  tvId: number
  numberOfSeasons: number
  showName: string
  currentSeason: number
  currentEpisode: number
}

export default function EpisodeListWatch({
  tvId,
  numberOfSeasons,
  showName,
  currentSeason,
  currentEpisode,
}: EpisodeListWatchProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        const seasonData = await getTVSeasonDetails(tvId, selectedSeason)
        setEpisodes(seasonData.episodes || [])
      } catch (error) {
        console.error("Error fetching episodes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [tvId, selectedSeason])

  const handleEpisodeClick = (episodeNumber: number) => {
    if (selectedSeason !== currentSeason || episodeNumber !== currentEpisode) {
      window.location.href = `/watch/tv/${tvId}/${selectedSeason}/${episodeNumber}`
    }
  }

  const seasons = Array.from({ length: numberOfSeasons }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Episodes</h3>
        <div className="flex gap-2 flex-wrap">
          {seasons.map((season) => (
            <Button
              key={season}
              variant={selectedSeason === season ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeason(season)}
              className={
                selectedSeason === season
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }
            >
              S{season}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-24 h-16 bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
          {episodes.map((episode) => {
            const isCurrentEpisode = selectedSeason === currentSeason && episode.episode_number === currentEpisode

            return (
              <div
                key={episode.id}
                className={`flex gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  isCurrentEpisode ? "bg-red-600/20 border border-red-600/50" : "bg-gray-800/50 hover:bg-gray-800"
                }`}
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      episode.still_path
                        ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                        : "/placeholder.svg?height=60&width=96"
                    }
                    alt={episode.name}
                    className="w-24 h-16 object-cover rounded"
                  />
                  {isCurrentEpisode ? (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4
                      className={`font-semibold text-sm line-clamp-1 ${
                        isCurrentEpisode ? "text-red-400" : "text-white"
                      }`}
                    >
                      {episode.episode_number}. {episode.name}
                    </h4>
                    {episode.vote_average > 0 && (
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs ml-2">
                        ★ {episode.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
                    {episode.air_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {episode.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{episode.runtime}m</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2">{episode.overview}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
