# Privacy Commitment — Substack Integration

These components are designed to be analytics-optional and privacy-respecting.

## What This Package Does

- Fetches post data from **your own** Cloudflare Worker proxy
- Renders posts directly in the browser
- Does **not** include any third-party analytics, tracking pixels, or telemetry
- Does **not** make requests to any servers other than the proxy URL you configure

## What You Need To Know

- The Worker proxy you deploy will receive requests from your visitors browsers
- Cloudflare may log these requests per their standard infrastructure logging
- If you configure the proxy with caching enabled, responses are cached at the edge
- The components store **no data** in localStorage, sessionStorage, or cookies

## What You Control

- The Worker URL (set via Framer property controls)
- Whether to cache responses, and for how long (set in your Worker code)
- Whether to add additional logging in your Worker (default: minimal)

## Reporting Issues

Privacy concerns or suspected leaks: open an issue on the [repo](https://github.com/thatrebeccarae/framer-components/issues) or email per [SECURITY.md](../SECURITY.md) at the root.
