export interface VideoSource {
  id: string
  name: string
  isFrench: boolean
  urls: {
    movie: string
    tv: string
  }
}

export const availableSources: VideoSource[] = [


  {
    id: "2embed",
    name: "2Embed",
    isFrench: false,
    urls: {
      movie: "https://www.2embed.cc/embed/{id}",
      tv: "https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}",
    },
  },
     {
    id: "autoembed",
    name: "AutoEmbed",
    isFrench: false,
    urls: {
      movie: "https://player.autoembed.cc/embed/movie/{id}",
      tv: "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}",
    },
  },
   {
    id: "smashystream",
    name: "SmashyStream",
    isFrench: false,
    urls: {
      movie: "https://embed.smashystream.com/playere.php?tmdb={id}",
      tv: "https://embed.smashystream.com/playere.php?tmdb={id}&season={season}&episode={episode}",
    },
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    isFrench: false,
    urls: {
      movie: "https://multiembed.mov/?video_id={id}&tmdb=1",
      tv: "https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}",
    },
  },
    {
    id: "videasy",
    name: "VidEasy",
    isFrench: false,
    urls: {
      movie: "https://player.videasy.net/movie/{id}",
      tv: "https://player.videasy.net/tv/{id}/{season}/{episode}",
    },
  },
   {
    id: "primewire",
    name: "PrimeWire",
    isFrench: false,
    urls: {
      movie: "https://www.primewire.tf/embed/movie?tmdb={id}",
      tv: "https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}",
    },
  },
]

export const getVideoUrl = (
  sourceId: string,
  type: "movie" | "tv",
  id: number,
  season?: number,
  episode?: number,
): string => {
  const source = availableSources.find((s) => s.id === sourceId)
  if (!source) return ""

  const template = source.urls[type]
  let url = template.replace("{id}", id.toString())

  if (type === "tv" && season !== undefined && episode !== undefined) {
    url = url.replace("{season}", season.toString())
    url = url.replace("{episode}", episode.toString())
  }

  return url
}

export const getDefaultSource = (): VideoSource => {
  return availableSources[0] // VidSrc.to as default (most reliable)
}

export const getPopularSources = (): VideoSource[] => {
  return availableSources.filter((source) =>
    ["vidsrcto", "vidsrccc", "multiembed", "embedsu", "videasy"].includes(source.id),
  )
}
