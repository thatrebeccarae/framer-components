# Cloudflare Worker Setup — Substack Proxy

The `SubstackFeed` and `SubstackItemCounter` components require a Cloudflare Worker that proxies Substacks archive API and adds CORS headers.

## Why You Need This

Substacks `/api/v1/archive` endpoint returns valid JSON, but **without** the `Access-Control-Allow-Origin` header. Modern browsers block cross-origin `fetch()` calls without that header. A Worker fronts the API and adds CORS headers your Framer site can consume.

## Endpoint Contract

The components expect the following endpoints on your Worker:

### `GET /feed?limit=N&offset=N&section=slug&excludeSections=slug1,slug2`

Returns a paginated list of posts as JSON.

**Response shape:**

```json
{
  "posts": [
    {
      "title": "string",
      "link": "https://yourblog.substack.com/p/post-slug",
      "pubDate": "2026-01-15T10:00:00Z",
      "excerpt": "string",
      "image": "https://...",
      "tags": ["ai", "strategy"],
      "section": "essays"
    }
  ],
  "total": 142,
  "hasMore": true
}
```

### `GET /count`

Returns the total archive count. Cached for ~1 hour at the edge.

**Response shape:**

```json
{ "count": 142 }
```

## Reference Implementation

A reference Worker (not included in this repo) handles:

1. Fetching `https://YOUR_BLOG.substack.com/api/v1/archive?limit=12&offset=0`
2. Mapping the response to the contract above
3. Adding `Access-Control-Allow-Origin` header for **both** your apex AND `www` subdomain (Framer publishes under `www` by default)
4. Setting `Vary: Origin` to prevent cache contamination between origins
5. Caching `/feed` for 5 minutes and `/count` for 1 hour via `caches.default`

### CORS gotcha

Always allowlist **both** `https://yourdomain.com` AND `https://www.yourdomain.com` in your Worker. Framer publishes custom domains under `www` by default. Missing one causes invisible failures — the Framer editor preview works (it runs from `*.framer.app`) but the published site fails silently.

## Deployment

1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Create a Worker project with your endpoint logic
4. Set environment variables for your Substack URL
5. `wrangler deploy`
6. Copy the deployed URL (e.g., `https://substack-proxy.yourdomain.workers.dev`)
7. Paste that URL into the `Proxy URL` property control on `SubstackFeed` and `SubstackItemCounter` in Framer

## Verifying

- Open your Framer published site in a browser
- DevTools → Network → confirm the request to `/feed` returns 200
- Check the response headers include `Access-Control-Allow-Origin: https://www.yourdomain.com`

If the editor preview works but the published site fails, its almost certainly a CORS or `www` allowlist issue.
