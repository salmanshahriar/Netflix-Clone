const API_KEY = "a574586511a34a4cf5e5bafd25c42a9c"
const BASE_URL = "https://api.themoviedb.org/3"

export async function getMovies(endpoint: string, page = 1) {
  const url = `${BASE_URL}/${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&page=${page}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movies")
  }

  return response.json()
}

export async function searchMovies(query: string, page = 1) {
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to search content")
  }

  return response.json()
}

export async function getMovieDetails(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movie details")
  }

  return response.json()
}

export async function getMovieVideos(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movie videos")
  }

  return response.json()
}

export async function searchMulti(query: string, page = 1) {
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to search content")
  }

  return response.json()
}

export async function getTVShowDetails(tvId: number) {
  const url = `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch TV show details")
  }

  return response.json()
}

export async function getTVShowVideos(tvId: number) {
  const url = `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch TV show videos")
  }

  return response.json()
}

export async function getMovieCredits(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movie credits")
  }

  return response.json()
}

export async function getSimilarMovies(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch similar movies")
  }

  return response.json()
}

export async function getTVShows(endpoint: string, page = 1) {
  const url = `${BASE_URL}/${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&page=${page}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch TV shows")
  }

  return response.json()
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number) {
  const url = `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch TV season details")
  }

  return response.json()
}

export async function getPersonDetails(personId: number) {
  const url = `${BASE_URL}/person/${personId}?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch person details")
  }

  return response.json()
}

export async function getPersonMovieCredits(personId: number) {
  const url = `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch person movie credits")
  }

  return response.json()
}

export async function getPersonTVCredits(personId: number) {
  const url = `${BASE_URL}/person/${personId}/tv_credits?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch person TV credits")
  }

  return response.json()
}

export async function getPersonCombinedCredits(personId: number) {
  const url = `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch person combined credits")
  }

  return response.json()
}

export async function getGenres() {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  })

  if (!response.ok) {
    throw new Error("Failed to fetch genres")
  }

  return response.json()
}

export async function getCountries() {
  const url = `${BASE_URL}/configuration/countries?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  })

  if (!response.ok) {
    throw new Error("Failed to fetch countries")
  }

  return response.json()
}

export async function getFilteredMovies(genreId: number | null, countryCode: string | null, page = 1) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`

  if (genreId) {
    url += `&with_genres=${genreId}`
  }

  if (countryCode) {
    url += `&with_origin_country=${countryCode}`
  }

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch filtered movies")
  }

  return response.json()
}

export async function getMovieExternalIds(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}/external_ids?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movie external IDs")
  }

  return response.json()
}

export async function getTVShowExternalIds(tvId: number) {
  const url = `${BASE_URL}/tv/${tvId}/external_ids?api_key=${API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error("Failed to fetch TV show external IDs")
  }

  return response.json()
}
