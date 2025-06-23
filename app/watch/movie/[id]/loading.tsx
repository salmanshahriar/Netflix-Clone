import { Loader2, Play } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"

export default function WatchMovieLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LoadingScreen />

      {/* Video Player Skeleton */}
      <div className="w-full">
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <div
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            className="bg-gray-900 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Play className="w-16 h-16 text-red-600" />
                <Loader2 className="w-8 h-8 text-red-600 animate-spin absolute -top-2 -right-2" />
              </div>
              <p className="text-gray-400">Loading video player...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="w-64 h-96 bg-gray-800 animate-pulse rounded-lg" />
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="h-12 bg-gray-800 animate-pulse rounded w-3/4" />
              <div className="flex gap-4">
                <div className="h-6 bg-gray-800 animate-pulse rounded w-20" />
                <div className="h-6 bg-gray-800 animate-pulse rounded w-16" />
                <div className="h-6 bg-gray-800 animate-pulse rounded w-24" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-800 animate-pulse rounded-full w-20" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-800 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-800 animate-pulse rounded w-5/6" />
              <div className="h-4 bg-gray-800 animate-pulse rounded w-4/6" />
            </div>

            <div className="h-12 bg-gray-800 animate-pulse rounded w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
