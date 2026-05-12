# Privacy Commitment — Music Pill

This component is designed to be analytics-optional and privacy-respecting.

## What This Package Does

- Polls **your own** Cloudflare Worker for the currently-playing track on your Spotify account
- Embeds Spotifys official iframe player (which renders the album art, title, artist, and controls)
- Does **not** track visitors or send analytics anywhere

## What Spotify Sees

The Spotify iframe is a third-party embed governed by [Spotifys privacy policy](https://www.spotify.com/legal/privacy-policy/). When a visitor views the embed, their browser makes requests directly to Spotifys CDN. Cookies and tracking are subject to Spotifys terms.

To minimize Spotify-side tracking:
- Use the `dark` or `light` embed theme variant (both are functionally equivalent)
- The `compact` embed size loads fewer assets than `standard`
- Consider showing the component only behind a user action (e.g., toggle button) if absolute privacy is required

## What You Need To Know

- Your Worker holds your Spotify OAuth refresh token (server-side only — never exposed to the browser)
- The Worker makes outbound requests to Spotifys API on its own behalf
- Cloudflare may log Worker requests per their standard infrastructure logging
- The component stores **no data** in localStorage, sessionStorage, or cookies

## What You Control

- The Worker URL (set via Framer property controls)
- The poll interval (longer = fewer Worker invocations, slightly stale display)
- Whether the component shows when idle (no track playing)

## Reporting Issues

Privacy concerns or suspected leaks: open an issue or email per [SECURITY.md](../SECURITY.md) at the root.
