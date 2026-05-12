# Contributing to framer-components

Pull requests, bug reports, and component contributions are welcome.

## Before You Open a PR

- Open an issue first for non-trivial changes so we can align on approach
- For new components, check the [Whats Coming](README.md#whats-coming) section — the next batch may already overlap with what you have in mind
- Keep PRs focused: one component or one fix per PR

## How This Repo Is Structured

Each top-level folder is a self-contained **package**. A package has:

- A single Framer Code Component (or several, in `components/`)
- A `README.md` with install steps, prop reference, and a live demo link
- A `LICENSE` file (MIT)
- `PRIVACY.md` if the package talks to external APIs or third parties
- `docs/` for setup walkthroughs (e.g., Cloudflare Worker deployment)

CI enforces that every top-level package directory has `README.md` and `LICENSE` — see [.github/workflows/lint.yml](.github/workflows/lint.yml).

## Sync Workflow

This repo is the **public** mirror. Components are authored in a private development repo and synced here via a script. This means:

- **Reviewers / contributors:** PRs to this repo are welcome and will be merged here normally
- **Maintainer (Rebecca):** changes flow private → public via `scripts/sync-public.sh`, with a personal-data leak scan before each sync

If your PR touches a synced file (`eye-tracker/`, `rolling-card-stack/`, or anything under `components/` in the structured packages), it will be reflected upstream in the next sync cycle.

If your PR adds **new** package docs (`README.md`, `LICENSE`, `PRIVACY.md`, `docs/*`), those live only here and are not affected by sync.

## Code Style

- **Single-file components.** Each component is one `.tsx` file with no build step. Resist adding dependencies.
- **Framer property controls.** All configuration goes through `addPropertyControls(...)` so non-technical users can configure in the canvas.
- **Privacy by default.** Components must not phone home, track users, or set cookies without explicit opt-in.
- **No brand-specific defaults.** Use generic placeholder URLs (`https://your-proxy.workers.dev`) in any component that hits an external service. Real URLs are set per-instance via property controls.

## Commit Messages

- Use clear, descriptive subjects in present tense (`Add tag filtering to SubstackFeed`, not `added tag filter`)
- No emoji prefixes
- No client names, internal tooling references, or personal data in messages

## Bug Reports

When opening an issue:

1. Identify the package (`eye-tracker`, `substack-integration`, etc.)
2. Describe what you expected vs. what happened
3. Include Framer plan/version if relevant (Free, Pro, etc.)
4. For CORS or Worker-related issues, paste the failing requests response headers from DevTools

## Security Issues

Do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree your contributions will be licensed under the [MIT License](LICENSE).
