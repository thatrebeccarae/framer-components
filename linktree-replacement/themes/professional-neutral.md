# Professional Neutral Theme

Muted, corporate-friendly colors with a polished, trustworthy appearance.

![Professional Neutral Preview](../assets/wizard-screenshots/theme-professional-neutral.png)

## Color Palette

| Element | Color | Format |
|---------|-------|--------|
| Background | `#F5F5F5` | Light gray |
| Text (Primary) | `#2C3E50` | Dark blue-gray |
| Text (Secondary) | `rgba(44, 62, 80, 0.65)` | 65% text color |
| Card Background | `#FFFFFF` | White |
| Card Hover | `#FAFAFA` | Slightly darker white |
| Card Border | `1px solid #E5E5E5` | Light gray border |
| Icons | `#2C3E50` | Dark blue-gray |
| Icon Hover | `#3498DB` | Blue |
| Accent (Pulse) | `#3498DB` | Blue |

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Username | Inter | SemiBold (600) | 16px |
| Bio | Inter | Regular (400) | 14px |
| Link Name | Inter | Medium (500) | 15px |
| Link Description | Inter | Regular (400) | 13px |

## Component Settings

### LinksHeader
```
usernameColor: "#2C3E50"
bioColor: "rgba(44, 62, 80, 0.65)"
```

### SocialIconLinks
```
iconColor: "#2C3E50"
hoverColor: "#3498DB"
```

### LinkCard
```
backgroundColor: "#FFFFFF"
hoverBackgroundColor: "#FAFAFA"
textColor: "#2C3E50"
descriptionColor: "rgba(44, 62, 80, 0.65)"
borderRadius: 8
```

Note: For the subtle border effect, add custom styling or use native Framer frames.

### LinksContainer
```
backgroundColor: "#F5F5F5"
maxWidth: 480
paddingVertical: 40
paddingHorizontal: 20
gap: 14
```

## Page Setup in Framer

1. Select the page canvas
2. In the right panel, find "Fill"
3. Enter: `#F5F5F5`

## Card Styling Details

For the refined card appearance:

**Basic Card:**
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Border radius: 8px
- Shadow: `0 1px 3px rgba(0,0,0,0.08)`

**Hover State:**
- Background: `#FAFAFA`
- Border: `1px solid #D5D5D5`
- Shadow: `0 2px 6px rgba(0,0,0,0.1)`

## Best For

- Consultants and coaches
- B2B services
- Financial services
- Legal professionals
- Healthcare professionals
- Corporate executives
- Job seekers (resume link)

## Professional Variations

### Warmer Neutral
| Element | Color |
|---------|-------|
| Background | `#FAF8F5` |
| Card | `#FFFFFF` |
| Text | `#4A4A4A` |
| Accent | `#D4A373` |

### Cooler Neutral
| Element | Color |
|---------|-------|
| Background | `#F0F4F8` |
| Card | `#FFFFFF` |
| Text | `#334E68` |
| Accent | `#627D98` |

## Accessibility Notes

- Contrast ratio: ~10:1 (excellent)
- Professional appearance while remaining accessible
- Good for all environments
- Print-friendly colors
