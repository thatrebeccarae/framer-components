# Cloudflare Worker Setup — Spotify Proxy

The `MusicPill_NowPlaying` component requires a Cloudflare Worker that talks to Spotifys API on your behalf and returns the currently-playing track as CORS-enabled JSON.

## Why You Need This

Spotifys OAuth flow requires a server-side step to refresh access tokens — you cannot put a long-lived token in client-side code. The Worker holds your refresh token securely as an environment variable and exchanges it for short-lived access tokens to call `GET /me/player/currently-playing`.

## One-Time Spotify Setup

1. Visit [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and create an app
2. Note your `Client ID` and `Client Secret`
3. Add a Redirect URI (e.g., `http://localhost:8888/callback` for the auth flow)
4. Complete the OAuth Authorization Code flow once to obtain a `refresh_token` with scope `user-read-currently-playing`

Plenty of one-off scripts exist for this; search for "Spotify refresh token" and run the auth flow once locally.

## Endpoint Contract

The component expects:

### `GET /` (or any path you configure)

Returns the current track or a fallback shape.

**Response shape when playing:**

```json
{
  "isPlaying": true,
  "trackId": "spotify-track-id",
  "title": "Track Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumArt": "https://i.scdn.co/image/...",
  "trackUrl": "https://open.spotify.com/track/...",
  "progressMs": 87000,
  "durationMs": 240000
}
```

**Response shape when idle:**

```json
{ "isPlaying": false, "isFallback": true }
```

## Worker Skeleton

```javascript
export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "https://www.yourdomain.com",
      "Vary": "Origin",
      "Content-Type": "application/json",
    };

    // Exchange refresh token for access token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(env.CLIENT_ID + ":" + env.CLIENT_SECRET),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=refresh_token&refresh_token=" + env.REFRESH_TOKEN,
    });
    const { access_token } = await tokenRes.json();

    // Fetch currently-playing
    const playRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { "Authorization": "Bearer " + access_token },
    });

    if (playRes.status === 204) {
      return new Response(JSON.stringify({ isPlaying: false, isFallback: true }), { headers });
    }

    const data = await playRes.json();
    return new Response(JSON.stringify({
      isPlaying: data.is_playing,
      trackId: data.item?.id,
      title: data.item?.name,
      artist: data.item?.artists?.map(a => a.name).join(", "),
      album: data.item?.album?.name,
      albumArt: data.item?.album?.images?.[0]?.url,
      trackUrl: data.item?.external_urls?.spotify,
      progressMs: data.progress_ms,
      durationMs: data.item?.duration_ms,
    }), { headers });
  },
};
```

## Environment Variables

Set via `wrangler secret put`:

- `CLIENT_ID` — Spotify app Client ID
- `CLIENT_SECRET` — Spotify app Client Secret
- `REFRESH_TOKEN` — long-lived refresh token from one-time OAuth flow

## Deployment

```bash
wrangler deploy
```

Copy the deployed URL into the `Worker URL` property control on the Framer component.

## Rate Limiting

Spotifys API has generous limits but you should still cache responses:

- The component polls every `pollIntervalSeconds` (default 30s)
- Adding edge caching to the Worker (e.g., 10s TTL) prevents thundering-herd if many visitors view simultaneously
- Use `caches.default` and key by request URL
