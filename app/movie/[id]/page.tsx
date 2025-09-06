import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies } from "@/lib/tmdb"
import { Star, Calendar, Clock, Play } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/navbar"
import CastSection from "@/components/cast-section"
import TrailerSection from "@/components/trailer-section"
import SimilarMoviesSection from "@/components/similar-movies-section"
import WatchLaterButton from "@/components/watch-later-button"

interface MovieDetailsProps {
  params: { id: string }
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const movieId = Number.parseInt(params.id)
  const [movie, videos, credits, similarMovies] = await Promise.all([
    getMovieDetails(movieId),
    getMovieVideos(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
  ])

  const safeYear = (dateString?: string | null) => {
    if (!dateString) return undefined
    const y = new Date(dateString).getFullYear()
    return Number.isNaN(y) ? undefined : y
  }

  const releaseYear = safeYear(movie.release_date)

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <p className="text-xl">Movie not found</p>
        </div>
      </div>
    )
  }

  const watchLaterItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    media_type: "movie" as const,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative pt-16 lg:pt-20">
        <div
          className="h-[40vh] md:h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        </div>

        <div className="relative -mt-20 md:-mt-32 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={movie.title}
                  className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl glass-card"
                />
              </div>

              <div className="flex-1 space-y-4 md:space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{movie.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                    </div>
                    {releaseYear && (
                      <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span>{releaseYear}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 glass-card px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>{movie.runtime} min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre: any) => (
                      <span key={genre.id} className="glass-card px-3 py-1 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-base md:text-lg text-gray-300 leading-relaxed">{movie.overview}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="netflix-gradient hover:netflix-gradient-hover text-white font-semibold btn-netflix focus-netflix"
                    asChild
                  >
                    <Link href={`/watch/movie/${movie.id}`}>
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Play Now
                    </Link>
                  </Button>

                  <WatchLaterButton item={watchLaterItem} size="lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Movie Info</h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>
                        <span className="text-white font-medium">Budget:</span> $
                        {movie.budget?.toLocaleString() || "N/A"}
                      </p>
                      <p>
                        <span className="text-white font-medium">Revenue:</span> $
                        {movie.revenue?.toLocaleString() || "N/A"}
                      </p>
                      <p>
                        <span className="text-white font-medium">Status:</span> {movie.status}
                      </p>
                      <p>
                        <span className="text-white font-medium">Language:</span>{" "}
                        {movie.original_language?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {movie.production_companies?.length > 0 && (
                    <div className="glass-card p-4 rounded-lg">
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

            {/* Trailer Section */}
            <div className="mb-12">
              <TrailerSection videos={videos.results} />
            </div>

            {/* Similar Movies Section */}
            <div className="mb-12">
              <SimilarMoviesSection movies={similarMovies.results} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
