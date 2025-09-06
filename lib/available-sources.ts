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
    id: "autoembed",
    name: "AutoEmbed",
    isFrench: false,
    urls: {
      movie: "https://player.autoembed.cc/embed/movie/{id}",
      tv: "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}",
    },
  },
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
    id: "pstream",
    name: "P-Stream",
    isFrench: false,
    urls: {
      movie: "https://iframe.pstream.org/embed/tmdb-movie-{id}",
      tv: "https://iframe.pstream.org/embed/tmdb-tv-{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrccc",
    name: "VidSrc.cc",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.cc/v2/embed/movie/{id}",
      tv: "https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "embedsu",
    name: "Embed.su",
    isFrench: false,
    urls: {
      movie: "https://embed.su/embed/movie/{id}",
      tv: "https://embed.su/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcto",
    name: "VidSrc.to",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.to/embed/movie/{id}",
      tv: "https://vidsrc.to/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcrip",
    name: "VidSrc.rip",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.rip/embed/movie/{id}",
      tv: "https://vidsrc.rip/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcsu",
    name: "VidSrc.su",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.su/embed/movie/{id}",
      tv: "https://vidsrc.su/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcvip",
    name: "VidSrc.vip",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.vip/embed/movie/{id}",
      tv: "https://vidsrc.vip/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "frembed",
    name: "Frembed",
    isFrench: true,
    urls: {
      movie: "https://frembed.cc/api/film.php?id={id}",
      tv: "https://frembed.cc/api/serie.php?id={id}&sa={season}&epi={episode}",
    },
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    isFrench: false,
    urls: {
      movie: "https://moviesapi.club/movie/{id}",
      tv: "https://moviesapi.club/tv/{id}-{season}-{episode}",
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
    {
    id: "videasy",
    name: "VidEasy",
    isFrench: false,
    urls: {
      movie: "https://player.videasy.net/movie/{id}",
      tv: "https://player.videasy.net/tv/{id}/{season}/{episode}",
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
