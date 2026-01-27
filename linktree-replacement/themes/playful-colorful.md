# Playful Colorful Theme

Bright, energetic colors with a fun, youthful vibe.

![Playful Colorful Preview](../assets/wizard-screenshots/theme-playful-colorful.png)

## Color Palette

| Element | Color | Format |
|---------|-------|--------|
| Background | `#FFE4E1` | Misty rose |
| Text (Primary) | `#333333` | Dark gray |
| Text (Secondary) | `rgba(51, 51, 51, 0.7)` | 70% dark gray |
| Card Background | `#FFFFFF` | White |
| Card Hover | `#FFF0ED` | Light pink |
| Card Border | `2px solid #FF69B4` | Hot pink border |
| Icons | `#FF69B4` | Hot pink |
| Icon Hover | `#FF1493` | Deep pink |
| Accent (Pulse) | `#FF69B4` | Hot pink |

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Username | Inter | Bold (700) | 18px |
| Bio | Inter | Medium (500) | 14px |
| Link Name | Inter | SemiBold (600) | 15px |
| Link Description | Inter | Medium (500) | 13px |

## Component Settings

### LinksHeader
```
usernameColor: "#333333"
bioColor: "rgba(51, 51, 51, 0.7)"
```

### SocialIconLinks
```
iconColor: "#FF69B4"
hoverColor: "#FF1493"
```

### LinkCard
```
backgroundColor: "#FFFFFF"
hoverBackgroundColor: "#FFF0ED"
textColor: "#333333"
descriptionColor: "rgba(51, 51, 51, 0.7)"
borderRadius: 16
```

Note: For the border effect, you'll need to use native Framer elements or add custom CSS.

### LinksContainer
```
backgroundColor: "#FFE4E1"
maxWidth: 480
paddingVertical: 40
paddingHorizontal: 20
gap: 18
```

## Page Setup in Framer

1. Select the page canvas
2. In the right panel, find "Fill"
3. Enter: `#FFE4E1`

## Customization Ideas

### Alternative Accent Colors

| Style | Primary | Secondary |
|-------|---------|-----------|
| Hot Pink | `#FF69B4` | `#FF1493` |
| Electric Blue | `#00CED1` | `#008B8B` |
| Lime Green | `#32CD32` | `#228B22` |
| Sunny Yellow | `#FFD700` | `#FFA500` |
| Lavender | `#9B59B6` | `#8E44AD` |

### Card Border Styling

To add borders to cards, modify the LinkCard component or use native Framer frames with:
- Border: 2px solid [accent color]
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

## Best For

- Gen Z audiences
- Beauty and fashion
- Fun, casual brands
- Kid-friendly content
- Party/event planning
- Social media personalities

## Accessibility Notes

- Contrast ratio: ~8:1 (excellent for body text)
- Bright colors may be overwhelming for some
- Consider reduced motion preferences
