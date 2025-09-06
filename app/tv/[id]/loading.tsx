import LoadingScreen from "@/components/loading-screen"

export default function TVLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="text-2xl font-bold text-red-600">NETFLIXCLONE</div>
        </div>
      </nav>

      <div className="relative">
        {/* Hero Section Skeleton */}
        <div className="h-[60vh] bg-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative -mt-32 z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-64 h-96 bg-gray-800 animate-pulse rounded-lg" />
              </div>

              {/* Content Skeleton */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-400 rounded" />
                    <div className="h-6 bg-gray-800 animate-pulse rounded w-24" />
                  </div>
                  <div className="h-12 bg-gray-800 animate-pulse rounded w-3/4" />
                  <div className="flex gap-4">
                    <div className="h-6 bg-gray-800 animate-pulse rounded w-20" />
                    <div className="h-6 bg-gray-800 animate-pulse rounded w-32" />
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

                <div className="flex gap-4">
                  <div className="h-12 bg-gray-800 animate-pulse rounded w-32" />
                  <div className="h-12 bg-gray-800 animate-pulse rounded w-40" />
                </div>

                {/* Episodes Section Skeleton */}
                <div className="space-y-4 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-800 animate-pulse rounded w-32" />
                    <div className="flex gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-8 bg-gray-800 animate-pulse rounded w-16" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-32 h-20 bg-gray-700 animate-pulse rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-gray-700 animate-pulse rounded w-1/2" />
                          <div className="h-3 bg-gray-700 animate-pulse rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            <LoadingScreen title="NETFLIX" subtitle="Loading TV show details..." />
          </div>
        </div>
      </div>
    </div>
  )
}
