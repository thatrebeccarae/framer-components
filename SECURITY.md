# Security Policy

## Reporting a Vulnerability

If you discover a security or privacy issue in any component, **please do not open a public GitHub issue**. Disclose responsibly by emailing:

**security@rebeccaraebarton.com**

Include:

- Which package and file are affected
- A description of the issue and potential impact
- Steps to reproduce (proof-of-concept welcomed)
- Your name and affiliation if youd like attribution

## Response Timeline

- **Within 72 hours:** acknowledgement of your report
- **Within 7 days:** initial assessment and severity triage
- **Within 30 days:** patch released for confirmed vulnerabilities, or written explanation if the issue is determined out-of-scope

## Scope

In scope:

- Code components in this repository (`.tsx` files)
- Worker-setup documentation (`docs/*.md`) — if the documented pattern leaks secrets or recommends an insecure approach
- Configuration defaults in `.github/`
- Personal data leakage in synced content (paths, hostnames, credentials)

Out of scope:

- Vulnerabilities in third-party services the components integrate with (Spotify, Substack, Cloudflare) — report those to the respective vendors
- Issues that require a maliciously configured Worker
- Issues in a forked or modified version of any component
- Social engineering, physical attacks, or denial-of-service against author infrastructure

## What Counts as a Security Issue

- **High:** hardcoded secrets, credential leaks, XSS in component output, data exfiltration via component
- **Medium:** missing CORS hardening guidance, insecure-by-default property controls, privacy issues not disclosed in PRIVACY.md
- **Low:** typos in security documentation, outdated dependency references

## Coordinated Disclosure

Reporters who follow this process will be credited in the relevant package CHANGELOG (with your permission). The maintainer commits to:

- Not pursuing legal action against good-faith security researchers
- Crediting the reporter publicly once a fix is released
- Notifying users of high-severity issues via repo release notes and README updates

Thank you for helping keep this project safe.
