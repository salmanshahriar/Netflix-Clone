import { getTVShowDetails, getTVShowVideos } from "@/lib/tmdb"
import { Star, Calendar, Clock, Tv } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import EpisodeList from "@/components/episode-list"
import WatchLaterButton from "@/components/watch-later-button"

interface TVShowDetailsProps {
  params: { id: string }
}

export default async function TVShowDetailsPage({ params }: TVShowDetailsProps) {
  const tvId = Number.parseInt(params.id)
  const [tvShow, videos] = await Promise.all([getTVShowDetails(tvId), getTVShowVideos(tvId)])

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <p className="text-xl">TV Show not found</p>
        </div>
      </div>
    )
  }

  const watchLaterItem = {
    id: tvShow.id,
    title: tvShow.name,
    poster_path: tvShow.poster_path,
    media_type: "tv" as const,
    vote_average: tvShow.vote_average,
    first_air_date: tvShow.first_air_date,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative pt-16 lg:pt-20">
        <div
          className="h-[40vh] md:h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        </div>

        <div className="relative -mt-20 md:-mt-32 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={
                    tvShow.poster_path
                      ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={tvShow.name}
                  className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl glass-card"
                />
              </div>

              <div className="flex-1 space-y-4 md:space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tv className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-400 font-medium">TV Series</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{tvShow.name}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                      {tvShow.last_air_date && <span> - {new Date(tvShow.last_air_date).getFullYear()}</span>}
                    </div>
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>
                        {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <span>{tvShow.number_of_episodes} Episodes</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {tvShow.genres.map((genre: any) => (
                      <span key={genre.id} className="glass-card px-3 py-1 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-base md:text-lg text-gray-300 leading-relaxed">{tvShow.overview}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <WatchLaterButton item={watchLaterItem} size="lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Show Info</h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>
                        <span className="text-white font-medium">Status:</span> {tvShow.status}
                      </p>
                      <p>
                        <span className="text-white font-medium">Language:</span>{" "}
                        {tvShow.original_language?.toUpperCase()}
                      </p>
                      <p>
                        <span className="text-white font-medium">Type:</span> {tvShow.type}
                      </p>
                      {tvShow.episode_run_time?.length > 0 && (
                        <p>
                          <span className="text-white font-medium">Episode Runtime:</span> {tvShow.episode_run_time[0]}{" "}
                          min
                        </p>
                      )}
                    </div>
                  </div>

                  {tvShow.networks?.length > 0 && (
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Networks</h3>
                      <div className="space-y-2 text-gray-300 text-sm">
                        {tvShow.networks.slice(0, 3).map((network: any) => (
                          <p key={network.id}>{network.name}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {tvShow.created_by?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Created By</h3>
                    <div className="flex flex-wrap gap-2">
                      {tvShow.created_by.map((creator: any) => (
                        <span key={creator.id} className="glass-card px-3 py-1 rounded-full text-sm">
                          {creator.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Episodes Section */}
                <div className="mb-12">
                  <EpisodeList tvId={tvShow.id} numberOfSeasons={tvShow.number_of_seasons} showName={tvShow.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
