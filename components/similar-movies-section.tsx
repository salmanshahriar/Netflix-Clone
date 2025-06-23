import MovieCard from "@/components/movie-card"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  vote_average: number
  release_date: string
}

interface SimilarMoviesSectionProps {
  movies: Movie[]
}

export default function SimilarMoviesSection({ movies }: SimilarMoviesSectionProps) {
  const similarMovies = movies.slice(0, 12) // Show top 12 similar movies

  if (similarMovies.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">More Like This</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {similarMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
