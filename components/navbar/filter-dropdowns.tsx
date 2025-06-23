"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
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

export default function FilterDropdowns() {
  const router = useRouter()
  const [genres, setGenres] = useState<Genre[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedGenre, setSelectedGenre] = useState<{ id: number | null; name: string }>({
    id: null,
    name: "Genre",
  })
  const [selectedCountry, setSelectedCountry] = useState<{ code: string | null; name: string }>({
    code: null,
    name: "Country",
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
    const newSelection = genre ? { id: genre.id, name: genre.name } : { id: null, name: "Genre" }
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
      : { code: null, name: "Country" }
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
    [28, 12, 16, 35, 80, 18, 14, 27, 9648, 10749, 878, 53].includes(genre.id),
  )

  const popularCountries = countries.filter((country) =>
    ["US", "GB", "CA", "AU", "FR", "DE", "IT", "ES", "JP", "KR", "IN", "BR"].includes(country.iso_3166_1),
  )

  const DropdownButton = ({
    label,
    isOpen,
    onClick,
  }: {
    label: string
    isOpen: boolean
    onClick: () => void
  }) => (
    <Button
      variant="outline"
      onClick={onClick}
      className={`bg-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/60 text-white rounded-full px-4 py-2 transition-all duration-200 ${
        isOpen ? "bg-gray-800/80 border-gray-600" : ""
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </Button>
  )

  const DropdownContent = ({
    items,
    onSelect,
    selectedId,
  }: {
    items: any[]
    onSelect: (item: any) => void
    selectedId: any
  }) => (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
      <div className="p-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-xl transition-colors text-sm ${
            selectedId === null ? "bg-red-600 text-white" : "hover:bg-gray-800/50 text-gray-300"
          }`}
        >
          All
        </button>
        <div className="border-t border-gray-700/50 my-2" />
        {items.map((item) => (
          <button
            key={item.id || item.iso_3166_1}
            onClick={() => onSelect(item)}
            className={`w-full text-left px-3 py-2 rounded-xl transition-colors text-sm ${
              selectedId === (item.id || item.iso_3166_1)
                ? "bg-red-600 text-white"
                : "hover:bg-gray-800/50 text-gray-300"
            }`}
          >
            {item.name || item.english_name}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Genre Dropdown */}
      <div className="relative">
        <DropdownButton
          label={selectedGenre.name}
          isOpen={showGenreDropdown}
          onClick={() => {
            setShowGenreDropdown(!showGenreDropdown)
            setShowCountryDropdown(false)
          }}
        />

        {showGenreDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 z-50">
            <DropdownContent items={popularGenres} onSelect={handleGenreSelect} selectedId={selectedGenre.id} />
          </div>
        )}
      </div>

      {/* Country Dropdown */}
      <div className="relative">
        <DropdownButton
          label={selectedCountry.name}
          isOpen={showCountryDropdown}
          onClick={() => {
            setShowCountryDropdown(!showCountryDropdown)
            setShowGenreDropdown(false)
          }}
        />

        {showCountryDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 z-50">
            <DropdownContent
              items={popularCountries}
              onSelect={handleCountrySelect}
              selectedId={selectedCountry.code}
            />
          </div>
        )}
      </div>
    </div>
  )
}
