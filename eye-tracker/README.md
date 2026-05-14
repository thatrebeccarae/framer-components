# Eye Tracker for Framer

Animated cartoon eyes that follow the cursor — with natural blinking, multiple eye shapes, and a hidden easter egg. Single-file React/TypeScript component built for Framer.

![Live demo](https://www.rebeccaraebarton.com/work/watching-you-cursor)

## Features

- **Cursor tracking** — smooth pupil movement powered by `requestAnimationFrame`
- **Natural blinking** — configurable speed, frequency, and randomness
- **Four eye shapes** — Almond, Round (Googly), Wide, Egg
- **Easter egg** — hover between the eyes to trigger a hidden "dizzy" animation
- **Iris highlights** — optional realism layer
- **Height-driven responsive sizing** — scales with container
- **Framer property controls** — every option configurable in the canvas, no code edits needed
- **No dependencies** — single `.tsx` file, no build step

## Quick Start

1. In Framer, create a new Code Component
2. Copy the contents of [`EyeTrackerV3.tsx`](EyeTrackerV3.tsx)
3. Paste into the Code Component editor and save
4. Drag onto your canvas and configure via the properties panel

## Documentation

See [`EyeTrackerV3.md`](EyeTrackerV3.md) for full prop reference, configuration options, and implementation details.

## Live Demo

[rebeccaraebarton.com/work/watching-you-cursor](https://www.rebeccaraebarton.com/work/watching-you-cursor)

## Related packages

- [**rolling-card-stack**](../rolling-card-stack) — Animated card stack; another single-file flourish component
- [**fluid-typography**](../fluid-typography) — Drop-in fluid heading scale, no media queries
- [**linktree-replacement**](../linktree-replacement) — Privacy-first link-in-bio page (bundles EyeTracker as an optional component)

[See all packages →](../)

## License

MIT — see [LICENSE](LICENSE).

## About the author

By [Rebecca Rae Barton](https://rebeccaraebarton.com). I run a marketing-and-engineering practice; this one is the rare component that started as a "would this be fun" rather than a client need.

**Follow:** [Substack](https://dgtldept.substack.com) · [LinkedIn](https://linkedin.com/in/rebeccaraebarton) · [X](https://x.com/rebeccarae) · [Live demos](https://rebeccaraebarton.com/work)

**Other open-source:** [claude-marketing](https://github.com/thatrebeccarae/claude-marketing) (56 Claude Code skills for marketing teams) · [substack-aeo-proxy](https://github.com/dgtldept/substack-aeo-proxy) (free Vercel proxy for Substack AEO) · [framer-components](https://github.com/thatrebeccarae/framer-components) (this repo)
