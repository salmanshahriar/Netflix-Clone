import { Loader2, Play } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"

export default function WatchTVLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-800 animate-pulse rounded" />
          <div className="h-6 bg-gray-800 animate-pulse rounded w-80" />
        </div>
      </nav>

      {/* Video Player Skeleton */}
      <div className="w-full">
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <div
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            className="bg-gray-900 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Play className="w-16 h-16 text-blue-400" />
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin absolute -top-2 -right-2" />
              </div>
              <p className="text-gray-400">Loading episode...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Navigation Skeleton */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-10 bg-gray-800 animate-pulse rounded w-32" />
          <div className="h-10 bg-gray-800 animate-pulse rounded w-32" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-72 bg-gray-800 animate-pulse rounded-lg" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-800 animate-pulse rounded w-3/4" />
                  <div className="h-6 bg-gray-800 animate-pulse rounded w-5/6" />
                </div>

                <div className="flex gap-4">
                  <div className="h-6 bg-gray-800 animate-pulse rounded w-20" />
                  <div className="h-6 bg-gray-800 animate-pulse rounded w-24" />
                  <div className="h-6 bg-gray-800 animate-pulse rounded w-16" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 animate-pulse rounded w-full" />
                  <div className="h-4 bg-gray-800 animate-pulse rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>

          {/* Episode List Skeleton */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-800 animate-pulse rounded w-32" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-800 animate-pulse rounded w-12" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-24 h-16 bg-gray-700 animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-700 animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <LoadingScreen />
      </div>
    </div>
  )
}
