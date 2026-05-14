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

## Related packages

- [**linktree-replacement**](../linktree-replacement) — Privacy-first link-in-bio page; the Music Pill drops in naturally as a "what I'm listening to" block
- [**substack-integration**](../substack-integration) — Substack feed + post counter, also Worker-backed
- [**eye-tracker**](../eye-tracker) — Animated cursor-following eyes for personality

[See all packages →](../)

## License

MIT — see [LICENSE](LICENSE).

## About the author

By [Rebecca Rae Barton](https://rebeccaraebarton.com). I run a marketing-and-engineering practice; this component started as the "now playing" widget on my own site.

**Follow:** [Substack](https://dgtldept.substack.com) · [LinkedIn](https://linkedin.com/in/rebeccaraebarton) · [X](https://x.com/rebeccarae) · [Live demos](https://rebeccaraebarton.com/work)

**Other open-source:** [claude-marketing](https://github.com/thatrebeccarae/claude-marketing) (56 Claude Code skills for marketing teams) · [substack-aeo-proxy](https://github.com/dgtldept/substack-aeo-proxy) (free Vercel proxy for Substack AEO) · [framer-components](https://github.com/thatrebeccarae/framer-components) (this repo)
