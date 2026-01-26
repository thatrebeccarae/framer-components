# Eye Tracker Component for Framer

Animated cartoon eyes that follow your cursor, blink naturally, and include a hidden easter egg.

![Eye Tracker Preview](assets/preview.gif)

## Features

- **Cursor Tracking** - Pupils follow mouse, touch, and pen input in real-time with smooth transitions
- **Natural Blinking** - Randomized blink intervals with configurable timing
- **4 Eye Shapes** - Almond, Round (Googly), Wide, and Egg
- **Dizzy Easter Egg** - Hover between the eyes to trigger a dizzy animation
- **Fully Responsive** - Height-driven sizing that scales proportionally
- **Highly Customizable** - All colors, sizes, and behaviors configurable via Framer controls
- **Mobile/Touch Support** - Works with touch screens and stylus input via Pointer Events
- **Accessibility** - Respects `prefers-reduced-motion` system setting
- **Memory Safe** - Proper cleanup of all timers and animations on unmount

## Installation

### Option 1: Copy & Paste (Recommended)

1. In your Framer project, create a new Code Component
2. Copy the contents of `src/EyeTracker.tsx`
3. Paste into your new component
4. Save and drag onto canvas

### Option 2: GitHub Sync

1. Fork this repo or use the GitHub Link Plugin in Framer
2. Link to `src/EyeTracker.tsx`
3. Sync and the component will appear in your assets

## Usage

1. Drag the Eye Tracker component onto your canvas
2. Resize the frame height to control eye size (width auto-calculates)
3. Customize colors and behavior in the properties panel

## Property Controls

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Eye Color** | Color | `#FFFFFF` | Background color of the eye |
| **Pupil Color** | Color | `#000000` | Color of the pupil |
| **Border Color** | Color | `#000000` | Border and eyelid color |
| **Eye Shape** | Enum | `almond` | Shape: almond, round, wide, egg |
| **Eye Size** | Number | `80px` | Fallback size when container not measured |
| **Eye Gap** | Number | `0.15` | Gap between eyes (relative to eye size) |
| **Pupil Size** | Number | `0.4` | Pupil size (relative to eye size) |
| **Border Width** | Number | `0.05` | Border thickness (relative) |
| **Tracking Speed** | Number | `0.1s` | How quickly pupils follow cursor |
| **Blink Speed** | Number | `150ms` | Duration of blink animation |
| **Blink Interval** | Number | `3500ms` | Average time between blinks |
| **Blink Randomness** | Number | `0.3` | Variation in blink timing (0-0.5) |
| **Show Highlight** | Boolean | `false` | Show reflection highlight on pupil |
| **Highlight Color** | Color | `rgba(255,255,255,0.6)` | Highlight color |
| **Enable Dizzy** | Boolean | `true` | Enable dizzy easter egg |
| **Dizzy Delay** | Number | `1200ms` | Hover time to trigger dizzy |

## Eye Shapes

| Shape | Description | Aspect Ratio |
|-------|-------------|--------------|
| **Almond** | Classic cartoon eye, slightly wider than tall | width = height / 0.85 |
| **Round** | Perfect circle, googly eye style | width = height |
| **Wide** | Wide and flat, exaggerated horizontal | width = height * 2 |
| **Egg** | Taller than wide, rounded top | width = height * 0.7 |

## Easter Egg

Hover your cursor in the gap between the eyes for ~1.2 seconds to trigger a dizzy animation where:
- Pupils spin in opposite directions
- Eyes bounce and wobble
- Pupils dilate and contract

The delay is configurable via the **Dizzy Delay** property.

## Accessibility

The component respects the `prefers-reduced-motion` system setting:
- When reduced motion is enabled, the dizzy animation is skipped entirely
- Eyes immediately return to their resting state instead of animating

To test, enable "Reduce Motion" in your system accessibility settings.

## Technical Notes

### Responsive Sizing

The component uses **height-driven sizing**:
- Set the frame height to control eye size
- Width auto-calculates based on eye shape
- Uses ResizeObserver for instant response to size changes

### Performance

- Static objects hoisted to module scope to prevent recreation
- Split state atoms for targeted re-renders
- Memoized dimension calculations
- CSS transforms for GPU-accelerated animations
- Threshold-based resize detection prevents feedback loops
- No memory leaks - all timeouts properly cleaned up on unmount

### Input Support

Uses Pointer Events API for unified input handling:
- Mouse cursor tracking
- Touch input on mobile/tablet
- Stylus/pen input on supported devices

### Browser Support

- Modern browsers with ResizeObserver and Pointer Events support
- Falls back gracefully in SSR environments

## Customization Examples

### Googly Eyes
```
Eye Shape: Round
Pupil Size: 0.5
Border Width: 0.08
Tracking Speed: 0.05
```

### Sleepy Eyes
```
Eye Shape: Wide
Blink Frequency: 2000ms
Blink Speed: 300ms
Pupil Size: 0.3
```

### Cartoon Character
```
Eye Shape: Almond
Show Highlight: true
Eye Color: #FFFFFF
Border Color: #333333
```

## Changelog

### v3.0.0 (2026-01-26)
- Added touch/pen support via Pointer Events
- Added `prefers-reduced-motion` accessibility support
- Fixed memory leak in blink timeout cleanup
- Improved performance with memoization and split state
- Fixed stale closure bug in dizzy state detection
- Smoother dizzy animation (CSS transition disabled during rAF)

### v2.0.0
- Initial public release
- Height-driven responsive sizing
- 4 eye shapes
- Dizzy easter egg

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Created by [Rebecca Rae Barton](https://rebeccaraebarton.com)

**Live demo:** [rebeccaraebarton.com/work/watching-you-cursor](https://rebeccaraebarton.com/work/watching-you-cursor)

---

**Found a bug?** [Open an issue](../../issues)

**Want to contribute?** PRs welcome!
