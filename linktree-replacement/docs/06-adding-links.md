# Step 5: Adding Links

## What We'll Do

Add your social media icons and link cards.

## Before We Start

- [ ] Profile section complete
- [ ] List of social profiles ready
- [ ] List of links ready

## Part 1: Social Icon Links

### Using SocialIconLinks Component

#### 1. Add the Code Component

1. In left sidebar, click **Assets** tab
2. Click **"+"** → **"Code Component"**
3. Name it: `SocialIconLinks`
4. Delete default code
5. Copy contents of `components/SocialIconLinks.tsx`
6. Paste and save (**Cmd+S** / **Ctrl+S**)

#### 2. Add to Canvas

1. Drag **SocialIconLinks** from Assets onto canvas
2. Position below your profile header

#### 3. Configure Your Socials

In the right sidebar, find the **Links** property:

1. Click to edit the array
2. For each social platform:
   - **Platform:** Select from dropdown (linkedin, instagram, etc.)
   - **URL:** Paste your full profile URL
3. Add/remove links as needed

**Supported Platforms:**
- LinkedIn, Instagram, Pinterest, TikTok
- Spotify, BlueSky, Threads, X (Twitter)
- GitHub, YouTube, Email

#### 4. Style Settings

| Property | Recommended |
|----------|-------------|
| Icon Size | 24px |
| Gap | 15px |
| Icon Color | Your theme's text color |
| Hover Color | Slightly transparent version |

---

## Part 2: Link Cards

### Using LinkCard Component

#### 1. Add the Code Component

1. Create new code component named `LinkCard`
2. Copy contents of `components/LinkCard.tsx`
3. Paste and save

#### 2. Add First Link Card

1. Drag **LinkCard** from Assets onto canvas
2. Position below social icons

#### 3. Configure Link

In properties panel:

| Property | What to Enter |
|----------|---------------|
| Link Name | Title of the link (e.g., "My Portfolio") |
| Description | Optional subtitle |
| URL | Full destination URL |
| Icon | Upload an icon image (optional) |
| Icon Size | 36px |
| Pulse Dot | Toggle for highlight effect |

#### 4. Duplicate for More Links

For each additional link:
1. Select your LinkCard
2. Press **Cmd+D** / **Ctrl+D** to duplicate
3. Move it below the previous card
4. Update the properties

### Card Styling

Match your theme:

| Property | Minimal Dark | Minimal Light |
|----------|-------------|---------------|
| Background | rgba(255,255,255,0.1) | rgba(0,0,0,0.05) |
| Hover BG | rgba(255,255,255,0.2) | rgba(0,0,0,0.1) |
| Text Color | #FFFFFF | #1A1A1A |
| Desc Color | rgba(255,255,255,0.7) | rgba(0,0,0,0.6) |

---

## Part 3: Layout Structure

### Organizing Elements

Create a vertical stack:

1. Select all elements (profile, socials, all cards)
2. Right-click → **Stack** → **Vertical**
   - Or press **Cmd+Shift+G** / **Ctrl+Shift+G**
3. Set stack properties:
   - Gap: 18px
   - Align: Center

### Constraining Width

1. Select your main stack
2. In properties, set:
   - Width: Fixed or Fill
   - Max Width: 480px

### Centering on Page

1. Select your main stack
2. Position: Center horizontally
3. Add padding: 40px top, 20px sides

---

## Checkpoint

- [ ] Social icons display and are clickable
- [ ] Each link card shows correctly
- [ ] Links open in new tabs
- [ ] Hover effects work
- [ ] Everything is properly spaced

## Preview

1. Click **Play** (▶) to preview
2. Test each link
3. Check mobile view (resize window)

## Next Step

**Continue to:** [GA4 Setup](07-ga4-setup.md) (optional)

Or skip to: [Publishing](09-publishing.md)

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
