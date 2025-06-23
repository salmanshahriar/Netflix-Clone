"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

interface TrailerSectionProps {
  videos: Video[]
}

export default function TrailerSection({ videos }: TrailerSectionProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const trailer = videos.find((video) => video.type === "Trailer" && video.site === "YouTube")

  if (!trailer) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Trailer</h3>

      {!showTrailer ? (
        <div className="relative">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
              alt="Trailer thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button
                size="lg"
                onClick={() => setShowTrailer(true)}
                className="bg-red-600 hover:bg-red-700 rounded-full w-16 h-16"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={trailer.name}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTrailer(false)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
