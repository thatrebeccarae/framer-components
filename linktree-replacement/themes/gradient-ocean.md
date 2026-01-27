# Gradient Ocean Theme

Cool blue-purple gradient with a calm, professional-creative feel.

![Gradient Ocean Preview](../assets/wizard-screenshots/theme-gradient-ocean.png)

## Color Palette

| Element | Color | Format |
|---------|-------|--------|
| Background Start | `#667eea` | Periwinkle blue |
| Background End | `#764ba2` | Purple |
| Gradient Direction | 135deg | Top-left to bottom-right |
| Text (Primary) | `#FFFFFF` | White |
| Text (Secondary) | `rgba(255, 255, 255, 0.85)` | 85% white |
| Card Background | `rgba(255, 255, 255, 0.15)` | 15% white |
| Card Hover | `rgba(255, 255, 255, 0.25)` | 25% white |
| Icons | `#FFFFFF` | White |
| Icon Hover | `rgba(255, 255, 255, 0.75)` | 75% white |
| Accent (Pulse) | `#00D4FF` | Cyan |

## Gradient CSS

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
backgroundColor: "rgba(255, 255, 255, 0.15)"
hoverBackgroundColor: "rgba(255, 255, 255, 0.25)"
textColor: "#FFFFFF"
descriptionColor: "rgba(255, 255, 255, 0.85)"
borderRadius: 16
```

### LinksContainer
```
backgroundColor: "#667eea"  // Will be overridden by gradient
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
6. First stop: `#667eea` at 0%
7. Second stop: `#764ba2` at 100%

## Best For

- Tech professionals
- SaaS and digital products
- Creative professionals
- Music and audio
- Calm, trustworthy brands

## Accessibility Notes

- Contrast ratio: ~7:1 (very good)
- Deep colors provide good text readability
- Works well in both light and dark environments
