# Troubleshooting

Common issues and their solutions.

## Code Component Issues

### "Cannot create code component"

**Symptoms:** Error when trying to add a code component

**Solutions:**
1. Make sure you're logged into Framer
2. Check your project isn't in view-only mode
3. Try refreshing the page
4. Try a different browser

### "Component not showing on canvas"

**Symptoms:** Dragged component but nothing appears

**Solutions:**
1. Check the component has a visible size (not 0x0)
2. Look for it in the layers panel (left sidebar)
3. It might be positioned off-screen
4. Check the component code for errors

### "Component shows error"

**Symptoms:** Red error message in component

**Solutions:**
1. Open the code component and check for errors
2. Ensure all code was copied correctly
3. Look for missing closing brackets or quotes
4. Save the component (**Cmd+S** / **Ctrl+S**)

### "Cannot delete code component"

**Symptoms:** "In use" error when deleting

**Solutions (The Folder Trick):**
1. Create a new folder in Assets
2. Drag the component into the folder
3. Delete the entire folder

---

## Visual Issues

### "Colors look wrong"

**Solutions:**
1. Verify you're using the correct color format (hex, rgb, rgba)
2. Check opacity values (0-1 vs 0-100)
3. Preview in the published site, not just editor

### "Layout looks different on mobile"

**Solutions:**
1. Use responsive settings in Framer
2. Test at different breakpoints
3. Use percentage-based widths instead of fixed pixels
4. Check that max-width is set on container

### "Text is too small/large"

**Solutions:**
1. Adjust font size in component properties
2. Use relative units where possible
3. Test at different screen sizes

---

## Link Issues

### "Links not clickable"

**Symptoms:** Clicking links does nothing

**Solutions:**
1. Verify the URL is correct and complete
2. URLs must include `https://` or `http://`
3. Check there's no overlapping transparent element
4. Test in preview mode, not just editor

### "Links open in same tab"

**Solutions:**
1. Check "Open in new tab" property is enabled
2. Verify `target="_blank"` is in the code
3. Social links should open in new tabs by default

### "Social icon missing"

**Symptoms:** Platform icon doesn't appear

**Solutions:**
1. Ensure you spelled the platform name correctly
2. Check the platform is in our supported list
3. Verify the URL is not empty

**Supported platforms:**
- linkedin, instagram, pinterest, tiktok
- spotify, bluesky, threads, x
- github, youtube, email

---

## Analytics Issues

### "No data in GA4"

**Solutions:**
1. Verify Measurement ID starts with `G-`
2. Check code is in `<head>`, not `<body>`
3. Wait 24-48 hours for data to appear
4. Use Realtime report for immediate verification
5. Check browser isn't blocking scripts (ad blockers)

### "Page views not tracking between pages"

**Solutions:**
1. Enable "Page changes based on browser history events" in GA4
2. If using GTM, use History Change triggers (not Page View)
3. This is a Framer SPA limitation - see [GA4 Setup](07-ga4-setup.md)

### "Click tracking not working in GTM"

**This is expected behavior.** Framer sites don't expose click data to GTM variables.

**Use instead:**
- GA4 Enhanced Measurement for outbound clicks
- Don't rely on GTM click variables

---

## Publishing Issues

### "Build failed"

**Solutions:**
1. Check all code components for syntax errors
2. Remove recently added components and try again
3. Check the error message for specifics
4. Contact Framer support if persistent

### "Domain not verified"

**Solutions:**
1. DNS propagation can take up to 48 hours
2. Double-check DNS record values
3. Ensure you added records to the right domain
4. Try different DNS record types (CNAME vs A)
5. Clear browser cache and try again

### "Site not loading"

**Solutions:**
1. Check your internet connection
2. Try in incognito window
3. Clear browser cache
4. Check Framer status page for outages

---

## Framer-Specific Known Issues

### ResizeObserver infinite loop

**Symptoms:** Browser crashes or slows when zooming canvas

**Solution:** Our components use height-only observation with threshold to prevent this. If you modify component code, be careful with ResizeObserver implementations.

### Cannot change text style type

**Issue:** Cannot convert H1 to H2 after creation

**Workaround:** Create a new text style with the correct tag and update instances manually.

### Text style breakpoint sizes don't copy

**Issue:** Duplicating text styles loses breakpoint-specific sizes

**Workaround:** Document sizes before duplicating and re-enter manually.

---

## Still Stuck?

### 1. Check Documentation
- Re-read the relevant wizard step
- Check the component's code comments
- Review theme configuration

### 2. Ask Claude
If you're working with Claude:
> "I'm having an issue with [describe problem]. I've tried [what you tried]. The error says [error message if any]."

### 3. Search Framer Community
- [community.framer.com](https://community.framer.com)
- Many common issues already have solutions

### 4. Report Issue
If it's a bug in our components:
- [Open an issue](../../issues)
- Include: what happened, what you expected, steps to reproduce

---

[← Back to Wizard](01-setup-wizard.md) | [Overview](00-overview.md)
