import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies } from "@/lib/tmdb"
import { Star, Calendar, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/navbar/navbar"
import CastSection from "@/components/cast-section"
import SimilarMoviesSection from "@/components/similar-movies-section"
import VideoPlayerWithSources from "@/components/video-player-with-sources"
import { addToHistory } from "@/lib/watch-history"

interface WatchMoviePageProps {
  params: { id: string }
}

export default async function WatchMoviePage({ params }: WatchMoviePageProps) {
  const movieId = Number.parseInt(params.id)
  const [movie, videos, credits, similarMovies] = await Promise.all([
    getMovieDetails(movieId),
    getMovieVideos(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
  ])

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
          <p className="text-xl">Movie not found</p>
        </div>
      </div>
    )
  }

  // Add to history when page loads
  if (typeof window !== "undefined") {
    addToHistory({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      media_type: "movie",
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-16 lg:pt-18">
        {/* Video Player with Source Selection */}
        <VideoPlayerWithSources movieId={movieId} title={movie.title} />

        {/* Movie Details */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/placeholder.svg?height=450&width=300"
                }
                alt={movie.title}
                className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-xl shadow-2xl"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{movie.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                  <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-600/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-600/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre: any) => (
                    <span key={genre.id} className="bg-gray-600/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed">{movie.overview}</p>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-gray-600/20 backdrop-blur-sm border-gray-600 hover:bg-gray-600/30 text-white"
                  asChild
                >
                  <Link href={`/movie/${movie.id}`}>
                    <Info className="w-5 h-5 mr-2" />
                    Movie Details
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3">Movie Info</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>
                      <span className="text-white font-medium">Budget:</span> ${movie.budget?.toLocaleString() || "N/A"}
                    </p>
                    <p>
                      <span className="text-white font-medium">Revenue:</span> $
                      {movie.revenue?.toLocaleString() || "N/A"}
                    </p>
                    <p>
                      <span className="text-white font-medium">Status:</span> {movie.status}
                    </p>
                    <p>
                      <span className="text-white font-medium">Language:</span> {movie.original_language?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {movie.production_companies?.length > 0 && (
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">Production</h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      {movie.production_companies.slice(0, 3).map((company: any) => (
                        <p key={company.id}>{company.name}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mb-12">
            <CastSection cast={credits.cast} />
          </div>

          {/* Similar Movies Section */}
          <div className="mb-12">
            <SimilarMoviesSection movies={similarMovies.results} />
          </div>
        </div>
      </div>
    </div>
  )
}
