export interface HistoryItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  overview?: string
  media_type: "movie" | "tv"
  vote_average: number
  release_date?: string
  first_air_date?: string
  season?: number
  episode?: number
  watchedAt: string
  progress?: number 
}

const HISTORY_KEY = "netflix-watch-history"
const MAX_HISTORY_ITEMS = 100

// Cookie helper functions
const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const nameEQ = name + "="
  const ca = document.cookie.split(";")

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const getWatchHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return []

  try {
    // Try to get from cookies first
    const cookieData = getCookie(HISTORY_KEY)
    if (cookieData) {
      return JSON.parse(decodeURIComponent(cookieData))
    }

    // Fallback to localStorage
    const items = localStorage.getItem(HISTORY_KEY)
    return items ? JSON.parse(items) : []
  } catch (error) {
    console.error("Error getting watch history:", error)
    return []
  }
}

export const addToHistory = (item: Omit<HistoryItem, "watchedAt">): void => {
  if (typeof window === "undefined") return

  try {
    const history = getWatchHistory()

    // Remove existing entry if it exists (same content, season, episode)
    const filteredHistory = history.filter(
      (h) =>
        !(
          h.id === item.id &&
          h.media_type === item.media_type &&
          h.season === item.season &&
          h.episode === item.episode
        ),
    )

    // Add new entry at the beginning
    const newItem: HistoryItem = {
      ...item,
      watchedAt: new Date().toISOString(),
    }

    filteredHistory.unshift(newItem)

    // Keep only the last 100 items
    const limitedHistory = filteredHistory.slice(0, MAX_HISTORY_ITEMS)

    // Save to both localStorage and cookies
    const historyString = JSON.stringify(limitedHistory)
    localStorage.setItem(HISTORY_KEY, historyString)
    setCookie(HISTORY_KEY, encodeURIComponent(historyString))

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("historyUpdated"))
  } catch (error) {
    console.error("Error adding to history:", error)
  }
}

export const removeFromHistory = (id: number, mediaType: "movie" | "tv", season?: number, episode?: number): void => {
  if (typeof window === "undefined") return

  try {
    const history = getWatchHistory()
    const filteredHistory = history.filter(
      (item) =>
        !(item.id === id && item.media_type === mediaType && item.season === season && item.episode === episode),
    )

    const historyString = JSON.stringify(filteredHistory)
    localStorage.setItem(HISTORY_KEY, historyString)
    setCookie(HISTORY_KEY, encodeURIComponent(historyString))

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("historyUpdated"))
  } catch (error) {
    console.error("Error removing from history:", error)
  }
}

export const clearAllHistory = (): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(HISTORY_KEY)
    setCookie(HISTORY_KEY, "", -1) // Delete cookie

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("historyUpdated"))
  } catch (error) {
    console.error("Error clearing history:", error)
  }
}

export const getHistoryCount = (): number => {
  return getWatchHistory().length
}
