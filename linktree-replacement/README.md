# LinkTree Replacement for Framer

A complete, privacy-first LinkTree alternative built with Framer. Create a beautiful link-in-bio page without subscriptions, data harvesting, or third-party dependencies.

![Preview](assets/preview.png)

## Features

- **100% Private** - No tracking, no analytics (unless you add them), no data sent anywhere
- **Fully Customizable** - Pre-built themes or design your own
- **Claude-Friendly Wizard** - Step-by-step documentation designed for non-technical users working with AI
- **Professional Components** - Profile header, social icons, link cards, and more
- **Optional Analytics** - GA4/GTM integration with Framer-specific SPA workarounds
- **Free Forever** - MIT licensed, no subscriptions required

## Quick Start

### For Non-Technical Users (With Claude)

1. Start a conversation with Claude
2. Share the wizard: "Help me set up my link page using [this guide](docs/01-setup-wizard.md)"
3. Claude will walk you through each step

### For Developers

1. Copy components from `components/` into your Framer project
2. Apply a theme from `themes/` or customize
3. Publish directly from Framer

## Components

| Component | Description |
|-----------|-------------|
| [LinksHeader](components/LinksHeader.tsx) | Profile photo, username, and bio |
| [SocialIconLinks](components/SocialIconLinks.tsx) | Horizontal row of social media icons |
| [LinkCard](components/LinkCard.tsx) | Individual link button with optional icon |
| [LinksContainer](components/LinksContainer.tsx) | Page wrapper with styling |
| [EyeTracker](components/EyeTracker.tsx) | Fun animated eyes (optional) |

## Themes

| Theme | Description |
|-------|-------------|
| [Minimal Dark](themes/minimal-dark.md) | Dark background, clean typography |
| [Minimal Light](themes/minimal-light.md) | Light background, simple design |
| [Gradient Sunset](themes/gradient-sunset.md) | Warm orange-pink gradient |
| [Gradient Ocean](themes/gradient-ocean.md) | Cool blue-teal gradient |
| [Playful Colorful](themes/playful-colorful.md) | Bright, energetic colors |
| [Professional Neutral](themes/professional-neutral.md) | Corporate-friendly muted tones |

## Documentation

The `docs/` folder contains a complete wizard for building your link page:

1. [Overview](docs/00-overview.md) - What you'll build
2. [Setup Wizard](docs/01-setup-wizard.md) - Getting started
3. [Framer Account](docs/02-framer-account.md) - Create your free account
4. [Project Setup](docs/03-project-setup.md) - Create a new project
5. [Theme Selection](docs/04-theme-selection.md) - Choose your style
6. [Profile Setup](docs/05-profile-setup.md) - Add your photo and bio
7. [Adding Links](docs/06-adding-links.md) - Add your links and socials
8. [GA4 Setup](docs/07-ga4-setup.md) - Optional: Add Google Analytics
9. [GTM Setup](docs/08-gtm-setup.md) - Optional: Add Tag Manager
10. [Publishing](docs/09-publishing.md) - Go live
11. [Optional Components](docs/10-optional-components.md) - EyeTracker, etc.
12. [Troubleshooting](docs/troubleshooting.md) - Common issues

## Privacy Commitment

See [PRIVACY.md](PRIVACY.md) for our full privacy commitment. In short:

- No data collection by this package
- No cookies (unless you add analytics)
- No third-party services required
- Your content stays on your Framer account
- Analytics are 100% opt-in

## Examples

- [Rebecca Rae Style](examples/rebecca-rae-style.md) - Dark theme with social icons
- [Creator Portfolio](examples/creator-portfolio.md) - Content creator layout
- [Business Card](examples/business-card.md) - Professional contact page

## Requirements

- [Framer](https://framer.com) account (free tier works)
- Custom domain (optional, Framer provides free subdomain)

## Installation

See the [Setup Wizard](docs/01-setup-wizard.md) for detailed instructions, or:

1. In Framer, create a new Code Component for each component
2. Copy the code from `components/*.tsx`
3. Drag components onto your canvas
4. Customize in the properties panel

## Analytics (Optional)

Framer sites are Single Page Applications (SPA), which requires special handling for analytics. The GA4/GTM docs include:

- History Change triggers for page navigation
- Enhanced Measurement for outbound clicks
- Known Framer analytics limitations

## License

MIT License - see [LICENSE](LICENSE)

## Author

[Rebecca Rae Barton](https://rebeccaraebarton.com)

---

**Questions?** [Open an issue](../../issues) | **Live demo:** [rebeccaraebarton.com/links](https://rebeccaraebarton.com/links)
