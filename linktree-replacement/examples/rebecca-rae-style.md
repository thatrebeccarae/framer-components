# Rebecca Rae Style Example

A dark, minimal design with social icons and clean link cards. Based on the live site at rebeccaraebarton.com/links.

## Preview

The page features:
- Dark background (`rgb(15, 14, 14)`)
- Centered profile with circular photo
- 8 social media icons in a horizontal row
- Multiple link cards with icons and optional pulse indicators
- Clean Inter typography

## Page Structure

```
LinksContainer (dark background)
├── LinksHeader
│   ├── Profile Photo (48x48, circular)
│   ├── Username: "@thatrebeccarae"
│   └── Bio: "hi."
├── SocialIconLinks
│   └── LinkedIn, Instagram, Pinterest, TikTok, Spotify, BlueSky, Threads, X
├── LinkCard (Portfolio)
├── LinkCard (YouTube)
├── LinkCard (Newsletter)
└── ...more links
```

## Configuration

### LinksContainer
```
maxWidth: 480
backgroundColor: "rgb(15, 14, 14)"
paddingVertical: 40
paddingHorizontal: 20
gap: 18
fullHeight: true
```

### LinksHeader
```
profileImage: [your-photo.jpg]
profileSize: 48
username: "@thatrebeccarae"
bio: "hi."
alignment: "center"
usernameColor: "#FFFFFF"
bioColor: "rgba(255, 255, 255, 0.7)"
gap: 14
```

### SocialIconLinks
```
links: [
  { platform: "linkedin", url: "https://linkedin.com/in/yourprofile" },
  { platform: "instagram", url: "https://instagram.com/yourhandle" },
  { platform: "pinterest", url: "https://pinterest.com/yourhandle" },
  { platform: "tiktok", url: "https://tiktok.com/@yourhandle" },
  { platform: "spotify", url: "https://open.spotify.com/user/..." },
  { platform: "bluesky", url: "https://bsky.app/profile/yourhandle" },
  { platform: "threads", url: "https://threads.net/@yourhandle" },
  { platform: "x", url: "https://x.com/yourhandle" }
]
iconSize: 24
gap: 15
iconColor: "#FFFFFF"
hoverColor: "rgba(255, 255, 255, 0.7)"
```

### LinkCard (Standard)
```
linkName: "My Portfolio"
description: "View my work"
url: "https://yoursite.com"
iconImage: [optional-icon.png]
iconSize: 36
showPulseDot: false
backgroundColor: "rgba(15, 14, 14, 0.1)"
hoverBackgroundColor: "rgba(15, 14, 14, 0.5)"
textColor: "#FFFFFF"
descriptionColor: "rgba(255, 255, 255, 0.7)"
borderRadius: 12
padding: 16
openInNewTab: true
```

### LinkCard (With Pulse Highlight)
```
linkName: "New Blog Post"
description: "Check out my latest article"
url: "https://yoursite.com/blog/latest"
showPulseDot: true
pulseDotColor: "rgb(255, 85, 136)"
// ...rest same as standard
```

## Key Design Elements

### Colors
| Element | Value |
|---------|-------|
| Background | `rgb(15, 14, 14)` |
| Card BG | `rgba(15, 14, 14, 0.1)` |
| Card Hover | `rgba(15, 14, 14, 0.5)` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `rgba(255, 255, 255, 0.7)` |
| Accent | `rgb(255, 85, 136)` |

### Spacing
| Element | Value |
|---------|-------|
| Container max-width | 480px |
| Outer padding | 40px top, 20px sides |
| Gap between sections | 18px |
| Profile gap | 14px |
| Social icon gap | 15px |
| Card padding | 16px |
| Card border-radius | 12px |

### Typography
| Element | Font | Weight |
|---------|------|--------|
| Username | Inter | SemiBold (600) |
| Bio | Inter | Medium (500) |
| Link Name | Inter | SemiBold (600) |
| Description | Inter | Medium (500) |

## Optional: Add EyeTracker

For extra personality, add the EyeTracker component at the bottom:

```
eyeColor: "#FFFFFF"
pupilColor: "#000000"
borderColor: "#000000"
eyeShape: "almond"
eyeSize: 60
showIrisHighlight: true
enableDizzy: true
```

## Live Reference

See this style in action: [rebeccaraebarton.com/links](https://rebeccaraebarton.com/links)
