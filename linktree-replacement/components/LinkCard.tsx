// LinkCard - Individual link button with optional icon and pulse dot
// For use in Framer link-in-bio pages

import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface LinkCardProps {
    /**
     * Primary link text
     */
    linkName: string

    /**
     * Optional secondary description
     */
    description: string

    /**
     * Destination URL
     */
    url: string

    /**
     * Optional icon image URL
     */
    iconImage: string

    /**
     * Icon size in pixels
     * @default 36
     */
    iconSize: number

    /**
     * Show animated pulse dot indicator
     * @default false
     */
    showPulseDot: boolean

    /**
     * Pulse dot color
     * @default "rgb(255, 85, 136)"
     */
    pulseDotColor: string

    /**
     * Card background color
     * @default "rgba(15, 14, 14, 0.1)"
     */
    backgroundColor: string

    /**
     * Card background color on hover
     * @default "rgba(15, 14, 14, 0.5)"
     */
    hoverBackgroundColor: string

    /**
     * Primary text color
     * @default "#FFFFFF"
     */
    textColor: string

    /**
     * Description text color
     * @default "rgba(255, 255, 255, 0.7)"
     */
    descriptionColor: string

    /**
     * Card border radius in pixels
     * @default 12
     */
    borderRadius: number

    /**
     * Card padding in pixels
     * @default 16
     */
    padding: number

    /**
     * Open link in new tab
     * @default true
     */
    openInNewTab: boolean

    style?: CSSProperties
}

/**
 * LinkCard - Link Button Component
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 68
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function LinkCard(props: LinkCardProps) {
    const {
        linkName = "Link Name",
        description = "",
        url = "#",
        iconImage = "",
        iconSize = 36,
        showPulseDot = false,
        pulseDotColor = "rgb(255, 85, 136)",
        backgroundColor = "rgba(15, 14, 14, 0.1)",
        hoverBackgroundColor = "rgba(15, 14, 14, 0.5)",
        textColor = "#FFFFFF",
        descriptionColor = "rgba(255, 255, 255, 0.7)",
        borderRadius = 12,
        padding = 16,
        openInNewTab = true,
        style,
    } = props

    const [isHovered, setIsHovered] = useState(false)

    const cardStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: padding,
        borderRadius: borderRadius,
        backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
        textDecoration: "none",
        transition: "background-color 0.2s ease, transform 0.2s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        cursor: "pointer",
        width: "100%",
        boxSizing: "border-box",
        ...style,
    }

    const iconContainerStyle: CSSProperties = {
        position: "relative",
        width: iconSize,
        height: iconSize,
        flexShrink: 0,
    }

    const iconStyle: CSSProperties = {
        width: iconSize,
        height: iconSize,
        borderRadius: "50%",
        objectFit: "cover",
    }

    const pulseDotStyle: CSSProperties = {
        position: "absolute",
        top: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: pulseDotColor,
        animation: "pulse 2s infinite",
    }

    const textContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
        minWidth: 0,
    }

    const nameStyle: CSSProperties = {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        color: textColor,
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }

    const descriptionStyle: CSSProperties = {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 500,
        fontSize: 13,
        color: descriptionColor,
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }

    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            box-shadow: 0 0 0 0 ${pulseDotColor}80;
                        }
                        70% {
                            box-shadow: 0 0 0 8px ${pulseDotColor}00;
                        }
                        100% {
                            box-shadow: 0 0 0 0 ${pulseDotColor}00;
                        }
                    }
                `}
            </style>
            <a
                href={url}
                target={openInNewTab ? "_blank" : "_self"}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {iconImage && (
                    <div style={iconContainerStyle}>
                        <img src={iconImage} alt="" style={iconStyle} />
                        {showPulseDot && <div style={pulseDotStyle} />}
                    </div>
                )}
                <div style={textContainerStyle}>
                    <p style={nameStyle}>{linkName}</p>
                    {description && <p style={descriptionStyle}>{description}</p>}
                </div>
            </a>
        </>
    )
}

addPropertyControls(LinkCard, {
    linkName: {
        type: ControlType.String,
        title: "Link Name",
        defaultValue: "Link Name",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue: "",
    },
    url: {
        type: ControlType.String,
        title: "URL",
        defaultValue: "#",
    },
    iconImage: {
        type: ControlType.Image,
        title: "Icon",
    },
    iconSize: {
        type: ControlType.Number,
        title: "Icon Size",
        defaultValue: 36,
        min: 20,
        max: 80,
        step: 2,
        unit: "px",
    },
    showPulseDot: {
        type: ControlType.Boolean,
        title: "Pulse Dot",
        defaultValue: false,
    },
    pulseDotColor: {
        type: ControlType.Color,
        title: "Dot Color",
        defaultValue: "rgb(255, 85, 136)",
        hidden: (props) => !props.showPulseDot,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "rgba(15, 14, 14, 0.1)",
    },
    hoverBackgroundColor: {
        type: ControlType.Color,
        title: "Hover BG",
        defaultValue: "rgba(15, 14, 14, 0.5)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#FFFFFF",
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Desc Color",
        defaultValue: "rgba(255, 255, 255, 0.7)",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
        unit: "px",
    },
    padding: {
        type: ControlType.Number,
        title: "Padding",
        defaultValue: 16,
        min: 8,
        max: 32,
        step: 2,
        unit: "px",
    },
    openInNewTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: true,
    },
})
