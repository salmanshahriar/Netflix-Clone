import Link from "next/link"
import { User, Calendar, MapPin, Film, Tv, Star } from "lucide-react"
import { getPersonDetails, getPersonCombinedCredits } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/navbar"

interface PersonDetailsProps {
  params: { id: string }
}

interface CreditItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  overview?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  media_type: "movie" | "tv"
  character?: string
  job?: string
  department?: string
}

export default async function PersonDetailsPage({ params }: PersonDetailsProps) {
  const personId = Number.parseInt(params.id)
  const [person, credits] = await Promise.all([getPersonDetails(personId), getPersonCombinedCredits(personId)])

  if (!person) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Person not found</p>
      </div>
    )
  }

  // Sort and filter credits
  const allCredits = [...(credits.cast || []), ...(credits.crew || [])]
  const uniqueCredits = allCredits.reduce((acc: CreditItem[], current) => {
    const existing = acc.find((item) => item.id === current.id && item.media_type === current.media_type)
    if (!existing) {
      acc.push({
        ...current,
        media_type: current.media_type as "movie" | "tv",
      })
    }
    return acc
  }, [])

  // Sort by popularity/vote average and release date
  const sortedCredits = uniqueCredits
    .filter((credit) => credit.poster_path) // Only show items with posters
    .sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01")
      const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01")
      return dateB.getTime() - dateA.getTime()
    })

  const movieCredits = sortedCredits.filter((credit) => credit.media_type === "movie")
  const tvCredits = sortedCredits.filter((credit) => credit.media_type === "tv")

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-shrink-0">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    : "/placeholder.svg?height=450&width=300"
                }
                alt={person.name}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-medium">Person</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{person.name}</h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                  {person.birthday && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(person.birthday).toLocaleDateString()}</span>
                      {person.deathday && <span> - {new Date(person.deathday).toLocaleDateString()}</span>}
                    </div>
                  )}
                  {person.place_of_birth && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{person.place_of_birth}</span>
                    </div>
                  )}
                </div>

                {person.known_for_department && (
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-green-900/30 rounded-full text-sm">
                      {person.known_for_department}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{movieCredits.length}</div>
                    <div className="text-sm text-gray-400">Movies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{tvCredits.length}</div>
                    <div className="text-sm text-gray-400">TV Shows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{sortedCredits.length}</div>
                    <div className="text-sm text-gray-400">Total Credits</div>
                  </div>
                </div>
              </div>

              {person.biography && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Biography</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{person.biography}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Personal Info</h3>
                  <div className="space-y-2 text-gray-300">
                    {person.also_known_as?.length > 0 && (
                      <div>
                        <span className="text-white font-medium">Also Known As:</span>
                        <div className="mt-1">
                          {person.also_known_as.slice(0, 3).map((name: string, index: number) => (
                            <p key={index} className="text-sm">
                              {name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {person.gender && (
                      <p>
                        <span className="text-white font-medium">Gender:</span>{" "}
                        {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Other"}
                      </p>
                    )}
                    {person.popularity && (
                      <p>
                        <span className="text-white font-medium">Popularity:</span> {person.popularity.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filmography Section */}
          <div className="space-y-12">
            {/* Movies */}
            {movieCredits.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Film className="w-6 h-6 text-blue-400" />
                  <h2 className="text-3xl font-bold">Movies ({movieCredits.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {movieCredits.slice(0, 24).map((movie) => (
                    <div key={`movie-${movie.id}`} className="group">
                      <Link href={`/movie/${movie.id}`}>
                        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                : "/placeholder.svg?height=450&width=300"
                            }
                            alt={movie.title || movie.name}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-300">
                                {movie.vote_average && movie.vote_average > 0 && (
                                  <>
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                  </>
                                )}
                                {movie.release_date && (
                                  <>
                                    {movie.vote_average && movie.vote_average > 0 && <span>•</span>}
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                  </>
                                )}
                              </div>
                              {movie.character && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">as {movie.character}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {movieCredits.length > 24 && (
                  <div className="text-center mt-6">
                    <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                      Show All {movieCredits.length} Movies
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* TV Shows */}
            {tvCredits.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Tv className="w-6 h-6 text-green-400" />
                  <h2 className="text-3xl font-bold">TV Shows ({tvCredits.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {tvCredits.slice(0, 24).map((show) => (
                    <div key={`tv-${show.id}`} className="group">
                      <Link href={`/tv/${show.id}`}>
                        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
                          <img
                            src={
                              show.poster_path
                                ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                                : "/placeholder.svg?height=450&width=300"
                            }
                            alt={show.title || show.name}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{show.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-300">
                                {show.vote_average && show.vote_average > 0 && (
                                  <>
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{show.vote_average.toFixed(1)}</span>
                                  </>
                                )}
                                {show.first_air_date && (
                                  <>
                                    {show.vote_average && show.vote_average > 0 && <span>•</span>}
                                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                                  </>
                                )}
                              </div>
                              {show.character && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">as {show.character}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {tvCredits.length > 24 && (
                  <div className="text-center mt-6">
                    <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                      Show All {tvCredits.length} TV Shows
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* No credits message */}
            {sortedCredits.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No filmography available for this person</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
