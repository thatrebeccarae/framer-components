# EyeTrackerV3 Component

A playful Framer component that renders animated cartoon eyes which follow the cursor, blink naturally, and include a hidden "dizzy" easter egg. Built with React, TypeScript, and Framer property controls (not Framer Motion).

## Features

- **Cursor Tracking**: Pupils follow the mouse cursor in real-time
- **Natural Blinking**: Eyes blink at randomized intervals with configurable speed, frequency, and randomness
- **Multiple Eye Shapes**: Almond, Round (Googly), Wide, and Egg shape presets
- **Dizzy Easter Egg**: Hover between the eyes to trigger a dizzy animation
- **Iris Highlights**: Optional reflection effect on pupils for added realism
- **Responsive Sizing**: Height-driven sizing that scales proportionally across all devices
- **Lightweight**: Uses native React hooks, CSS transitions, and requestAnimationFrame — no external animation libraries
- **Fully Customizable**: Colors, shapes, borders, spacing, and all animation timing configurable via Framer property controls

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| eyeColor | Color | #FFFFFF | Background color of the eye |
| pupilColor | Color | #000000 | Color of the pupil |
| borderColor | Color | #000000 | Border and eyelid color |
| eyeShape | Enum | almond | Shape: almond, round, wide, egg |
| eyeSize | Number | 80px | Base size (fallback when container not measured) |
| eyeGap | Number | 0.15 | Gap between eyes (relative to eye size) |
| pupilSize | Number | 0.4 | Pupil size (relative to eye size) |
| borderWidth | Number | 0.05 | Border thickness (relative to eye size) |
| trackingSpeed | Number | 0.1s | How quickly pupils follow the cursor |
| blinkSpeed | Number | 150ms | Duration of blink animation |
| blinkFrequency | Number | 3500ms | Average time between blinks |
| blinkRandomness | Number | 0.3 | Variation in blink timing |
| showIrisHighlight | Boolean | false | Show highlight reflection on pupil |
| irisHighlightColor | Color | rgba(255,255,255,0.6) | Highlight color |
| enableDizzy | Boolean | true | Enable dizzy easter egg |
| dizzyHoverDelay | Number | 1200ms | How long to hover to trigger dizzy |

## Bugs & Solutions

### 1. Exponential Growth / Zoom Loop

**Problem**: When zooming in/out on the Framer canvas, the component would grow exponentially, eventually crashing the browser.

**Root Cause**: A ResizeObserver was measuring both width and height, and the component was setting its size based on those measurements. This created a feedback loop where:
1. Component renders at size X
2. ResizeObserver detects size X
3. Component re-renders at size X (but with slight rounding differences)
4. ResizeObserver detects the change
5. Loop continues, amplifying with each iteration

**Solution**: Height-driven sizing with one-way data flow:
- Only observe height changes (width is calculated from height)
- Use a 1px threshold to ignore micro-fluctuations
- Width is derived from height based on eye shape aspect ratio, so it never feeds back into the measurement

```typescript
const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const newHeight = entry.contentRect.height
        // Only update if height changed by more than 1px
        if (newHeight > 0 && Math.abs(newHeight - lastHeightRef.current) > 1) {
            lastHeightRef.current = newHeight
            setMeasuredHeight(newHeight)
        }
    }
})
```

### 2. Blink Animation Showing Eye Resize Instead of Eyelids

**Problem**: Early implementations used height-based animation where the eye would shrink vertically during a blink, which looked unnatural.

**Solution**: Two eyelids (top and bottom) that slide in to meet in the middle:
- Eyelids are positioned at top: 0 and bottom: 0
- Use CSS transforms to slide them in/out
- Eyelids extend beyond the eye border (`left: -scaledBorderWidth, right: -scaledBorderWidth`) to ensure full coverage

```typescript
const eyelidBaseStyle: CSSProperties = {
    position: "absolute",
    left: -scaledBorderWidth,
    right: -scaledBorderWidth,
    height: "55%",
    backgroundColor: borderColor,
    transition: `transform ${blinkSpeed * 2}ms ease-in-out`,
    zIndex: 10,
}
```

### 3. Pupils Visible Through Eyelids

**Problem**: During blink animation, the pupils could still be seen through the eyelids due to z-index issues with CSS transforms.

**Solution**: Conditionally render the pupil only when not blinking:

```typescript
{!animState.isBlinking && (
    <div style={pupilStyle}>...</div>
)}
```

This also adds a nice visual effect where the pupil disappears during blink.

### 4. Grey Edge Visible During Blink

**Problem**: A grey/white edge was visible between the eyelids and the eye border during the blink animation.

**Solution**: Change the eye's background color to match the border color during blink:

```typescript
const eyeStyle: CSSProperties = {
    backgroundColor: animState.isBlinking ? borderColor : eyeColor,
    transition: `background-color ${blinkSpeed}ms ease-in-out`,
    // ...
}
```

### 5. Egg Eye Shape Flat on Top

**Problem**: The egg eye shape had the wrong border-radius, appearing flat on top instead of rounded.

**Solution**: Corrected the border-radius values:

```typescript
// Wrong: "40% 40% 50% 50% / 55% 55% 45% 45%"
// Correct:
egg: "50% 50% 50% 50% / 65% 65% 35% 35%" // More rounded on top, flatter on bottom
```

### 6. Component Not Resizable in Framer

**Problem**: Users couldn't resize the component on the Framer canvas - it was locked to "fit".

**Initial Failed Attempts**:
- Reading from `props.style.width/height` - Framer doesn't pass dimensions this way
- Using `useLayoutEffect` to measure - Too slow, visible delay

**Solution**: Use ResizeObserver with height-only tracking:

```typescript
useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const newHeight = entry.contentRect.height
            if (newHeight > 0 && Math.abs(newHeight - lastHeightRef.current) > 1) {
                lastHeightRef.current = newHeight
                setMeasuredHeight(newHeight)
            }
        }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
}, [])
```

Combined with Framer annotations:
```typescript
/**
 * @framerSupportedLayoutWidth fixed   // Width is calculated
 * @framerSupportedLayoutHeight any    // Height is user-adjustable
 */
```

### 7. Framer GitHub Sync Issues

**Problem**: Changes pushed to GitHub weren't appearing in Framer even after syncing.

**Solution**: Delete the component in Framer and re-sync via the GitHub Link Plugin. This forces Framer to pull fresh code rather than using cached versions.

## Architecture Notes

### Height-Driven Sizing

The component uses height as the single source of truth for sizing:

1. Container div fills 100% height of Framer frame
2. ResizeObserver measures container height
3. Eye dimensions are calculated from height based on shape aspect ratios
4. Total width = (2 × eyeWidth) + gap

This one-way data flow prevents the feedback loops that caused the exponential growth bug.

### Eye Shape Aspect Ratios

Each shape has a specific height-to-width ratio:

| Shape | Width Calculation |
|-------|-------------------|
| Round | width = height |
| Egg | width = height × 0.7 |
| Wide | width = height × 2 |
| Almond | width = height ÷ 0.85 |

### Animation State

All animation state is consolidated into a single `animState` object to minimize re-renders:

```typescript
const [animState, setAnimState] = useState({
    leftPupil: { x: 0, y: 0 },
    rightPupil: { x: 0, y: 0 },
    leftEyeOffset: { x: 0, y: 0, rotate: 0 },
    rightEyeOffset: { x: 0, y: 0, rotate: 0 },
    pupilScale: 1,
    isBlinking: false,
    isDizzy: false,
})
```

## File History

- **EyeTrackerV3.tsx** - Current working version with all bugs fixed
- **WatchingYouEyes.tsx** - Original component with bugs (archived)
- **archive/Watching You V2 copy** - Reference file predating the repo
