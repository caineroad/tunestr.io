# tunestr.io

**Independent music + independent money.**

tunestr.io is a live music streaming platform built on [Nostr](https://nostr.org) and powered by Bitcoin's Lightning Network. Artists perform live, fans watch for free, and tips (called "zaps") go directly to the artist — instantly, globally, with zero platform fees.

## What is tunestr?

tunestr is a fork of [zap.stream](https://zap.stream) focused specifically on **independent musicians and venues**. It combines live streaming with the Value for Value model: content is free to consume, and fans give value back through Bitcoin micropayments.

- **Artists** earn bitcoin in real time while performing
- **Venues** can stream shows to a global audience with minimal setup
- **Fans** support artists directly — no middlemen, no subscriptions, no ads

## How it works

1. An artist goes live using OBS and their tunestr stream key
2. Fans watch the stream for free — no account required
3. Fans send bitcoin tips ("zaps") via the Lightning Network during the performance
4. Every sat goes directly to the artist's wallet — tunestr takes nothing

## Key features

- **Live streaming** via HLS and MoQ (Media over QUIC) for low-latency playback
- **Zaps** — instant Bitcoin Lightning payments directly to artists
- **NIP-05 identities** — artists get `yourname@tunestr.io` verified identities
- **Curated platform** — whitelisted artists and venues keep the focus on music
- **Nostr-native** — your identity, followers, and social graph belong to you
- **Chromecast support** — cast streams to your TV
- **Stream clips** — create shareable clips from live performances
- **Real-time dashboard** — streamers see zaps, viewers, and metrics live

## Tech stack

- **React 19** with TypeScript
- **React Router v7**
- **Vite 7** build system
- **Tailwind CSS 3** with custom purple/gold theme
- **@snort/system v2** for Nostr protocol
- **@snort/worker-relay** for local event caching
- **Biome** for linting
- **react-intl** for internationalization
- **media-chrome** for video player UI
- **lucide-react** for icons

## Building

```bash
yarn install
yarn build
```

## Development

```bash
yarn start
```

The dev server runs at `http://localhost:5173`.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SINGLE_PUBLISHER` | Comma-separated list of whitelisted npubs/pubkeys |
| `VITE_FEATURED_VIDEOS` | Comma-separated list of naddr identifiers for featured streams on the homepage |
| `VITE_NIP5_DOMAIN` | NIP-05 domain (defaults to `tunestr.io`) |

## Project structure

```
src/
  const.ts              # Constants, relays, whitelist, featured videos
  tunestr-const.ts      # Tunestr-specific constants (npub, ID)
  index.tsx             # App entry, router, Nostr system init
  pages/
    root.tsx            # Marketing homepage
    about.tsx           # Bitcoin/Nostr/V4V education page
    streams.tsx         # Music-filtered streams
    videos.tsx          # Whitelisted videos
    shorts.tsx          # Whitelisted shorts
    stream-page.tsx     # Individual stream view with chat
    dashboard/          # Streamer dashboard (stream key, metrics)
    layout/
      header.tsx        # Navigation header
      left-nav.tsx      # Sidebar navigation
      tunestr-footer.tsx # Site footer
  element/
    zap-strike.tsx      # Lightning bolt animation on successful zap
    video-grid-sorted.tsx # Stream/video grid with whitelist filtering
    send-zap.tsx        # Zap payment flow
    logo.tsx            # Tunestr SVG logo
    stream/             # Stream player, clips, notifications
    chat/               # Live chat components
  hooks/
    live-streams.ts     # Stream feed with whitelist filtering
    stream-provider.ts  # Streaming backend provider
  providers/
    zsz.ts              # zap.stream API provider
public/
  tunestr/              # Event photos for gallery
  .well-known/
    nostr.json          # NIP-05 identity mappings
```

## Upstream

tunestr.io is a fork of [zap.stream](https://github.com/v0l/zap.stream). The streaming backend is provided by zap.stream's infrastructure at `api-core.zap.stream`.

## Links

- **Website:** [tunestr.io](https://tunestr.io)
- **About:** [tunestr.io/about](https://tunestr.io/about)
- **Contact:** v4v@tunestr.io
- **Value for Value:** [value4value.info](https://value4value.info)
- **Zapping 101:** [soapbox.pub/blog/zapping-101](https://soapbox.pub/blog/zapping-101)
- **Nostr Protocol:** [nostr.org](https://nostr.org)

## License

MIT
