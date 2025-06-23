import Link from "next/link"

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

interface CastSectionProps {
  cast: CastMember[]
}

export default function CastSection({ cast }: CastSectionProps) {
  const mainCast = cast.slice(0, 10) // Show top 10 cast members

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Cast</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {mainCast.map((actor) => (
          <Link key={actor.id} href={`/person/${actor.id}`}>
            <div className="flex-shrink-0 w-32 text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="relative overflow-hidden rounded-lg mb-2">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/placeholder.svg?height=185&width=185"
                  }
                  alt={actor.name}
                  className="w-32 h-32 object-cover"
                />
              </div>
              <h4 className="font-semibold text-sm line-clamp-2 mb-1">{actor.name}</h4>
              <p className="text-xs text-gray-400 line-clamp-2">{actor.character}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
