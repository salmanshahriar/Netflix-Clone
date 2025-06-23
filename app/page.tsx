import { Suspense } from "react"
import Navbar from "@/components/navbar/navbar"
import Hero from "@/components/ui/hero"
import MovieSection from "@/components/sections/movie-section"
import TVSection from "@/components/sections/tv-section"
import MixedContentSection from "@/components/sections/mixed-content-section"
import LoadingScreen from "@/components/ui/loading-screen"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-16 lg:pt-18">
        <Suspense fallback={<LoadingScreen message="Loading featured content..." />}>
          <Hero />
        </Suspense>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-12 space-y-16">
        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <MixedContentSection title="Trending Now" endpoint="trending/all/day" />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <TVSection title="Popular TV Shows" endpoint="tv/popular" />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <MovieSection
            title="Hollywood Blockbusters"
            endpoint="discover/movie?with_origin_country=US&sort_by=popularity.desc"
          />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <MovieSection
            title="Bollywood Cinema"
            endpoint="discover/movie?with_origin_country=IN&sort_by=popularity.desc"
          />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <MovieSection title="Top Rated Movies" endpoint="movie/top_rated" />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse rounded-xl" />}>
          <MovieSection title="Action & Adventure" endpoint="discover/movie?with_genres=28" />
        </Suspense>
      </main>
    </div>
  )
}
