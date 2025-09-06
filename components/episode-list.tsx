"use client"

import { useState, useEffect } from "react"
import { Play, Calendar, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getTVSeasonDetails } from "@/lib/tmdb"
import VideoPlayerModal from "./video-player-modal"

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

interface EpisodeListProps {
  tvId: number
  numberOfSeasons: number
  showName: string
}

export default function EpisodeList({ tvId, numberOfSeasons, showName }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState("")
  const [currentEpisodeTitle, setCurrentEpisodeTitle] = useState("")

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

  const handlePlayEpisode = (episodeNumber: number, episodeName: string) => {
    // Navigate to watch page instead of opening modal
    window.location.href = `/watch/tv/${tvId}/${selectedSeason}/${episodeNumber}`
  }

  const seasons = Array.from({ length: numberOfSeasons }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Episodes</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
              Season {selectedSeason}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            {seasons.map((season) => (
              <DropdownMenuItem
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`cursor-pointer hover:bg-gray-700 ${
                  selectedSeason === season ? "bg-red-600 text-white" : "text-gray-300"
                }`}
              >
                Season {season}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-32 h-20 bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer"
              onClick={() => handlePlayEpisode(episode.episode_number, episode.name)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                      : "/placeholder.svg?height=80&width=128"
                  }
                  alt={episode.name}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white line-clamp-1">
                    {episode.episode_number}. {episode.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 ml-4">
                    {episode.vote_average > 0 && (
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded">
                        ★ {episode.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  {episode.air_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {episode.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{episode.runtime} min</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-300 line-clamp-2">{episode.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={currentVideoUrl}
        title={currentEpisodeTitle}
      />
    </div>
  )
}
