<div align="center">

# Framer Components

**Open-source code components and packages for Framer — built for designers who ship.**

[![GitHub stars](https://img.shields.io/github/stars/thatrebeccarae/framer-components?style=for-the-badge&logo=github&color=181717)](https://github.com/thatrebeccarae/framer-components/stargazers)
[![License](https://img.shields.io/badge/License-MIT-0A66C2?style=for-the-badge)](LICENSE)
[![Framer](https://img.shields.io/badge/Framer-Components-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com)
[![Website](https://img.shields.io/badge/rebeccaraebarton.com-1C1C1C?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rebeccaraebarton.com)

[Packages](#packages) · [LinkTree Replacement](#linktree-replacement) · [Eye Tracker](#eye-tracker) · [Installation](#installation) · [License](#license)

</div>

---

## Why I Built This

Framer is incredible for shipping fast, but the code component ecosystem is still young. I kept building the same patterns across client projects — link-in-bio pages, interactive flourishes, analytics integrations — and decided to open-source the ones worth sharing.

These components are designed for non-technical Framer users. Each one comes with wizard-style documentation so you can drop it into your project without touching code. If you *do* want to customize, everything is a single `.tsx` file with clean props and no external dependencies.

The goal is simple: give Framer builders production-ready components that respect user privacy by default and just work.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [LinkTree Replacement](./linktree-replacement) | Complete link-in-bio page with wizard docs, themes, and optional analytics | Ready |
| [Eye Tracker](./eye-tracker) | Animated eyes that follow cursor with blinking and easter eggs | Ready |

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

## Installation

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

## Contributing

Pull requests welcome. If you build something useful on top of these components, I'd love to see it.

## License

All components are [MIT licensed](LICENSE).

---

<div align="center">

**Built by [Rebecca Rae Barton](https://rebeccaraebarton.com)**

[Live demos](https://rebeccaraebarton.com/work) · [GitHub](https://github.com/thatrebeccarae/framer-components)

</div>
