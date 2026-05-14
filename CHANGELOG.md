# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) at the repo level (each package is copy-paste, not versioned independently).

## [4.0.0] — 2026-05-14

First tagged release of the post-restructure repo (prior tags v1.0.0 and v3.0.0 predate the May 2026 reorganization into per-package directories with full governance). Six packages ship as production-ready, with full per-package documentation, governance docs, and cross-promotion across the ecosystem.

### Packages

- **linktree-replacement** — Privacy-first link-in-bio page with wizard docs, themes, and optional analytics
- **substack-integration** — Paginated Substack feed + post counter, backed by a Cloudflare Worker proxy
- **music-pill** — Live Now-Playing Spotify card with animated header and Worker proxy
- **eye-tracker** — Animated eyes that follow the cursor with blinking and easter eggs
- **rolling-card-stack** — Animated card stack with smooth rolling transitions
- **fluid-typography** — Drop-in fluid heading scale, no media queries

### Repo

- Top-level `README.md` with hero image, badge row, package table, related repos, and About-the-author footer
- `ROADMAP.md` with shipped/next/suggesting sections
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1), `LICENSE` (MIT)
- Per-package READMEs each include a "Related packages" sibling-link section and an About block
- `.public-repo` marker, `.pii-allowlist`, `.commit-msg-blocklist` (with `\b` word boundaries on short tokens)
- Lint workflow enforcing README+LICENSE in every top-level package dir
- GitHub repo: secret scanning, push protection, Dependabot enabled

[4.0.0]: https://github.com/thatrebeccarae/framer-components/releases/tag/v4.0.0
