# Fluid Typography for Framer

Drop-in fluid typography system. Injects a global stylesheet that scales `<h1>`–`<h6>` plus a custom `.h7` utility class from a minimum size up to a base size at the design width (1440px by default). Heading sizes are responsive across the full viewport range without media queries.

## Files

| File | Description |
|------|-------------|
| [FluidTypography.tsx](FluidTypography.tsx) | Framer code component — drop on any page to inject the styles |
| [fluid-typography.css](fluid-typography.css) | The raw stylesheet, for non-Framer use or reference |

## Features

- **Single-file install** — drop the component on any page
- **No media queries** — uses `max()` and `vw` units for true fluid scaling
- **CSS custom properties** — `--min` and `--base` per heading level, easy to override
- **Tight letter-spacing and line-height** — opinionated defaults for display type
- **Custom `.h7` utility** — extra-small scale below `<h6>`
- **`text-wrap: balance`** — modern browsers automatically balance heading line breaks
- **Font smoothing baked in** — `-webkit-font-smoothing: antialiased` for crisp rendering

## How It Works

The component injects a stylesheet on mount. Each heading sets two CSS variables — `--min` (minimum size in px) and `--base` (size in px at 1440px viewport). Heading sizes resolve via:

```css
font-size: max(calc(var(--min) * 1px), calc((var(--base) / var(--dw)) * 100vw))
```

This guarantees the heading never shrinks below `--min` but scales up linearly with viewport width to `--base` at design width and beyond.

## Quick Start

1. In Framer, create a new Code Component
2. Copy the contents of [FluidTypography.tsx](FluidTypography.tsx)
3. Paste into the Code Component editor and save
4. Drag the component anywhere on your page — it renders nothing visible but injects the styles globally

## Customization

To override a heading size, add your own CSS via Framers Custom Code section or override the CSS variables:

```css
h1 { --min: 32; --base: 96; }
```

## License

MIT — see [LICENSE](LICENSE).

## Author

[Rebecca Rae Barton](https://rebeccaraebarton.com) · [framer-components](https://github.com/thatrebeccarae/framer-components)
