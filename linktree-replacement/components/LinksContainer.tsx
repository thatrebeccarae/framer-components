// LinksContainer - Page wrapper with centered layout and styling
// For use in Framer link-in-bio pages

import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties, ReactNode } from "react"

interface LinksContainerProps {
    /**
     * Child components (header, social icons, link cards)
     */
    children?: ReactNode

    /**
     * Maximum width of the container in pixels
     * @default 480
     */
    maxWidth: number

    /**
     * Background color
     * @default "rgb(15, 14, 14)"
     */
    backgroundColor: string

    /**
     * Container border radius in pixels
     * @default 16
     */
    borderRadius: number

    /**
     * Vertical padding in pixels
     * @default 40
     */
    paddingVertical: number

    /**
     * Horizontal padding in pixels
     * @default 20
     */
    paddingHorizontal: number

    /**
     * Gap between child elements in pixels
     * @default 18
     */
    gap: number

    /**
     * Minimum height (100vh for full page)
     * @default true
     */
    fullHeight: boolean

    style?: CSSProperties
}

/**
 * LinksContainer - Page Wrapper Component
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 480
 * @framerIntrinsicHeight 600
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function LinksContainer(props: LinksContainerProps) {
    const {
        children,
        maxWidth = 480,
        backgroundColor = "rgb(15, 14, 14)",
        borderRadius = 16,
        paddingVertical = 40,
        paddingHorizontal = 20,
        gap = 18,
        fullHeight = true,
        style,
    } = props

    const outerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: fullHeight ? "100vh" : "auto",
        backgroundColor: backgroundColor,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        boxSizing: "border-box",
        ...style,
    }

    const innerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: gap,
        width: "100%",
        maxWidth: maxWidth,
    }

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                {children}
            </div>
        </div>
    )
}

addPropertyControls(LinksContainer, {
    children: {
        type: ControlType.ComponentInstance,
        title: "Content",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 480,
        min: 280,
        max: 800,
        step: 10,
        unit: "px",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "rgb(15, 14, 14)",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 16,
        min: 0,
        max: 40,
        step: 2,
        unit: "px",
    },
    paddingVertical: {
        type: ControlType.Number,
        title: "Padding V",
        defaultValue: 40,
        min: 0,
        max: 80,
        step: 4,
        unit: "px",
    },
    paddingHorizontal: {
        type: ControlType.Number,
        title: "Padding H",
        defaultValue: 20,
        min: 0,
        max: 60,
        step: 4,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 18,
        min: 0,
        max: 40,
        step: 2,
        unit: "px",
    },
    fullHeight: {
        type: ControlType.Boolean,
        title: "Full Height",
        defaultValue: true,
    },
})
