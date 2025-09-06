"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { availableSources, getVideoUrl } from "@/lib/available-sources"
import { ChevronDown, Globe, Play, RotateCcw, AlertCircle } from "lucide-react"
import WatchLaterButton from "@/components/ui/watch-later-button"

interface VideoPlayerWithSourcesProps {
  movieId?: number
  tvId?: number
  season?: number
  episode?: number
  title: string
  overview?: string
  poster_path?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export default function VideoPlayerWithSources({
  movieId,
  tvId,
  season,
  episode,
  title,
  overview,
  poster_path,
  vote_average,
  release_date,
  first_air_date,
}: VideoPlayerWithSourcesProps) {
  const [activeSource, setActiveSource] = useState(availableSources[0].id)
  const [showAllSources, setShowAllSources] = useState(true)
  const [showFrenchSources, setShowFrenchSources] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  const englishSources = availableSources.filter((source) => !source.isFrench)
  const frenchSources = availableSources.filter((source) => source.isFrench)

  const getVideoUrlForSource = (sourceId: string) => {
    const id = movieId || tvId
    if (!id) return ""

    const type = movieId ? "movie" : "tv"
    return getVideoUrl(sourceId, type, id, season, episode)
  }

  const currentUrl = getVideoUrlForSource(activeSource)
  const currentSourceName = availableSources.find((s) => s.id === activeSource)?.name || "Unknown"

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setErrorMessage("")
    setIframeKey((prev) => prev + 1)

    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setHasError(true)
        setErrorMessage("Source took too long to load")
      }
    }, 15000) // 15 seconds timeout

    return () => clearTimeout(timeout)
  }, [activeSource])

  const handleSourceChange = (sourceId: string) => {
    setActiveSource(sourceId)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setErrorMessage("")
    setIframeKey((prev) => prev + 1)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
    setErrorMessage("")
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    setErrorMessage("Failed to load this source")
  }

  const watchLaterItem = {
    id: movieId || tvId || 0,
    media_type: (movieId ? "movie" : "tv") as "movie" | "tv",
    title: movieId ? title : undefined,
    name: tvId ? title : undefined,
    overview: overview || "",
    poster_path: poster_path || undefined,
    vote_average: vote_average || 0,
    release_date: release_date || undefined,
    first_air_date: first_air_date || undefined,
  }

  if (!currentUrl) {
    return (
      <div className="w-full">
        <div className="mx-4 mb-4">
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <p className="text-gray-400">Unable to generate video URL</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Video Player */}
      <div className="mx-4 mb-6">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white text-lg font-medium">Loading {currentSourceName}...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait while we load the video</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {/* {hasError  && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
              <div className="text-center max-w-md px-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Video Failed to Load</h3>
                <p className="text-gray-400 mb-2">{errorMessage || "This source is currently unavailable"}</p>
                <p className="text-sm text-gray-500 mb-6">Try reload again or switching to a different source below</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reload Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSourceChange(availableSources[1]?.id || availableSources[0].id)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Next Source
                  </Button>
                </div>
              </div>
            </div>
          )} */}

          {/* Video Iframe */}
          <iframe
            key={iframeKey}
            src={currentUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title={title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          />
        </div>

        {/* Watch Later Button */}
        <div className="mt-4 flex justify-center">
          <WatchLaterButton item={watchLaterItem} variant="outline" size="default" showText={true} />
        </div>
      </div>

      {/* Source Selection */}
      <div className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">Video Sources</h3>
                <span className="text-sm text-white bg-red-600 px-3 py-1 rounded-full">{currentSourceName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFrenchSources(!showFrenchSources)}
                  className={`text-sm ${showFrenchSources ? "text-blue-400 bg-blue-400/10" : "text-gray-400"}`}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  French Sources
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllSources(!showAllSources)}
                  className="text-sm text-gray-400"
                >
                  {showAllSources ? "Hide Sources" : "Show All Sources"}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAllSources ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>

            {/* All English Sources */}
            {showAllSources && (
              <div>
                <div className="text-sm text-gray-400 mb-3 font-medium">🌐 All Available Sources</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {englishSources.map((source) => (
                    <Button
                      key={source.id}
                      size="sm"
                      variant={activeSource === source.id ? "default" : "outline"}
                      onClick={() => handleSourceChange(source.id)}
                      className={`text-sm transition-all ${
                        activeSource === source.id
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg border-red-600"
                          : "bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                      }`}
                    >
                      {source.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* French Sources */}
            {/* {showFrenchSources && frenchSources.length > 0 && (
              <div>
                <div className="text-sm text-gray-400 mb-3 font-medium">🇫🇷 French Sources</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {frenchSources.map((source) => (
                    <Button
                      key={source.id}
                      size="sm"
                      variant={activeSource === source.id ? "default" : "outline"}
                      onClick={() => handleSourceChange(source.id)}
                      className={`text-sm transition-all ${
                        activeSource === source.id
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg border-red-600"
                          : "bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                      }`}
                    >
                      {source.name}
                    </Button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Status and Tips */}
            {/* <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {hasError ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : isLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5"></div>
                  ) : (
                    <Play className="w-5 h-5 text-green-500 mt-0.5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Status:</strong>{" "}
                    {hasError ? "Source failed to load" : isLoading ? "Loading video..." : "Video ready"}
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• If a source doesn't work, try switching to another one</p>
                    <p>• Some sources may take longer to load than others</p>
                    <p>• French sources are available for French content</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
