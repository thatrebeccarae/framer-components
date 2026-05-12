# RollingCardStack Component

A Framer component that displays a stack of interactive cards with drag-to-shuffle and click-to-front behaviors. Supports pagination for large card sets and optional auto-looping. Built with React, TypeScript, Framer Motion, and Framer property controls.

## Features

- **Card Stacking**: Cards stack with configurable vertical offset and scale reduction
- **Drag Interaction**: Drag cards to reshuffle the stack order
- **Click to Front**: Click any card to bring it to the front
- **Pagination**: Navigate through multiple pages of cards with Previous/Next buttons
- **Auto Loop**: Optional automatic cycling through cards at configurable intervals
- **Responsive Scaling**: Cards scale down proportionally on smaller screens
- **Per-Card Styling**: Each card can have custom background color, border radius, and shadow

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enableResponsive | Boolean | true | Enable responsive scaling |
| overflowVisible | Boolean | true | Allow cards to overflow container bounds |
| cards | Array | 3 default cards | Array of card objects with content and styling |
| cardsPerPage | Number | 3 | Number of cards visible in the stack |
| showPagination | Boolean | true | Show pagination controls |
| paginationButtonColor | Color | #000000 | Background color of pagination buttons |
| paginationButtonTextColor | Color | #FFFFFF | Text color of pagination buttons |
| paginationTextColor | Color | #000000 | Color of "Page X of Y" text |
| titleFont | Font | 26px Semibold | Font settings for card titles |
| descriptionFont | Font | 17px Medium | Font settings for card descriptions |
| bulletFont | Font | 13px Medium | Font settings for bullet list items |
| ctaIcon | Enum | arrow | Icon type: arrow, chevron, plus, or none |
| titleColor | Color | #0f0e0e | Color for card titles |
| descriptionColor | Color | #666666 | Color for card descriptions |
| borderRadius | Number | 16px | Global border radius fallback |
| enableLoop | Boolean | false | Enable automatic card cycling |
| loopInterval | Number | 3s | Time between auto-loop cycles |

### Card Object Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| cardNumber | String | "01" | Display number shown on card |
| title | String | "Card Title" | Card heading text |
| description | String | — | Card body text |
| image | ResponsiveImage | — | **Currently unused in render** |
| bulletLists | Object | — | Three columns of bullet items |
| arrowLink | Link | "#" | URL for the arrow link |
| backgroundColor | Color | #FFFFE3 | Card background color |
| borderRadius | Number | 16 | Card corner radius |
| shadowColor | Color | rgba(0,0,0,0.225) | Box shadow color |
| shadowBlur | Number | 20 | Shadow blur radius |
| shadowSpread | Number | 0 | Shadow spread |
| shadowOffsetX | Number | 0 | Horizontal shadow offset |
| shadowOffsetY | Number | 4 | Vertical shadow offset |

## Bugs & Issues

### 1. Card Image Never Rendered

**Status**: Bug (missing feature)

**Problem**: The `Card` interface defines an `image` property with `src` and `alt` fields (lines 20-23), and default cards include image URLs, but the image is never rendered anywhere in the JSX.

**Location**: Interface at line 17-38, never used in render (lines 447-814)

**Solution**: Either render the image within the card layout, or remove the `image` property from the interface and property controls if not needed.

---

### 2. `stackRotation` Prop Defined But Never Used

**Status**: Bug (dead code)

**Problem**: The `stackRotation` prop is destructured from props at line 138 with a default value of 0, but it's never applied to any card styling or motion props.

**Location**: Line 138

**Solution**: Either implement rotation in `getMotionProps()` or remove the prop entirely.

---

### 3. z-index Breaks With More Than 3 Cards

**Status**: Bug

**Problem**: The z-index calculation `const zIndex = 3 - position` (line 385) assumes a maximum of 3 visible cards. When `cardsPerPage > 3`, cards at positions 4+ receive negative or zero z-index values, breaking the visual stacking order.

**Location**: `getCardStyle()` function, line 385

**Solution**:
```typescript
const zIndex = cardsPerPage - position
```

---

### 4. Hardcoded Colors Ignore Props

**Status**: Bug

**Problem**: Several elements use hardcoded `#0f0e0e` instead of the configurable `titleColor` prop:
- Divider line at line 598
- Arrow SVG stroke at lines 791 and 797

**Location**: Lines 598, 791, 797

**Solution**: Replace hardcoded colors with `titleColor` variable.

---

### 5. useEffect Dependency Array Mismatch

**Status**: Potential Bug

**Problem**: The effect at lines 188-192 uses `currentPageIndices` inside but the dependency array is `[currentPage, cardsPerPage, cards.length]`. While `currentPageIndices` is derived from these values, this could cause stale closure issues in edge cases.

**Location**: Lines 188-192

**Solution**: Compute `currentPageIndices` inside the effect or add proper dependencies.

---

### 6. Drag/Click Detection Race Condition

**Status**: Potential Bug

**Problem**: The `isDragging.current` flag is set in `handleDragEnd` and cleared with a 100ms `setTimeout`. The `handleCardClick` function checks this flag. This timing-based approach is fragile—if the click event fires before or after the expected window, it may be incorrectly processed or blocked.

**Location**: Lines 242-258 (handleCardClick), lines 273-278 (isDragging logic)

**Solution**: Consider using a more robust approach, such as tracking total drag distance in a ref and checking it directly in the click handler, or using a state machine for interaction modes.

---

### 7. Missing `stackOffset` Property Control

**Status**: Missing Feature

**Problem**: The `stackOffset` prop exists and is used (line 137, 398), but there's no corresponding property control in `addPropertyControls`. Users cannot configure this value in Framer UI.

**Location**: Not present in `addPropertyControls` (lines 893-1191)

**Solution**: Add property control:
```typescript
stackOffset: {
    type: ControlType.Number,
    title: "Stack Offset",
    defaultValue: -47,
    min: -100,
    max: 100,
    step: 1,
    unit: "px",
},
```

---

### 8. Global vs Per-Card Border Radius Ambiguity

**Status**: Design Issue

**Problem**: There's both a global `borderRadius` prop (line 153) and a per-card `card.borderRadius` property. The code uses `card.borderRadius || borderRadius` (line 467) but the relationship isn't clear to users.

**Location**: Lines 153, 467, 977-985, 1165-1173

**Solution**: Either remove one, rename to clarify relationship (e.g., `defaultBorderRadius`), or add documentation.

---

### 9. Export Name Mismatch

**Status**: Code Quality Issue

**Problem**: The file is named `RollingCardStack.tsx` but exports `function CardStack`. This mismatch can cause confusion when importing.

**Location**: Line 67

**Solution**: Rename the export to match the filename:
```typescript
export default function RollingCardStack(props: CardStackProps)
```

---

### 10. Duplicated Default Card Data

**Status**: Maintainability Issue

**Problem**: The default cards array (3 cards with all properties) is defined identically in two places:
1. Props destructuring (lines 69-136)
2. Property controls defaultValue (lines 1029-1096)

This violates DRY and makes maintenance error-prone.

**Location**: Lines 69-136 and 1029-1096

**Solution**: Extract to a constant:
```typescript
const DEFAULT_CARDS: Card[] = [...]

// Then use in both locations
cards = DEFAULT_CARDS,
// ...
defaultValue: DEFAULT_CARDS,
```

---

## Issues Found During Testing

### T1. Cards Don't Resize With Container

**Status**: Bug (critical UX issue)

**Problem**: Cards have a fixed width of 600px and don't resize to fit within their container. Users cannot add the component to an existing layout and have it adapt to available space.

**Root Cause**: The `cardWidth` constant is hardcoded at 600px (line 165). While responsive scaling reduces the visual size, the actual card width is capped at this value. The component doesn't respect Framer's layout sizing.

**Expected Behavior**: Cards should fill their container width (up to a reasonable max) and adapt to the frame size set by the user in Framer.

**Solution Approach**:
- Remove hardcoded `cardWidth = 600`
- Use container width as the source of truth for card dimensions
- Add `maxCardWidth` property control for users who want to cap the size
- Ensure Framer annotations support flexible width: `@framerSupportedLayoutWidth any`

---

### T2. Card Count Configuration Issues

**Status**: Missing feature / constraint issue

**Problem**:
- No enforced minimum of 3 cards in the stack
- No property control to configure the visible card count
- No maximum limit set for card count

**Expected Behavior**:
- Minimum 3 cards required for proper stack visual
- Property control to set number of visible cards (3-6 range suggested)
- Validation to prevent invalid configurations

**Solution Approach**:
- Add `visibleCardCount` property control with min: 3, max: 6
- Add validation in component to enforce minimums
- Update `cardsPerPage` to work in conjunction with visible count

---

### T3. Click-to-Reorder Not Working

**Status**: Bug (critical interaction issue)

**Problem**: Cards only respond to drag-and-drop for reordering. Clicking a card does NOT bring it to the front as intended. The click handler exists but doesn't fire correctly.

**Root Cause Analysis**:
- `handleCardClick` exists (lines 242-258) but likely being blocked
- The `isDragging.current` check may be incorrectly returning true
- The drag constraints `{ left: 0, right: 0, top: 0, bottom: 0 }` combined with `drag: true` means even tiny movements register as drags
- The 5px threshold for `isDragging` detection (line 273) may be too low

**Expected Behavior**:
- Click on any non-front card should bring it to the front
- Drag gesture (movement > threshold) should shuffle the stack
- Both interactions should work independently

**Solution Approach**:
- Increase drag threshold or use `onTap` from framer-motion instead of `onClick`
- Separate click and drag detection more clearly
- Consider using `dragSnapToOrigin` instead of tight constraints
- Test: remove drag temporarily to verify click handler works in isolation

---

### T4. No Global Background Color Property

**Status**: Missing feature

**Problem**: There's no global property to change the background color of all cards at once. Users must edit each card individually.

**Current State**: Each card has its own `backgroundColor` property, but no global default/override exists.

**Expected Behavior**: A global `cardBackgroundColor` property that applies to all cards, with per-card `backgroundColor` optionally overriding it.

**Solution Approach**:
```typescript
// Add to props
cardBackgroundColor: {
    type: ControlType.Color,
    title: "Card Background",
    defaultValue: "#FFFFE3",
},

// In render, use:
backgroundColor: card.backgroundColor || cardBackgroundColor
```

---

### T5. Responsive Design Inadequate for Mobile

**Status**: Design issue / missing feature

**Problem**: The current "responsive" behavior simply scales everything down uniformly. On narrow screens:
- Text becomes too small to read
- Three-column bullet layout becomes cramped
- Card content doesn't reflow for mobile viewports

**Current Behavior**: Linear scaling where `scale = containerWidth / 600`. At 300px width, everything is 50% size.

**Expected Behavior**: True responsive design with:
- Breakpoint-based layout changes (not just scaling)
- Single-column bullet list layout on mobile
- Minimum readable font sizes
- Adjusted padding and spacing for touch targets

**Solution Approach**:
1. Define breakpoints (e.g., 480px, 768px)
2. At narrow widths:
   - Stack bullet columns vertically instead of 3-column
   - Increase relative font sizes
   - Adjust padding for touch
3. Add `mobileLayout` property to let users choose behavior:
   - "scale" (current behavior)
   - "reflow" (responsive layout changes)
   - "hide" (show only front card on mobile)

---

## Performance Concerns

### Inline Style Objects

Every render creates new style objects in `getCardStyle()` and `getMotionProps()`, which can cause framer-motion to re-evaluate animations unnecessarily.

**Potential Solution**: Memoize style objects using `useMemo` or extract static portions.

### Repeated `getResponsiveFontSize` Calls

The function is called many times during render with identical arguments (e.g., `descriptionFont.fontSize` is calculated ~6 times).

**Potential Solution**: Memoize computed font sizes at the top of the render.

### Excessive `startTransition` Usage

Nearly every state update is wrapped in `startTransition`. While appropriate for some updates, this adds overhead for simple state changes.

---

## Accessibility Issues

1. **No keyboard navigation**: Cards cannot be focused or reordered via keyboard
2. **No ARIA attributes**: Missing `role`, `aria-label`, and screen reader support
3. **`touchAction: "none"`** (line 393): Blocks native scrolling on mobile devices when touching cards

---

## Architecture Notes

### Card Order State

Card display order is managed via `cardOrder` state array, which contains indices into the `cards` array. This allows reordering without mutating the original data.

### Responsive Scaling

When `enableResponsive` is true:
1. Container width is measured via `ResizeObserver`
2. Scale factor = `min(containerWidth, 600) / 600`
3. All dimensions, paddings, and font sizes are multiplied by this scale

### Pagination System

- `totalPages = Math.ceil(cards.length / cardsPerPage)`
- Each page shows a subset of cards
- `cardOrder` is reset when changing pages

---

## Magic Numbers Reference

| Value | Location | Apparent Purpose |
|-------|----------|------------------|
| 600 | Line 165 | Fixed card width in pixels |
| -47 | Line 137 | Default vertical stack offset |
| 370 | Line 428 | Minimum container height base |
| 350 | Line 441 | Card area minimum height base |
| 0.05 | Line 399 | Scale reduction per card position |
| 5.5 | Lines 509-514 | Card number font size divisor |
| 50 | Lines 281, 296 | Drag distance threshold for shuffle |
| 5 | Line 273 | Drag distance threshold for "is dragging" |
| 0.25 | Line 496 | Left padding as fraction of width |

---

## File History

- **RollingCardStack.tsx** - Current version under review
