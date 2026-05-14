# Substack Integration for Framer

Two components for embedding Substack content natively in a Framer site, backed by a companion Cloudflare Worker proxy.

## Components

| Component | Description |
|-----------|-------------|
| [SubstackFeed](components/SubstackFeed.tsx) | Paginated post feed with list/grid/card layouts, tag filtering, and a Load More button |
| [SubstackItemCounter](components/SubstackItemCounter.tsx) | Total archive post count for headers/badges (e.g., `Newsletter [42]`) |

## Why a Proxy

Substacks archive endpoints dont include CORS headers, so a browser `fetch()` from a Framer site is blocked. A Cloudflare Worker fronts the archive API, adds CORS headers, caches responses, and exposes a minimal JSON schema with tags and sections.

The Worker source is not included in this package — see [docs/worker-setup.md](docs/worker-setup.md) for the endpoint contract (`/feed?limit=N&offset=N` and `/count`) and a reference implementation outline.

## Features

- **Archive API–backed** — no 20-post RSS ceiling; the Worker paginates the full archive
- **Tag filtering** — comma-separated tag slugs (`ai,strategy,aeo`) with OR matching
- **Load More pagination** — fetches next page client-side; optional
- **Responsive breakpoints** — cards layout on mobile regardless of desktop setting
- **Section filtering** — routes through RSS for section-scoped fetches
- **No brand-specific defaults** — both components use generic placeholder URLs; you supply your proxy URL via Framer property controls

## Quick Start

1. **Deploy a Worker proxy.** See [docs/worker-setup.md](docs/worker-setup.md).
2. **Add the components.** In Framer, create a new Code Component for each `.tsx` file in [components/](components/) and paste the contents.
3. **Configure.** In Framers properties panel, set the Proxy URL to your deployed Worker URL.

## Privacy

These components fetch directly from your own Cloudflare Worker. No third-party analytics. See [PRIVACY.md](PRIVACY.md).

## Documentation

- [Worker setup guide](docs/worker-setup.md) — endpoint contract, reference implementation
- [PRIVACY.md](PRIVACY.md) — what data flows where

## Related packages

If you're building a Substack-powered site:

- [**substack-aeo-proxy**](https://github.com/dgtldept/substack-aeo-proxy) — Free Vercel proxy that injects JSON-LD structured data into Substack pages so AI crawlers (ChatGPT, Claude, Perplexity, Gemini) can see your professional identity. Pairs naturally with the components in this package.
- [**linktree-replacement**](../linktree-replacement) — Privacy-first link-in-bio page; common companion to a Substack site
- [**fluid-typography**](../fluid-typography) — Drop-in fluid heading scale for editorial layouts

[See all packages →](../)

## License

MIT — see [LICENSE](LICENSE).

## About the author

By [Rebecca Rae Barton](https://rebeccaraebarton.com). I write [dgtl dept](https://dgtldept.substack.com) — essays at the intersection of marketing and engineering — and these components started as the embeds I needed for my own site.

**Follow:** [Substack](https://dgtldept.substack.com) · [LinkedIn](https://linkedin.com/in/rebeccaraebarton) · [X](https://x.com/rebeccarae) · [Live demos](https://rebeccaraebarton.com/work)

**Other open-source:** [claude-marketing](https://github.com/thatrebeccarae/claude-marketing) (56 Claude Code skills for marketing teams) · [framer-components](https://github.com/thatrebeccarae/framer-components) (this repo)
