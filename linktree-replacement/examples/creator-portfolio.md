# Creator Portfolio Example

A link page designed for content creators: YouTubers, streamers, podcasters, and social media influencers.

## Preview

Features:
- Gradient background (Ocean theme)
- Large profile photo with ring accent
- Social platforms prominently displayed
- Content categories with distinct cards
- Newsletter/membership CTAs with pulse highlights

## Page Structure

```
LinksContainer (gradient background)
├── LinksHeader
│   ├── Profile Photo (80x80, with ring)
│   ├── Display Name
│   └── Creator tagline
├── SocialIconLinks (main platforms)
├── [Section: Latest Content]
├── LinkCard - Latest Video (with pulse)
├── LinkCard - Podcast Episode
├── [Section: Support Me]
├── LinkCard - Patreon/Ko-fi
├── LinkCard - Merch Store
├── [Section: Connect]
├── LinkCard - Newsletter
└── LinkCard - Collab Inquiries
```

## Configuration

### LinksContainer
```
maxWidth: 500
backgroundColor: "#667eea"  // Gradient will override
paddingVertical: 50
paddingHorizontal: 24
gap: 16
fullHeight: true
```

### LinksHeader
```
profileImage: [creator-photo.jpg]
profileSize: 80
username: "Your Creator Name"
bio: "Making content that matters | 100K+ subscribers"
alignment: "center"
usernameColor: "#FFFFFF"
bioColor: "rgba(255, 255, 255, 0.9)"
gap: 12
```

### SocialIconLinks
```
links: [
  { platform: "youtube", url: "https://youtube.com/@yourchannel" },
  { platform: "tiktok", url: "https://tiktok.com/@yourhandle" },
  { platform: "instagram", url: "https://instagram.com/yourhandle" },
  { platform: "x", url: "https://x.com/yourhandle" },
  { platform: "spotify", url: "https://open.spotify.com/show/..." }
]
iconSize: 28
gap: 20
iconColor: "#FFFFFF"
hoverColor: "rgba(255, 255, 255, 0.75)"
```

### LinkCard - Latest Video (Featured)
```
linkName: "NEW VIDEO: Title Here"
description: "Watch now on YouTube"
url: "https://youtube.com/watch?v=..."
iconImage: [youtube-thumbnail.jpg]
iconSize: 48
showPulseDot: true
pulseDotColor: "#FF0000"
backgroundColor: "rgba(255, 255, 255, 0.2)"
hoverBackgroundColor: "rgba(255, 255, 255, 0.35)"
textColor: "#FFFFFF"
descriptionColor: "rgba(255, 255, 255, 0.85)"
borderRadius: 16
padding: 18
```

### LinkCard - Support/Merch
```
linkName: "Join the Community"
description: "Patreon exclusive content"
url: "https://patreon.com/yourchannel"
iconImage: [patreon-icon.png]
iconSize: 40
showPulseDot: false
backgroundColor: "rgba(255, 255, 255, 0.15)"
hoverBackgroundColor: "rgba(255, 255, 255, 0.25)"
// ...rest same colors
```

### LinkCard - Newsletter
```
linkName: "Weekly Newsletter"
description: "Behind-the-scenes + exclusive content"
url: "https://newsletter.yoursite.com"
showPulseDot: true
pulseDotColor: "#00D4FF"
// ...rest same colors
```

## Content Categories

### Latest Content
- Most recent video/podcast (featured with pulse)
- Second most recent
- "View All" link to channel

### Support & Merch
- Patreon / Ko-fi / Buy Me a Coffee
- Merchandise store
- Affiliate links (disclosed)

### Connect
- Newsletter signup
- Business inquiries
- Discord community

## Gradient Background (Framer)

1. Click on page canvas
2. Set Fill to Gradient (Linear)
3. Angle: 135°
4. Stop 1: `#667eea` at 0%
5. Stop 2: `#764ba2` at 100%

## Pro Tips

### Highlight New Content
- Use `showPulseDot: true` on your latest/featured content
- Change pulse color to match platform (red for YouTube, etc.)
- Update weekly with new content

### Organize by Priority
1. Latest content first (what they came for)
2. Support options (for superfans)
3. Newsletter (capture leads)
4. Everything else

### Mobile Optimization
- Keep link names short (under 30 chars)
- Use recognizable icons
- Test on your phone before publishing

## Example Links

| Link Name | Description | URL Type |
|-----------|-------------|----------|
| Latest Video | Watch now | YouTube video |
| Podcast | New episode | Spotify/Apple |
| Patreon | Exclusive content | Membership |
| Merch | Official store | Shopify/Etsy |
| Newsletter | Weekly updates | Beehiiv/Substack |
| Discord | Join community | Discord invite |
| Collabs | Work with me | Email/Form |
