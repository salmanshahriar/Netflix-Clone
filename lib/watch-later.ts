export interface WatchLaterItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  backdrop_path?: string
  overview?: string
  media_type: "movie" | "tv"
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
  adult?: boolean
  original_language?: string
  popularity?: number
  addedAt: string
}

const WATCH_LATER_KEY = "netflix-clone-watch-later"

const getLocalStorage = () => {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export const getWatchLaterItems = (): WatchLaterItem[] => {
  const storage = getLocalStorage()
  if (!storage) return []

  try {
    const data = storage.getItem(WATCH_LATER_KEY)
    if (!data) return []

    const items = JSON.parse(data)
    if (!Array.isArray(items)) return []

    // Validate and clean data
    return items.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        (item.media_type === "movie" || item.media_type === "tv") &&
        item.addedAt,
    )
  } catch (error) {
    console.error("Error parsing watch later data:", error)
    // Clear corrupted data
    storage.removeItem(WATCH_LATER_KEY)
    return []
  }
}

export const addToWatchLater = (itemData: any): boolean => {
  const storage = getLocalStorage()
  if (!storage || !itemData) return false

  try {
    const items = getWatchLaterItems()

    // Check if already exists
    const exists = items.some((item) => item.id === itemData.id && item.media_type === itemData.media_type)

    if (exists) {
      console.log("Item already in watch later")
      return false
    }

    // Create new item with all available data
    const newItem: WatchLaterItem = {
      id: itemData.id,
      title: itemData.title || undefined,
      name: itemData.name || undefined,
      poster_path: itemData.poster_path || undefined,
      backdrop_path: itemData.backdrop_path || undefined,
      overview: itemData.overview || undefined,
      media_type: itemData.media_type,
      vote_average: itemData.vote_average || 0,
      release_date: itemData.release_date || undefined,
      first_air_date: itemData.first_air_date || undefined,
      genre_ids: itemData.genre_ids || undefined,
      adult: itemData.adult || false,
      original_language: itemData.original_language || undefined,
      popularity: itemData.popularity || undefined,
      addedAt: new Date().toISOString(),
    }

    // Add to beginning of array
    items.unshift(newItem)

    // Save to localStorage
    storage.setItem(WATCH_LATER_KEY, JSON.stringify(items))

    // Dispatch event for UI updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("watchLaterUpdated", {
          detail: { action: "add", item: newItem },
        }),
      )
    }

    console.log("Added to watch later:", newItem)
    return true
  } catch (error) {
    console.error("Error adding to watch later:", error)
    return false
  }
}

export const removeFromWatchLater = (id: number, mediaType: "movie" | "tv"): boolean => {
  const storage = getLocalStorage()
  if (!storage) return false

  try {
    const items = getWatchLaterItems()
    const filteredItems = items.filter((item) => !(item.id === id && item.media_type === mediaType))

    if (filteredItems.length === items.length) {
      console.log("Item not found in watch later")
      return false
    }

    storage.setItem(WATCH_LATER_KEY, JSON.stringify(filteredItems))

    // Dispatch event for UI updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("watchLaterUpdated", {
          detail: { action: "remove", id, mediaType },
        }),
      )
    }

    console.log("Removed from watch later:", { id, mediaType })
    return true
  } catch (error) {
    console.error("Error removing from watch later:", error)
    return false
  }
}

export const isInWatchLater = (id: number, mediaType: "movie" | "tv"): boolean => {
  try {
    const items = getWatchLaterItems()
    return items.some((item) => item.id === id && item.media_type === mediaType)
  } catch {
    return false
  }
}

export const getWatchLaterCount = (): number => {
  try {
    return getWatchLaterItems().length
  } catch {
    return 0
  }
}

export const clearWatchLater = (): boolean => {
  const storage = getLocalStorage()
  if (!storage) return false

  try {
    storage.removeItem(WATCH_LATER_KEY)

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("watchLaterUpdated", {
          detail: { action: "clear" },
        }),
      )
    }

    return true
  } catch (error) {
    console.error("Error clearing watch later:", error)
    return false
  }
}
