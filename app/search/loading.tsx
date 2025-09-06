import LoadingScreen from "@/components/loading-screen"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">NETFLIXCLONE</h1>
          <div className="w-64 h-10 bg-gray-800 animate-pulse rounded" />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-800 animate-pulse rounded w-64 mb-4" />
          <div className="h-4 bg-gray-800 animate-pulse rounded w-96" />
        </div>

        {/* Search Results Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full h-72 bg-gray-800 animate-pulse rounded" />
          ))}
        </div>

        {/* Loading Indicator */}
        <LoadingScreen />
      </main>
    </div>
  )
}
