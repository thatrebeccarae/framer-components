# Business Card Example

A professional digital business card for consultants, freelancers, and business professionals.

## Preview

Features:
- Professional neutral theme
- Compact, focused layout
- Essential contact methods
- vCard download option
- Clean, corporate-friendly design

## Page Structure

```
LinksContainer (light gray background)
├── LinksHeader
│   ├── Professional Headshot (64x64)
│   ├── Full Name
│   └── Title & Company
├── SocialIconLinks (professional only)
├── LinkCard - Email (primary CTA)
├── LinkCard - Schedule Meeting
├── LinkCard - LinkedIn Profile
├── LinkCard - Company Website
├── LinkCard - Download vCard
└── [Optional: Portfolio/Resume]
```

## Configuration

### LinksContainer
```
maxWidth: 440
backgroundColor: "#F5F5F5"
paddingVertical: 48
paddingHorizontal: 24
gap: 14
fullHeight: true
```

### LinksHeader
```
profileImage: [professional-headshot.jpg]
profileSize: 64
username: "Jane Smith"
bio: "Senior Consultant | ABC Consulting"
alignment: "center"
usernameColor: "#2C3E50"
bioColor: "rgba(44, 62, 80, 0.7)"
gap: 10
```

### SocialIconLinks
```
links: [
  { platform: "linkedin", url: "https://linkedin.com/in/janesmith" },
  { platform: "email", url: "mailto:jane@company.com" },
  { platform: "x", url: "https://x.com/janesmith" }
]
iconSize: 22
gap: 16
iconColor: "#2C3E50"
hoverColor: "#3498DB"
```

### LinkCard - Email (Primary)
```
linkName: "Email Me"
description: "jane@company.com"
url: "mailto:jane@company.com"
iconImage: [email-icon.png]
iconSize: 32
showPulseDot: false
backgroundColor: "#FFFFFF"
hoverBackgroundColor: "#FAFAFA"
textColor: "#2C3E50"
descriptionColor: "rgba(44, 62, 80, 0.65)"
borderRadius: 8
padding: 14
```

### LinkCard - Schedule Meeting
```
linkName: "Schedule a Call"
description: "30-min consultation"
url: "https://calendly.com/janesmith"
iconImage: [calendar-icon.png]
showPulseDot: true
pulseDotColor: "#3498DB"
// ...rest same styling
```

### LinkCard - Company Website
```
linkName: "ABC Consulting"
description: "Learn about our services"
url: "https://abcconsulting.com"
iconImage: [company-logo.png]
// ...rest same styling
```

### LinkCard - vCard Download
```
linkName: "Save Contact"
description: "Download vCard"
url: "https://yoursite.com/janesmith.vcf"
iconImage: [contact-icon.png]
// ...rest same styling
```

## Key Information to Include

### Essential
| Link | Purpose |
|------|---------|
| Email | Direct contact |
| LinkedIn | Professional profile |
| Calendar | Book meetings |

### Recommended
| Link | Purpose |
|------|---------|
| Company Website | About your work |
| Phone | For urgent matters |
| vCard | Easy contact saving |

### Optional
| Link | Purpose |
|------|---------|
| Portfolio | Show your work |
| Resume/CV | For recruiters |
| Blog/Newsletter | Thought leadership |

## Color Scheme

### Professional Neutral
| Element | Color |
|---------|-------|
| Background | `#F5F5F5` |
| Card | `#FFFFFF` |
| Text | `#2C3E50` |
| Accent | `#3498DB` |
| Border | `#E5E5E5` |

### Alternative: Corporate Blue
| Element | Color |
|---------|-------|
| Background | `#F0F4F8` |
| Card | `#FFFFFF` |
| Text | `#1A365D` |
| Accent | `#2B6CB0` |
| Border | `#CBD5E0` |

## Creating a vCard

To offer vCard download:

1. Create a `.vcf` file with your contact info:
```
BEGIN:VCARD
VERSION:3.0
FN:Jane Smith
ORG:ABC Consulting
TITLE:Senior Consultant
TEL:+1-555-123-4567
EMAIL:jane@company.com
URL:https://linkedin.com/in/janesmith
END:VCARD
```

2. Host the file (on your website or cloud storage)
3. Link to it from the "Save Contact" card

## QR Code Integration

For physical business cards:
1. Generate QR code pointing to your link page
2. Print on business cards
3. Visitors scan to access all your links

## Pro Tips

### Keep It Professional
- Use a high-quality headshot (not casual selfie)
- Match colors to your company brand if applicable
- Avoid too many links (5-7 max)

### Prioritize by Use Case
1. Most-used contact method first
2. Meeting scheduling second
3. Professional profiles third
4. Supporting info last

### Update Regularly
- Keep job title current
- Update if you change companies
- Remove outdated links

## Use Cases

- Networking events
- Conference badge QR codes
- Email signatures
- LinkedIn featured section
- Resume supplementary link
