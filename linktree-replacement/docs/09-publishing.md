# Step 8: Publishing

## What We'll Do

Publish your link page and make it live on the internet.

## Before We Start

- [ ] Design complete (profile, socials, links)
- [ ] Preview tested and working
- [ ] Analytics added (if wanted)

---

## Publishing Options

### Option 1: Free Framer Subdomain

Your site gets a free URL like: `yourname.framer.website`

**Best for:** Getting started quickly, testing

### Option 2: Custom Domain

Connect your own domain like: `links.yoursite.com`

**Best for:** Professional appearance, brand consistency

---

## Option 1: Publish to Framer Subdomain

### 1. Open Publish Panel

1. In your project, click the **"Publish"** button (top right)
2. The publish panel opens

### 2. Choose Your Subdomain

1. In the **"Site Address"** field, enter your preferred name
2. It will become: `yourname.framer.website`
3. If taken, try variations

### 3. Publish

1. Click **"Publish"**
2. Wait for the build to complete (usually under a minute)
3. Your site is live!

### 4. Test Your Site

1. Click the link to open your published site
2. Test all links work
3. Check on mobile device
4. Share the URL!

---

## Option 2: Connect Custom Domain

### Prerequisites

- Own a domain (from Namecheap, GoDaddy, Cloudflare, etc.)
- Access to domain's DNS settings

### 1. Add Domain in Framer

1. Click **"Publish"** → **"Add Domain"**
2. Enter your domain: `links.yoursite.com` or `yoursite.com`
3. Click **"Add"**

### 2. Configure DNS

Framer will show you DNS records to add. Typically:

**For subdomain (recommended):**
- Type: `CNAME`
- Name: `links` (or your subdomain)
- Value: `proxy-ssl.webflow.com` or provided Framer value

**For root domain:**
- Type: `A`
- Name: `@`
- Value: IP address provided by Framer

### 3. Add DNS Records

1. Log into your domain registrar
2. Find DNS settings
3. Add the records Framer specified
4. Save changes

### 4. Wait for Propagation

- DNS changes can take up to 48 hours
- Usually works within 1-2 hours
- Framer will show status: "Pending" → "Active"

### 5. Publish to Custom Domain

Once DNS is verified:
1. Click **"Publish"**
2. Your site is live at your custom domain!

---

## SEO Settings (Optional)

Before publishing, consider these settings:

### 1. Page Title

1. Select your Home page
2. In page settings, find **"Title"**
3. Enter: "Your Name | Links" or similar

### 2. Meta Description

1. In page settings, find **"Description"**
2. Enter a brief description (under 160 characters)
3. Example: "Find all my links, social profiles, and latest projects in one place."

### 3. Social Preview Image

1. In page settings, find **"Social Image"**
2. Upload a 1200x630px image
3. This appears when your link is shared on social media

---

## After Publishing

### Share Your Link

Add your link page URL to:
- Instagram bio
- TikTok bio
- Twitter bio
- LinkedIn about section
- Email signature
- Business cards

### Keep It Updated

To make changes:
1. Edit your project in Framer
2. Click **"Publish"** again
3. Changes go live immediately

---

## Checkpoint

- [ ] Site published successfully
- [ ] All links working
- [ ] Mobile view looks good
- [ ] Analytics receiving data (if configured)
- [ ] URL ready to share

---

## Common Issues

### "Domain not verified"
- DNS changes can take time
- Double-check record values
- Try clearing browser cache

### "Build failed"
- Check for code errors in components
- Try removing recently added components
- Contact Framer support if persistent

### Links not working after publish
- Verify URLs include `https://`
- Check for typos in URLs
- Test in incognito window

---

## Next Step

**Optional:** [Optional Components](10-optional-components.md) - Add fun extras

**Done?** Congratulations! Share your new link page!

---

[← Back to Wizard](01-setup-wizard.md) | [Troubleshooting](troubleshooting.md)
