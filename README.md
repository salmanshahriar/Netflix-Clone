# Netflix Clone 🎬

Live Demo: [https://your-netflix.vercel.app/](https://your-netflix.vercel.app//)

A modern Netflix clone built with **Next.js**, **TypeScript**, and **ShadCN**. This project showcases a fully responsive movie/TV streaming frontend using free public video embed sources.

---

## 🔧 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.dev/)
- **Styling**: Tailwind CSS

---

## 🎥 Video Playback

This app streams content using free public sources. As a result, video playback might display ads or experience reliability issues.

### ⚠️ Disclaimer

> This project uses free third-party embeds purely for demo purposes. I do not host or control any of the content shown.

---

## 🧩 Movie/Shows Video Sources

The following sources are used to fetch movie/TV embeds:

```ts
export const availableSources: VideoSource[] = [
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
    id: "multiembed",
    name: "MultiEmbed",
    isFrench: false,
    urls: {
      movie: "https://multiembed.mov/?video_id={id}&tmdb=1",
      tv: "https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}",
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
]
