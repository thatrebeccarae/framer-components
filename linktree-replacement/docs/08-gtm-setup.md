# Step 7: GTM Setup (Optional - Advanced)

## What We'll Do

Set up Google Tag Manager for advanced tracking scenarios.

**Warning:** GTM has significant limitations on Framer sites. For most users, [GA4 alone](07-ga4-setup.md) is recommended.

## Before We Start

- [ ] Understand the limitations below
- [ ] Have a specific reason for needing GTM
- [ ] GA4 property already created

---

## Critical Limitations on Framer

### What DOESN'T Work

| Feature | Status | Why |
|---------|--------|-----|
| Click URL variable | ❌ Empty | Framer's DOM structure |
| Click Text variable | ❌ Empty | Same issue |
| Click Classes variable | ❌ Empty | Same issue |
| Page View triggers (after initial) | ❌ Doesn't fire | SPA architecture |

### What DOES Work

| Feature | Status | Notes |
|---------|--------|-------|
| History Change triggers | ✅ Works | Use instead of Page View |
| Mailto link detection | ✅ Works | Click URL contains "mailto:" |
| CTA button text matching | ✅ Works | Click Text matches visible button text |
| Custom JavaScript events | ✅ Works | If you add your own code |
| GA4 Configuration tag | ✅ Works | Standard setup |

---

## Why Use GTM Anyway?

Valid reasons:
1. You need to fire tags on specific URL paths
2. You're adding other tools (Facebook Pixel, LinkedIn Insight, etc.)
3. You want centralized tag management across multiple sites
4. You need to integrate with CRM/marketing automation

If you just want page views and click tracking, **use GA4 alone**.

---

## GTM Setup Instructions

### 1. Create GTM Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Click **"Create Account"**
3. Enter:
   - Account name: Your name or company
   - Container name: "Link Page"
   - Target platform: **Web**
4. Accept terms

### 2. Get Container Code

After creating, you'll see two code snippets:
- One for `<head>`
- One for `<body>`

Copy both.

### 3. Add to Framer

1. In Framer, go to **Settings** → **General**
2. Find **Custom Code**
3. Paste the `<head>` snippet in **"End of <head> tag"**
4. Paste the `<body>` snippet in **"Start of <body> tag"**
5. Save

---

## Recommended Tags

### GA4 Configuration (Required)

1. In GTM, go to **Tags** → **New**
2. Tag type: **Google Tag**
3. Tag ID: Your `G-XXXXXXXXXX` Measurement ID
4. Trigger: **All Pages**
5. Save and name it "GA4 - Configuration"

### History Change - Page View

For tracking navigation on your SPA:

1. **Variables** → **Configure** → Enable "Page Path"
2. **Triggers** → **New**:
   - Type: **History Change**
   - Name: "History Change - All"
   - Fires on: All History Changes
3. **Tags** → **New**:
   - Type: **Google Analytics: GA4 Event**
   - Event name: `page_view`
   - Configuration tag: Your GA4 config
   - Trigger: Your History Change trigger
4. Save as "GA4 - Page View - History"

### Facebook Pixel (If Needed)

1. **Tags** → **New**
2. Tag type: **Custom HTML**
3. Paste your Facebook Pixel code
4. Trigger: **All Pages**
5. Save

---

## Publishing GTM Changes

After adding tags:

1. Click **Submit** (top right)
2. Add a version name (e.g., "Initial setup")
3. Click **Publish**

---

## Testing

### GTM Preview Mode

1. Click **Preview** in GTM
2. Enter your site URL
3. A debug window opens
4. Navigate your site and watch tags fire

### Verify History Changes

1. Click between pages on your site
2. In the debug window, look for "History" events
3. Confirm your History Change triggers fire

---

## Checkpoint

- [ ] GTM container created
- [ ] Code added to Framer
- [ ] GA4 Configuration tag added
- [ ] History Change trigger set up (if needed)
- [ ] Changes published
- [ ] Preview mode shows tags firing

---

## Common Issues

### Tags not firing after navigation
- Use History Change triggers, not Page View
- Verify "Page changes based on browser history events" is ON in GA4

### Click tracking not working
- **Don't rely on GTM click variables for Framer**
- Use GA4 Enhanced Measurement for outbound clicks instead

### Duplicate page views
- Check if you have both GTM and direct GA4 code
- Choose one method, not both

---

## Next Step

**Continue to:** [Publishing](09-publishing.md)

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
