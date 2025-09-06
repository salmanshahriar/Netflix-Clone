import { getTVShowDetails, getTVSeasonDetails } from "@/lib/tmdb"
import { Star, Calendar, Clock, ArrowLeft, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EpisodeList from "@/components/episode-list-watch"
import VideoPlayerWithSources from "@/components/video-player-with-sources"

interface WatchTVPageProps {
  params: {
    id: string
    season: string
    episode: string
  }
}

export default async function WatchTVPage({ params }: WatchTVPageProps) {
  const tvId = Number.parseInt(params.id)
  const seasonNumber = Number.parseInt(params.season)
  const episodeNumber = Number.parseInt(params.episode)

  const [tvShow, seasonData] = await Promise.all([getTVShowDetails(tvId), getTVSeasonDetails(tvId, seasonNumber)])

  const currentEpisode = seasonData.episodes?.find((ep: any) => ep.episode_number === episodeNumber)

  if (!tvShow || !currentEpisode) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Episode not found</p>
      </div>
    )
  }

  const nextEpisode = seasonData.episodes?.find((ep: any) => ep.episode_number === episodeNumber + 1)
  const prevEpisode = seasonData.episodes?.find((ep: any) => ep.episode_number === episodeNumber - 1)

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/tv/${tvShow.id}`}>
            <Button variant="ghost" size="icon" className="hover:bg-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {tvShow.name} - S{seasonNumber}E{episodeNumber}: {currentEpisode.name}
          </h1>
        </div>
      </nav>

      {/* Video Player with Source Selection */}
      <VideoPlayerWithSources
        tvId={tvId}
        season={seasonNumber}
        episode={episodeNumber}
        title={`${tvShow.name} - S${seasonNumber}E${episodeNumber}`}
      />

      {/* Episode Navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {prevEpisode && (
              <Link href={`/watch/tv/${tvId}/${seasonNumber}/${prevEpisode.episode_number}`}>
                <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Episode
                </Button>
              </Link>
            )}
          </div>
          <div>
            {nextEpisode && (
              <Link href={`/watch/tv/${tvId}/${seasonNumber}/${nextEpisode.episode_number}`}>
                <Button className="bg-red-600 hover:bg-red-700">
                  Next Episode
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Show and Episode Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Show Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={
                    tvShow.poster_path
                      ? `https://image.tmdb.org/t/p/w300${tvShow.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={tvShow.name}
                  className="w-48 h-72 object-cover rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{tvShow.name}</h2>
                  <h3 className="text-xl text-gray-300 mb-4">
                    Season {seasonNumber}, Episode {episodeNumber}: {currentEpisode.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{currentEpisode.vote_average?.toFixed(1) || "N/A"}</span>
                    </div>
                    {currentEpisode.air_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(currentEpisode.air_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {currentEpisode.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentEpisode.runtime} min</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tvShow.genres.map((genre: any) => (
                      <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Episode Overview</h4>
                  <p className="text-gray-300 leading-relaxed">{currentEpisode.overview}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Show Overview</h4>
                  <p className="text-gray-300 leading-relaxed">{tvShow.overview}</p>
                </div>

                <div className="flex gap-4">
                  <Button size="lg" variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                    <Info className="w-5 h-5 mr-2" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>

            {/* Show Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Show Info</h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-white font-medium">Status:</span> {tvShow.status}
                  </p>
                  <p>
                    <span className="text-white font-medium">Original Language:</span>{" "}
                    {tvShow.original_language?.toUpperCase()}
                  </p>
                  <p>
                    <span className="text-white font-medium">Total Seasons:</span> {tvShow.number_of_seasons}
                  </p>
                  <p>
                    <span className="text-white font-medium">Total Episodes:</span> {tvShow.number_of_episodes}
                  </p>
                </div>
              </div>

              {tvShow.networks?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Networks</h3>
                  <div className="space-y-2 text-gray-300">
                    {tvShow.networks.slice(0, 3).map((network: any) => (
                      <p key={network.id}>{network.name}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Episode List */}
          <div className="lg:col-span-1">
            <EpisodeList
              tvId={tvShow.id}
              numberOfSeasons={tvShow.number_of_seasons}
              showName={tvShow.name}
              currentSeason={seasonNumber}
              currentEpisode={episodeNumber}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
