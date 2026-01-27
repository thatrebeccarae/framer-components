# Step 9: Optional Components

## What We'll Do

Add fun, interactive extras to your link page.

## Available Extras

### 1. EyeTracker
Animated cartoon eyes that follow the visitor's cursor. A fun way to add personality!

### 2. LinksContainer (Page Wrapper)
A styled container that handles page layout, centering, and responsive design.

---

## EyeTracker Component

### Features
- Eyes follow cursor/touch input
- Natural blinking animation
- Hidden "dizzy" easter egg
- Multiple eye shapes
- Fully customizable colors

### Adding EyeTracker

#### 1. Add Code Component

1. Create new code component: `EyeTracker`
2. Copy contents of `components/EyeTracker.tsx`
3. Paste and save

#### 2. Add to Canvas

1. Drag EyeTracker from Assets
2. Position where you want it (usually at top or bottom)
3. Resize by adjusting height

#### 3. Customize

| Property | Description | Recommended |
|----------|-------------|-------------|
| Eye Color | Sclera color | #FFFFFF |
| Pupil Color | Pupil/iris color | Match your theme |
| Border Color | Outline color | Match your theme |
| Eye Shape | almond, round, wide, egg | almond |
| Eye Size | Height in pixels | 60-100px |
| Show Highlight | Adds shine to pupil | true |
| Enable Dizzy | Easter egg when hovering between eyes | true |

### Design Ideas

**Peeking from top:**
- Place at the very top of the page
- Small size (40-60px height)
- Like someone peeking over a wall

**Centered accent:**
- Place below profile, above links
- Medium size (80px)
- Adds playfulness

**Footer guardian:**
- Place at the bottom
- Large size (100px+)
- Watching visitors as they scroll

---

## LinksContainer Component

### What It Does
- Centers content with max-width
- Handles page background
- Manages spacing between elements
- Provides responsive padding

### Adding LinksContainer

#### 1. Add Code Component

1. Create new code component: `LinksContainer`
2. Copy contents of `components/LinksContainer.tsx`
3. Paste and save

#### 2. Wrap Your Content

1. Drag LinksContainer onto canvas
2. Move your existing elements inside it
3. Adjust properties as needed

#### 3. Customize

| Property | Description | Default |
|----------|-------------|---------|
| Max Width | Maximum container width | 480px |
| Background | Page background color | rgb(15, 14, 14) |
| Padding V | Vertical padding | 40px |
| Padding H | Horizontal padding | 20px |
| Gap | Space between children | 18px |
| Full Height | Use full viewport height | true |

---

## Combining Components

### Recommended Layout Structure

```
LinksContainer
├── LinksHeader (profile)
├── SocialIconLinks (social icons)
├── LinkCard (link 1)
├── LinkCard (link 2)
├── LinkCard (link 3)
├── ...
└── EyeTracker (optional fun)
```

### Tips

1. **Don't nest containers** - One LinksContainer is enough
2. **Keep it simple** - Less is more for link pages
3. **Test mobile** - Preview at different screen sizes
4. **Accessibility** - EyeTracker respects reduced motion preferences

---

## Other Enhancement Ideas

### Not Using Code Components

**Custom animations:**
- Use Framer's built-in interactions
- Add hover effects to native elements
- Create scroll-triggered animations

**Gradient backgrounds:**
- Use Framer's gradient fill tool
- Animate background colors
- Add subtle patterns

**Custom fonts:**
- Connect Google Fonts in site settings
- Use consistent typography
- Consider readability on all devices

---

## Checkpoint

- [ ] Optional components added (if wanted)
- [ ] Everything still works correctly
- [ ] Page looks good on mobile
- [ ] Fun elements don't distract from main links

---

## You're Done!

Congratulations on building your link page!

### Next Steps

1. **Share it** - Add to all your social bios
2. **Monitor** - Check analytics (if configured)
3. **Update regularly** - Keep links fresh
4. **Iterate** - Try different themes and layouts

### Getting Help

- [Troubleshooting Guide](troubleshooting.md)
- [Report Issues](../../issues)
- [Framer Community](https://framer.community)

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
