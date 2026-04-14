<div align="center">

# Framer Components

**Open-source code components and packages for Framer — built for designers who ship.**

[![Framer](https://img.shields.io/badge/Framer-Components-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com)
[![Website](https://img.shields.io/badge/rebeccaraebarton.com-1C1C1C?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rebeccaraebarton.com)
[![GitHub stars](https://img.shields.io/github/stars/thatrebeccarae/framer-components?style=for-the-badge&logo=github&color=181717)](https://github.com/thatrebeccarae/framer-components/stargazers)
[![License](https://img.shields.io/badge/License-MIT-0A66C2?style=for-the-badge)](LICENSE)

<br>

```bash
git clone https://github.com/thatrebeccarae/framer-components.git
```

<br>

[Why I Built This](#why-i-built-this) · [Who This Is For](#who-this-is-for) · [Getting Started](#getting-started) · [Packages](#packages) · [LinkTree Replacement](#linktree-replacement) · [Eye Tracker](#eye-tracker) · [Substack Integration](#substack-integration) · [Contributing](#contributing) · [License](#license)

</div>

---

## Why I Built This

Framer is incredible for shipping fast, but the code component ecosystem is still young. I kept building the same patterns across client projects — link-in-bio pages, interactive flourishes, analytics integrations — and decided to open-source the ones worth sharing.

These components are designed for non-technical Framer users. Each one comes with wizard-style documentation so you can drop it into your project without touching code. If you *do* want to customize, everything is a single `.tsx` file with clean props and no external dependencies.

The goal is simple: give Framer builders production-ready components that respect user privacy by default and just work.

## Who This Is For

- **Framer designers** who want production-ready code components without writing TypeScript from scratch
- **Freelancers and agencies** who rebuild the same link-in-bio pages across client projects
- **Non-technical site owners** who need drop-in components with wizard-style setup docs
- **Privacy-conscious builders** who want analytics-optional components that don't phone home by default

## Getting Started

Each package has its own installation instructions. Generally:

1. Navigate to the package folder
2. Copy the `.tsx` file from `components/` or `src/`
3. Paste into a new Code Component in your Framer project

<details>
<summary><strong>Detailed setup notes</strong></summary>

- Each component is a single `.tsx` file — no build step, no dependencies
- Framer's Code Component editor accepts the file contents directly
- Theme and configuration options are exposed as Framer property controls
- See each package's README for component-specific props and customization

</details>

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [LinkTree Replacement](./linktree-replacement) | Complete link-in-bio page with wizard docs, themes, and optional analytics | Ready |
| [Eye Tracker](./eye-tracker) | Animated eyes that follow cursor with blinking and easter eggs | Ready |
| [Substack Integration](#substack-integration) | Paginated Substack feed + post counter, backed by a Cloudflare Worker proxy | Ready |

## LinkTree Replacement

A privacy-first LinkTree alternative built entirely in Framer.

**Features:**

- **5 code components** — LinksHeader, SocialIconLinks, LinkCard, LinksContainer, EyeTracker
- **6 pre-built themes** — Minimal, gradient, playful, and professional options
- **12 wizard docs** — Step-by-step guides for non-technical users
- **GA4/GTM integration** — With Framer SPA-specific workarounds
- **100% private** — No tracking unless you explicitly add analytics

[Get Started →](./linktree-replacement)

## Eye Tracker

Animated eyes that follow your cursor around the page — with blinking and hidden easter eggs.

**Features:**

- Smooth cursor-tracking animation
- Natural blinking behavior
- Easter egg interactions
- Lightweight, single-file component

[Get Started →](./eye-tracker)

## Substack Integration

Two components for embedding your Substack archive natively in Framer, backed by a companion Cloudflare Worker proxy.

**Components:**

- **`SubstackFeed.tsx`** — paginated post feed with list/grid/card layouts, tag filtering, and a Load More button. Fetches the Substack archive API via your proxy.
- **`SubstackItemCounter.tsx`** — displays your total archive post count (e.g., for a "Newsletter [42]" header badge). Uses a dedicated `/count` endpoint on the proxy with a 1-hour edge cache.

**Why a proxy:** Substack's archive endpoints don't include CORS headers, so browser `fetch()` from a Framer site is blocked. A Cloudflare Worker fronts the archive API, adds CORS headers, caches responses, and exposes a minimal JSON schema with tags and sections. The Worker source is not included in this repo — see the component files for the expected endpoint shape (`/feed?limit=N&offset=N` and `/count`).

**Features:**

- **Archive API–backed** — no 20-post RSS ceiling; the Worker paginates through your full archive
- **Tag filtering** — comma-separated tag slugs (e.g., `ai,strategy,aeo`) with OR matching
- **Load More pagination** — fetches next page client-side; optional
- **Responsive breakpoints** — cards layout on mobile regardless of desktop setting
- **Section filtering** — routes through RSS for section-scoped fetches (sections are a distinct Substack primitive from tags)
- **No brand-specific defaults** — both components use generic placeholder URLs; you supply your proxy URL via Framer property controls

[Get SubstackFeed →](./SubstackFeed.tsx) · [Get SubstackItemCounter →](./SubstackItemCounter.tsx)

## Contributing

Pull requests welcome. If you build something useful on top of these components, I'd love to see it.

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by [Rebecca Rae Barton](https://rebeccaraebarton.com)**

[Live demos](https://rebeccaraebarton.com/work) · [GitHub](https://github.com/thatrebeccarae/framer-components)

</div>
