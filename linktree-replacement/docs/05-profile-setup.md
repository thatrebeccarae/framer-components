# Step 4: Profile Setup

## What We'll Do

Add your profile photo, username, and bio to the page.

## Before We Start

- [ ] Theme selected and background set
- [ ] Profile photo ready (saved on your computer)
- [ ] Username decided
- [ ] Short bio written

## Questions for You

1. **Profile Photo**
   - Where is your photo file?
   - Is it square? (Recommended: 200x200px minimum)

2. **Username**
   - What should it display? (e.g., "@yourhandle" or "Your Name")

3. **Bio**
   - 1-2 sentences max
   - Example: "Designer & Developer" or "Creating things on the internet"

## Instructions

### Option A: Using the LinksHeader Component (Recommended)

#### 1. Add the Code Component

1. In left sidebar, click **Assets** tab
2. Click **"+"** → **"Code Component"**
3. Name it: `LinksHeader`
4. Delete all the default code
5. Copy the entire contents of `components/LinksHeader.tsx`
6. Paste into the editor
7. Press **Cmd+S** (Mac) or **Ctrl+S** (Windows) to save

#### 2. Add to Canvas

1. In Assets, find your new **LinksHeader** component
2. Drag it onto the canvas
3. Position it at the top, centered

#### 3. Configure in Properties Panel

In the right sidebar, you'll see:

| Property | What to Enter |
|----------|--------------|
| Photo | Click to upload your profile photo |
| Photo Size | 48 (or your preference) |
| Username | @yourhandle |
| Bio | Your short bio |
| Alignment | Center |
| Username Color | Use your theme's text color |
| Bio Color | Slightly transparent version of text color |
| Gap | 14 |

### Option B: Using Native Framer Elements

If you prefer not to use code components:

#### 1. Add Profile Image

1. Press **I** or click Image tool
2. Click to place on canvas
3. Upload your photo
4. Set size to 48x48 (or preferred)
5. In properties, set border-radius to 50% for circle

#### 2. Add Username Text

1. Press **T** or click Text tool
2. Click below the image
3. Type your username
4. In properties:
   - Font: Inter (or your choice)
   - Weight: SemiBold (600)
   - Size: 16px
   - Color: Your theme's text color
   - Align: Center

#### 3. Add Bio Text

1. Add another text element below username
2. Type your bio
3. In properties:
   - Font: Inter
   - Weight: Medium (500)
   - Size: 14px
   - Color: Slightly transparent text color
   - Align: Center

#### 4. Group Elements

1. Select all three elements (Shift+Click)
2. Press **Cmd+G** / **Ctrl+G** to group
3. Name the group "Header"
4. Set group to Stack layout:
   - Direction: Vertical
   - Gap: 14px
   - Align: Center

## Checkpoint

- [ ] Profile photo displays correctly
- [ ] Username shows below photo
- [ ] Bio shows below username
- [ ] Everything is centered
- [ ] Colors match your theme

## Preview

Click the **Play** button (▶) in the top-right to preview your page.

## Next Step

**Continue to:** [Adding Links](06-adding-links.md)

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
