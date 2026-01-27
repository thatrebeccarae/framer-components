# Step 6: GA4 Setup (Optional)

## What We'll Do

Add Google Analytics 4 to track page views and outbound clicks.

**This is completely optional.** Skip to [Publishing](09-publishing.md) if you don't need analytics.

## Before We Start

- [ ] Google account
- [ ] Link page design complete

## Important: Framer SPA Limitations

Framer sites are **Single Page Applications (SPA)**. This affects how analytics work:

| What Works | What Doesn't Work |
|------------|-------------------|
| Initial page view | GTM click variables (Click URL, Click Text) |
| History Change events | Page View triggers for navigation |
| Enhanced Measurement outbound clicks | Custom click tracking |

**Bottom line:** Use GA4's built-in Enhanced Measurement. Don't try to build complex GTM click tracking - it won't work reliably on Framer.

---

## Option A: GA4 Only (Recommended for Most Users)

### 1. Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** (gear icon)
3. Click **"+ Create Property"**
4. Enter:
   - Property name: "Link Page" (or your preference)
   - Timezone: Your timezone
   - Currency: Your currency
5. Click **Next**
6. Select your business type
7. Click **Create**

### 2. Create Web Data Stream

1. Under your new property, click **Data Streams**
2. Click **Web**
3. Enter:
   - Website URL: Your Framer URL (e.g., `yoursite.framer.website`)
   - Stream name: "Link Page"
4. Click **Create Stream**

### 3. Get Your Measurement ID

After creating the stream, you'll see:
- **Measurement ID:** Starts with `G-` (e.g., `G-ABC123XYZ`)
- Copy this ID

### 4. Configure Enhanced Measurement

Still in the data stream settings:

1. Click **Enhanced measurement** section
2. Make sure these are **ON**:
   - [x] Page views
   - [x] Outbound clicks ← This tracks your link clicks!
   - [x] Site search (optional)
   - [x] Scroll (optional)
3. Click the gear icon next to "Page views"
4. Enable: **"Page changes based on browser history events"**
   - ⚠️ **Critical for Framer** - enables SPA tracking

### 5. Add GA4 to Framer

1. In Framer, click your project name → **Settings**
2. Go to **General** tab
3. Find **"Custom Code"** section
4. In **"End of <head> tag"**, paste:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

5. Replace `G-XXXXXXXXXX` with your actual Measurement ID
6. Click **Save**

---

## Viewing Your Data

### Realtime Report
1. In GA4, go to **Reports** → **Realtime**
2. Visit your published site
3. You should appear as an active user

### Outbound Clicks Report
1. Go to **Reports** → **Engagement** → **Events**
2. Look for `click` events
3. Or create an Exploration:
   - Dimensions: Link URL, Link domain, Outbound
   - Metrics: Event count
   - Filter: Outbound exactly matches "true"

---

## Checkpoint

- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] Enhanced Measurement enabled (including history events)
- [ ] Code added to Framer
- [ ] Realtime shows your visit

---

## Common Issues

### Not seeing any data
- Wait up to 24 hours for data to appear in standard reports
- Check Realtime for immediate verification
- Verify the Measurement ID is correct
- Check for JavaScript errors in browser console

### Outbound clicks not tracking
- Ensure "Outbound clicks" is enabled in Enhanced Measurement
- Only external links are tracked (not internal navigation)
- View in Reports → Engagement → Events → click

---

## Next Step

**Continue to:** [GTM Setup](08-gtm-setup.md) (optional advanced)

Or skip to: [Publishing](09-publishing.md)

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
