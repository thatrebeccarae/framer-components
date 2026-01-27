# Gradient Sunset Theme

Warm orange-pink gradient with a creative, energetic vibe.

![Gradient Sunset Preview](../assets/wizard-screenshots/theme-gradient-sunset.png)

## Color Palette

| Element | Color | Format |
|---------|-------|--------|
| Background Start | `#FF6B6B` | Coral red |
| Background End | `#FFE66D` | Golden yellow |
| Gradient Direction | 135deg | Top-left to bottom-right |
| Text (Primary) | `#FFFFFF` | White |
| Text (Secondary) | `rgba(255, 255, 255, 0.85)` | 85% white |
| Card Background | `rgba(255, 255, 255, 0.2)` | 20% white |
| Card Hover | `rgba(255, 255, 255, 0.35)` | 35% white |
| Icons | `#FFFFFF` | White |
| Icon Hover | `rgba(255, 255, 255, 0.75)` | 75% white |
| Accent (Pulse) | `#FFFFFF` | White |

## Gradient CSS

```css
background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
```

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Username | Inter | SemiBold (600) | 16px |
| Bio | Inter | Medium (500) | 14px |
| Link Name | Inter | SemiBold (600) | 15px |
| Link Description | Inter | Medium (500) | 13px |

## Component Settings

### LinksHeader
```
usernameColor: "#FFFFFF"
bioColor: "rgba(255, 255, 255, 0.85)"
```

### SocialIconLinks
```
iconColor: "#FFFFFF"
hoverColor: "rgba(255, 255, 255, 0.75)"
```

### LinkCard
```
backgroundColor: "rgba(255, 255, 255, 0.2)"
hoverBackgroundColor: "rgba(255, 255, 255, 0.35)"
textColor: "#FFFFFF"
descriptionColor: "rgba(255, 255, 255, 0.85)"
borderRadius: 16
```

### LinksContainer
```
backgroundColor: "#FF6B6B"  // Will be overridden by gradient
maxWidth: 480
paddingVertical: 40
paddingHorizontal: 20
gap: 18
```

## Page Setup in Framer

1. Select the page canvas
2. In the right panel, find "Fill"
3. Click the color picker
4. Switch to "Gradient" mode (Linear)
5. Set angle to 135°
6. First stop: `#FF6B6B` at 0%
7. Second stop: `#FFE66D` at 100%

## Best For

- Content creators
- Food & lifestyle brands
- Travel and adventure
- Warm, friendly personalities
- Sunset/summer vibes

## Accessibility Notes

- Contrast ratio: ~4.5:1 (acceptable)
- Use larger text for better readability
- Cards help with contrast
