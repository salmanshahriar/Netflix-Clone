"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Globe, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGenres, getCountries } from "@/lib/tmdb"

interface Genre {
  id: number
  name: string
}

interface Country {
  iso_3166_1: string
  english_name: string
  native_name: string
}

export default function GenreCountryFilters() {
  const router = useRouter()
  const [genres, setGenres] = useState<Genre[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedGenre, setSelectedGenre] = useState<{ id: number | null; name: string }>({
    id: null,
    name: "All Genres",
  })
  const [selectedCountry, setSelectedCountry] = useState<{ code: string | null; name: string }>({
    code: null,
    name: "All Countries",
  })
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, countriesData] = await Promise.all([getGenres(), getCountries()])
        setGenres(genresData.genres || [])
        setCountries(countriesData || [])
      } catch (error) {
        console.error("Error fetching genres/countries:", error)
      }
    }

    fetchData()
  }, [])

  const handleGenreSelect = (genre: Genre | null) => {
    const newSelection = genre ? { id: genre.id, name: genre.name } : { id: null, name: "All Genres" }
    setSelectedGenre(newSelection)
    setShowGenreDropdown(false)

    if (newSelection.id && selectedCountry.code) {
      router.push(`/browse/${newSelection.id}/${selectedCountry.code}`)
    } else if (newSelection.id) {
      router.push(`/genre/${newSelection.id}`)
    } else if (selectedCountry.code) {
      router.push(`/country/${selectedCountry.code}`)
    } else {
      router.push("/")
    }
  }

  const handleCountrySelect = (country: Country | null) => {
    const newSelection = country
      ? { code: country.iso_3166_1, name: country.english_name }
      : { code: null, name: "All Countries" }
    setSelectedCountry(newSelection)
    setShowCountryDropdown(false)

    if (selectedGenre.id && newSelection.code) {
      router.push(`/browse/${selectedGenre.id}/${newSelection.code}`)
    } else if (newSelection.code) {
      router.push(`/country/${newSelection.code}`)
    } else if (selectedGenre.id) {
      router.push(`/genre/${selectedGenre.id}`)
    } else {
      router.push("/")
    }
  }

  const popularGenres = genres.filter((genre) =>
    [28, 12, 16, 35, 80, 18, 14, 27, 9648, 10749, 878, 53, 10752, 37].includes(genre.id),
  )

  const popularCountries = countries.filter((country) =>
    ["US", "GB", "CA", "AU", "FR", "DE", "IT", "ES", "JP", "KR", "IN", "BR", "MX", "RU", "CN"].includes(
      country.iso_3166_1,
    ),
  )

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      {/* Genre Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => {
            setShowGenreDropdown(!showGenreDropdown)
            setShowCountryDropdown(false)
          }}
          className="glass-effect border-gray-600 hover:bg-gray-700 text-white w-full sm:min-w-32 justify-between text-sm btn-netflix focus-netflix"
        >
          <div className="flex items-center">
            <Film className="w-4 h-4 mr-2" />
            <span className="truncate">{selectedGenre.name}</span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
        </Button>

        {showGenreDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 glass-card border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="p-2">
              <button
                onClick={() => handleGenreSelect(null)}
                className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                  selectedGenre.id === null ? "netflix-gradient text-white" : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                All Genres
              </button>

              <div className="border-t border-gray-700 my-2" />

              <div className="space-y-1">
                <div className="px-3 py-1 text-xs text-gray-500 font-medium">Popular Genres</div>
                {popularGenres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                      selectedGenre.id === genre.id ? "netflix-gradient text-white" : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>

              {genres.length > popularGenres.length && (
                <>
                  <div className="border-t border-gray-700 my-2" />
                  <div className="space-y-1">
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium">All Genres</div>
                    {genres
                      .filter((g) => !popularGenres.find((pg) => pg.id === g.id))
                      .map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => handleGenreSelect(genre)}
                          className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                            selectedGenre.id === genre.id
                              ? "netflix-gradient text-white"
                              : "hover:bg-gray-800 text-gray-300"
                          }`}
                        >
                          {genre.name}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Country Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => {
            setShowCountryDropdown(!showCountryDropdown)
            setShowGenreDropdown(false)
          }}
          className="glass-effect border-gray-600 hover:bg-gray-700 text-white w-full sm:min-w-36 justify-between text-sm btn-netflix focus-netflix"
        >
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            <span className="truncate">{selectedCountry.name}</span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
        </Button>

        {showCountryDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 glass-card border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="p-2">
              <button
                onClick={() => handleCountrySelect(null)}
                className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                  selectedCountry.code === null ? "netflix-gradient text-white" : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                All Countries
              </button>

              <div className="border-t border-gray-700 my-2" />

              <div className="space-y-1">
                <div className="px-3 py-1 text-xs text-gray-500 font-medium">Popular Countries</div>
                {popularCountries.map((country) => (
                  <button
                    key={country.iso_3166_1}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                      selectedCountry.code === country.iso_3166_1
                        ? "netflix-gradient text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    {country.english_name}
                  </button>
                ))}
              </div>

              {countries.length > popularCountries.length && (
                <>
                  <div className="border-t border-gray-700 my-2" />
                  <div className="space-y-1">
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium">All Countries</div>
                    {countries
                      .filter((c) => !popularCountries.find((pc) => pc.iso_3166_1 === c.iso_3166_1))
                      .map((country) => (
                        <button
                          key={country.iso_3166_1}
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full text-left px-3 py-2 rounded transition-colors text-sm focus-netflix ${
                            selectedCountry.code === country.iso_3166_1
                              ? "netflix-gradient text-white"
                              : "hover:bg-gray-800 text-gray-300"
                          }`}
                        >
                          {country.english_name}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
