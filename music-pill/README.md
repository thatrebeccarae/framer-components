# Music Pill — Now Playing for Framer

Live Now-Playing music card. Renders an on-brand header (animated indicator + label) above Spotifys official embed iframe. Fetches the current track from a Cloudflare Worker proxy you deploy against your own Spotify developer credentials.

## Components

| Component | Description |
|-----------|-------------|
| [MusicPill_NowPlaying](components/MusicPill_NowPlaying.tsx) | Slim header + Spotify embed, polls a Worker for live track data |

## Features

- **Live polling** — fetches current track every N seconds (configurable)
- **Two indicator styles** — pulsing dot (CSS ripple) or decorative equalizer bars
- **Idle fallback** — show a fallback track when nothing is playing
- **Light/dark Spotify embed** — matches your site theme
- **Compact or standard embed size** — Spotifys two iframe variants
- **No sound reactivity** — the equalizer is a visual suggestion; the iframe is sandboxed and audio data isnt accessible
- **Canvas-safe** — renders a placeholder block in the Framer editor so the card is visible while designing

## Quick Start

1. **Deploy a Spotify proxy Worker.** See [docs/spotify-proxy-setup.md](docs/spotify-proxy-setup.md).
2. **Add the component.** In Framer, create a new Code Component and paste the contents of [components/MusicPill_NowPlaying.tsx](components/MusicPill_NowPlaying.tsx).
3. **Configure.** Set the `Worker URL` property control to your deployed Worker URL.

## Privacy

Polling happens client-side against **your own** Cloudflare Worker. No third-party tracking. See [PRIVACY.md](PRIVACY.md).

## Documentation

- [Spotify proxy setup](docs/spotify-proxy-setup.md) — Worker contract, OAuth setup, deployment
- [PRIVACY.md](PRIVACY.md) — what data flows where

## License

MIT — see [LICENSE](LICENSE).

## Author

[Rebecca Rae Barton](https://rebeccaraebarton.com) · [framer-components](https://github.com/thatrebeccarae/framer-components)
