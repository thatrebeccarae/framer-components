// LinksHeader - Profile section with photo, username, and bio
// For use in Framer link-in-bio pages

import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface LinksHeaderProps {
    /**
     * Profile image URL
     */
    profileImage: string

    /**
     * Size of the profile image in pixels
     * @default 48
     */
    profileSize: number

    /**
     * Username to display (e.g., "@thatrebeccarae")
     */
    username: string

    /**
     * Short bio or tagline
     */
    bio: string

    /**
     * Text alignment
     * @default "center"
     */
    alignment: "left" | "center" | "right"

    /**
     * Username text color
     * @default "#FFFFFF"
     */
    usernameColor: string

    /**
     * Bio text color
     * @default "rgba(255, 255, 255, 0.7)"
     */
    bioColor: string

    /**
     * Gap between elements in pixels
     * @default 14
     */
    gap: number

    style?: CSSProperties
}

/**
 * LinksHeader - Profile Header Component
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 120
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function LinksHeader(props: LinksHeaderProps) {
    const {
        profileImage = "",
        profileSize = 48,
        username = "@username",
        bio = "Your bio here",
        alignment = "center",
        usernameColor = "#FFFFFF",
        bioColor = "rgba(255, 255, 255, 0.7)",
        gap = 14,
        style,
    } = props

    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center",
        gap: gap,
        width: "100%",
        ...style,
    }

    const imageStyle: CSSProperties = {
        width: profileSize,
        height: profileSize,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
    }

    const usernameStyle: CSSProperties = {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 600,
        fontSize: 16,
        color: usernameColor,
        margin: 0,
        textAlign: alignment,
    }

    const bioStyle: CSSProperties = {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 500,
        fontSize: 14,
        color: bioColor,
        margin: 0,
        textAlign: alignment,
    }

    return (
        <div style={containerStyle}>
            {profileImage && (
                <img
                    src={profileImage}
                    alt={username}
                    style={imageStyle}
                />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: alignment }}>
                <p style={usernameStyle}>{username}</p>
                {bio && <p style={bioStyle}>{bio}</p>}
            </div>
        </div>
    )
}

addPropertyControls(LinksHeader, {
    profileImage: {
        type: ControlType.Image,
        title: "Photo",
    },
    profileSize: {
        type: ControlType.Number,
        title: "Photo Size",
        defaultValue: 48,
        min: 24,
        max: 200,
        step: 4,
        unit: "px",
    },
    username: {
        type: ControlType.String,
        title: "Username",
        defaultValue: "@username",
    },
    bio: {
        type: ControlType.String,
        title: "Bio",
        defaultValue: "Your bio here",
    },
    alignment: {
        type: ControlType.Enum,
        title: "Alignment",
        defaultValue: "center",
        options: ["left", "center", "right"],
        optionTitles: ["Left", "Center", "Right"],
    },
    usernameColor: {
        type: ControlType.Color,
        title: "Username Color",
        defaultValue: "#FFFFFF",
    },
    bioColor: {
        type: ControlType.Color,
        title: "Bio Color",
        defaultValue: "rgba(255, 255, 255, 0.7)",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 14,
        min: 0,
        max: 40,
        step: 2,
        unit: "px",
    },
})
