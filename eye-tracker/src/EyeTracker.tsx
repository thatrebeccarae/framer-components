// EyeTracker - Cartoon eyes that follow cursor, blink, and have dizzy easter egg
// Height-driven sizing with ResizeObserver (height-only, with threshold to prevent loops)

import { useEffect, useState, useRef, useMemo, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Eye shape border radius presets - module-scoped to prevent recreation on every render
 */
const EYE_SHAPE_STYLES: Record<string, string> = {
    almond: "50% 50% 50% 50% / 55% 55% 45% 45%",
    round: "50%",
    wide: "50% 50% 50% 50% / 45% 45% 55% 55%",
    egg: "50% 50% 50% 50% / 65% 65% 35% 35%",
} as const

interface EyeTrackerProps {
    /**
     * Background color of the eye sclera
     * @default "#FFFFFF"
     */
    eyeColor: string

    /**
     * Color of the pupil/iris
     * @default "#000000"
     */
    pupilColor: string

    /**
     * Color of the eye border and eyelids
     * @default "#000000"
     */
    borderColor: string

    /**
     * Gap between the two eyes as a proportion of eye size
     * @default 0.15
     * @min 0
     * @max 0.5
     */
    eyeGap: number

    /**
     * Base height of each eye in pixels (used when container height is not measured)
     * @default 80
     * @min 20
     * @max 400
     */
    eyeSize: number

    /**
     * Duration of the blink animation in milliseconds
     * @default 150
     * @min 50
     * @max 500
     */
    blinkSpeed: number

    /**
     * Average interval between blinks in milliseconds
     * @default 3500
     * @min 1500
     * @max 10000
     */
    blinkFrequency: number

    /**
     * Randomness factor for blink timing (0 = exact interval, 0.5 = ±50% variation)
     * @default 0.3
     * @min 0
     * @max 0.5
     */
    blinkRandomness: number

    /**
     * Pupil size as a proportion of the smaller eye dimension
     * @default 0.4
     * @min 0.2
     * @max 0.6
     */
    pupilSize: number

    /**
     * Border width as a proportion of the smaller eye dimension
     * @default 0.05
     * @min 0
     * @max 0.15
     */
    borderWidth: number

    /**
     * Pupil tracking transition speed in seconds
     * @default 0.1
     * @min 0.01
     * @max 0.5
     */
    trackingSpeed: number

    /**
     * Shape preset for the eyes
     * @default "almond"
     */
    eyeShape: "almond" | "round" | "wide" | "egg"

    /**
     * Whether to show a highlight reflection on the pupil
     * @default false
     */
    showIrisHighlight: boolean

    /**
     * Color of the iris highlight reflection
     * @default "rgba(255, 255, 255, 0.6)"
     */
    irisHighlightColor: string

    /**
     * Whether the dizzy easter egg is enabled (triggered by hovering between eyes)
     * @default true
     */
    enableDizzy: boolean

    /**
     * Time in milliseconds to hover between eyes before triggering dizzy animation
     * @default 1200
     * @min 500
     * @max 3000
     */
    dizzyHoverDelay: number

    style?: CSSProperties
}

/**
 * EyeTracker - Animated Eye Tracker
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 188
 * @framerIntrinsicHeight 80
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */
export default function EyeTracker(props: EyeTrackerProps) {
    const {
        eyeColor = "#FFFFFF",
        pupilColor = "#000000",
        borderColor = "#000000",
        eyeGap = 0.15,
        eyeSize = 80,
        blinkSpeed = 150,
        blinkFrequency = 3500,
        blinkRandomness = 0.3,
        pupilSize = 0.4,
        borderWidth = 0.05,
        trackingSpeed = 0.1,
        eyeShape = "almond",
        showIrisHighlight = false,
        irisHighlightColor = "rgba(255, 255, 255, 0.6)",
        enableDizzy = true,
        dizzyHoverDelay = 1200,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const leftEyeRef = useRef<HTMLDivElement>(null)
    const rightEyeRef = useRef<HTMLDivElement>(null)
    const hoverTimerRef = useRef<number | null>(null)
    const dizzyAnimationRef = useRef<number | null>(null)
    const blinkTimeoutRef = useRef<number | null>(null)
    const blinkCloseTimeoutRef = useRef<number | null>(null)
    const initialBlinkRef = useRef(false)

    // Ref to track prefers-reduced-motion
    const prefersReducedMotionRef = useRef(false)

    // Ref to avoid stale closure in pointer handler
    const isDizzyRef = useRef(false)

    // Measured container height for responsive sizing
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)

    // Split animation state into separate atoms for targeted re-renders
    const [isBlinking, setIsBlinking] = useState(false)
    const [isDizzy, setIsDizzy] = useState(false)
    const [pupilPositions, setPupilPositions] = useState({
        left: { x: 0, y: 0 },
        right: { x: 0, y: 0 },
        scale: 1,
    })
    const [eyeOffsets, setEyeOffsets] = useState({
        left: { x: 0, y: 0, rotate: 0 },
        right: { x: 0, y: 0, rotate: 0 },
    })

    // Keep isDizzyRef in sync with isDizzy state
    useEffect(() => {
        isDizzyRef.current = isDizzy
    }, [isDizzy])

    // Detect prefers-reduced-motion
    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        prefersReducedMotionRef.current = mediaQuery.matches

        const handleChange = (e: MediaQueryListEvent) => {
            prefersReducedMotionRef.current = e.matches
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    // Use ResizeObserver to respond quickly to container height changes
    // Only tracks height (not width) with a threshold to prevent feedback loops
    useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current) return

        const lastHeightRef = { current: 0 }

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height
                // Only update if height changed by more than 1px (prevents micro-fluctuations)
                if (newHeight > 0 && Math.abs(newHeight - lastHeightRef.current) > 1) {
                    lastHeightRef.current = newHeight
                    setMeasuredHeight(newHeight)
                }
            }
        })

        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    // Height-driven sizing: use measured container height, otherwise eyeSize prop
    const baseHeight = measuredHeight || eyeSize

    // Memoized eye dimensions based on shape
    const { eyeWidth, eyeHeight } = useMemo(() => {
        switch (eyeShape) {
            case "round":
                return { eyeWidth: baseHeight, eyeHeight: baseHeight }
            case "egg":
                return { eyeWidth: baseHeight * 0.7, eyeHeight: baseHeight }
            case "wide":
                return { eyeWidth: baseHeight * 2, eyeHeight: baseHeight }
            case "almond":
            default:
                return { eyeWidth: baseHeight / 0.85, eyeHeight: baseHeight }
        }
    }, [eyeShape, baseHeight])

    const gapPx = Math.min(eyeWidth, eyeHeight) * eyeGap
    const pupilDimension = Math.min(eyeWidth, eyeHeight) * pupilSize
    const scaledBorderWidth = Math.max(1, Math.round(Math.min(eyeWidth, eyeHeight) * borderWidth))

    // Pointer tracking (unified mouse/touch/pen support)
    useEffect(() => {
        if (typeof window === "undefined") return

        const handlePointerMove = (e: PointerEvent) => {
            if (!leftEyeRef.current || !rightEyeRef.current || isDizzyRef.current) return

            const leftRect = leftEyeRef.current.getBoundingClientRect()
            const rightRect = rightEyeRef.current.getBoundingClientRect()

            const leftCenter = {
                x: leftRect.left + leftRect.width / 2,
                y: leftRect.top + leftRect.height / 2,
            }
            const rightCenter = {
                x: rightRect.left + rightRect.width / 2,
                y: rightRect.top + rightRect.height / 2,
            }

            // Dizzy easter egg detection
            if (enableDizzy) {
                const gapStart = leftRect.right
                const gapEnd = rightRect.left
                const minWidth = Math.max(gapEnd - gapStart, leftRect.width * 0.3)
                const padding = (minWidth - (gapEnd - gapStart)) / 2
                const isInGap =
                    e.clientX >= gapStart - padding &&
                    e.clientX <= gapEnd + padding &&
                    e.clientY >= Math.min(leftRect.top, rightRect.top) &&
                    e.clientY <= Math.max(leftRect.bottom, rightRect.bottom)

                if (isInGap) {
                    if (!hoverTimerRef.current) {
                        hoverTimerRef.current = window.setTimeout(() => {
                            setIsDizzy(true)
                        }, dizzyHoverDelay)
                    }
                } else if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current)
                    hoverTimerRef.current = null
                }
            }

            const calcPupil = (center: { x: number; y: number }) => {
                const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x)
                const maxDist = Math.min(eyeWidth, eyeHeight) * 0.3
                return { x: Math.cos(angle) * maxDist, y: Math.sin(angle) * maxDist }
            }

            setPupilPositions((prev) => ({
                ...prev,
                left: calcPupil(leftCenter),
                right: calcPupil(rightCenter),
            }))
        }

        window.addEventListener("pointermove", handlePointerMove)
        return () => {
            window.removeEventListener("pointermove", handlePointerMove)
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
        }
    }, [enableDizzy, dizzyHoverDelay, eyeWidth, eyeHeight])

    // Dizzy animation
    useEffect(() => {
        if (!isDizzy || typeof window === "undefined") return

        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }

        // For reduced motion: skip animation and just set final state
        if (prefersReducedMotionRef.current) {
            setPupilPositions({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 }, scale: 1 })
            setEyeOffsets({
                left: { x: 0, y: 0, rotate: 0 },
                right: { x: 0, y: 0, rotate: 0 },
            })
            setIsDizzy(false)
            return
        }

        let startTime: number | null = null
        const bounceDur = 800,
            recenterDur = 400,
            totalDur = bounceDur + recenterDur
        const radius = Math.min(eyeWidth, eyeHeight) * 0.3

        const animate = (ts: number) => {
            if (!startTime) startTime = ts
            const elapsed = ts - startTime
            const progress = Math.min(elapsed / totalDur, 1)
            const p1 = Math.min(elapsed / bounceDur, 1)
            const p2 = Math.max(0, (elapsed - bounceDur) / recenterDur)

            const angle = p1 * Math.PI * 8
            const r = radius * (1 - p1)
            const leftX = Math.cos(angle) * r,
                leftY = Math.sin(angle) * r
            const rightX = Math.cos(-angle) * r,
                rightY = Math.sin(-angle) * r
            const scale = 1 + Math.sin(p1 * Math.PI) * 0.5
            const bounce = Math.min(eyeWidth, eyeHeight) * 0.15

            setPupilPositions({
                left: { x: p1 < 1 ? leftX : leftX * (1 - p2), y: p1 < 1 ? leftY : leftY * (1 - p2) },
                right: { x: p1 < 1 ? rightX : rightX * (1 - p2), y: p1 < 1 ? rightY : rightY * (1 - p2) },
                scale: p1 < 1 ? scale : 1 + (scale - 1) * (1 - p2),
            })

            setEyeOffsets({
                left: {
                    x: Math.cos(p1 * Math.PI * 5) * bounce * 0.5 * (1 - p1),
                    y: Math.sin(p1 * Math.PI * 6) * bounce * (1 - p1),
                    rotate: Math.sin(p1 * Math.PI * 7) * 8 * (1 - p1),
                },
                right: {
                    x: Math.cos(p1 * Math.PI * 6 + Math.PI / 4) * bounce * 0.5 * (1 - p1),
                    y: Math.sin(p1 * Math.PI * 5 + Math.PI / 3) * bounce * (1 - p1),
                    rotate: Math.sin(p1 * Math.PI * 6 + Math.PI / 2) * 8 * (1 - p1),
                },
            })

            if (progress < 1) {
                dizzyAnimationRef.current = requestAnimationFrame(animate)
            } else {
                setPupilPositions((prev) => ({ ...prev, scale: 1 }))
                setEyeOffsets({
                    left: { x: 0, y: 0, rotate: 0 },
                    right: { x: 0, y: 0, rotate: 0 },
                })
                setIsDizzy(false)
            }
        }

        dizzyAnimationRef.current = requestAnimationFrame(animate)
        return () => {
            if (dizzyAnimationRef.current) cancelAnimationFrame(dizzyAnimationRef.current)
        }
    }, [isDizzy, eyeWidth, eyeHeight])

    // Blinking with proper cleanup of both timeouts
    useEffect(() => {
        if (typeof window === "undefined") return

        const scheduleBlink = () => {
            const delay = blinkFrequency + (Math.random() - 0.5) * 2 * blinkFrequency * blinkRandomness
            blinkTimeoutRef.current = window.setTimeout(() => {
                setIsBlinking(true)
                blinkCloseTimeoutRef.current = window.setTimeout(() => {
                    setIsBlinking(false)
                    scheduleBlink()
                }, blinkSpeed * 2)
            }, delay)
        }

        if (!initialBlinkRef.current) {
            initialBlinkRef.current = true
            blinkTimeoutRef.current = window.setTimeout(scheduleBlink, 1000 + Math.random() * 2000)
        } else {
            scheduleBlink()
        }

        return () => {
            if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
            if (blinkCloseTimeoutRef.current) clearTimeout(blinkCloseTimeoutRef.current)
        }
    }, [blinkSpeed, blinkFrequency, blinkRandomness])

    const eyeStyle: CSSProperties = {
        width: eyeWidth,
        height: eyeHeight,
        backgroundColor: isBlinking ? borderColor : eyeColor,
        borderRadius: EYE_SHAPE_STYLES[eyeShape],
        position: "relative",
        overflow: "hidden",
        border: `${scaledBorderWidth}px solid ${borderColor}`,
        boxSizing: "border-box",
        flexShrink: 0,
        transition: `background-color ${blinkSpeed}ms ease-in-out`,
    }

    // Disable CSS transition during dizzy to avoid competing with requestAnimationFrame
    const pupilStyle: CSSProperties = {
        width: pupilDimension,
        height: pupilDimension,
        backgroundColor: pupilColor,
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transition: isDizzy ? "none" : `transform ${trackingSpeed}s ease-out`,
        pointerEvents: "none",
        zIndex: 1,
    }

    // Two eyelids that meet in the middle - rectangular, pupil hidden during blink
    const eyelidBaseStyle: CSSProperties = {
        position: "absolute",
        left: -scaledBorderWidth,
        right: -scaledBorderWidth,
        height: "55%",
        backgroundColor: borderColor,
        transition: `transform ${blinkSpeed * 2}ms ease-in-out`,
        pointerEvents: "none",
        zIndex: 10,
    }

    // Total width calculated from eye dimensions + gap
    const totalWidth = eyeWidth * 2 + gapPx

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                gap: gapPx,
                alignItems: "center",
                justifyContent: "center",
                width: totalWidth,
                height: "100%",
            }}
        >
            <div
                ref={leftEyeRef}
                style={{
                    ...eyeStyle,
                    transform: `translate(${eyeOffsets.left.x}px, ${eyeOffsets.left.y}px) rotate(${eyeOffsets.left.rotate}deg)`,
                }}
            >
                {!isBlinking && (
                    <div
                        style={{
                            ...pupilStyle,
                            transform: `translate(-50%, -50%) translate(${pupilPositions.left.x}px, ${pupilPositions.left.y}px) scale(${pupilPositions.scale})`,
                        }}
                    >
                        {showIrisHighlight && (
                            <div
                                style={{
                                    width: "30%",
                                    height: "30%",
                                    backgroundColor: irisHighlightColor,
                                    borderRadius: "50%",
                                    position: "absolute",
                                    top: "20%",
                                    right: "20%",
                                }}
                            />
                        )}
                    </div>
                )}
                <div
                    style={{
                        ...eyelidBaseStyle,
                        top: 0,
                        transform: isBlinking ? "translateY(0)" : "translateY(-100%)",
                    }}
                />
                <div
                    style={{
                        ...eyelidBaseStyle,
                        bottom: 0,
                        transform: isBlinking ? "translateY(0)" : "translateY(100%)",
                    }}
                />
            </div>
            <div
                ref={rightEyeRef}
                style={{
                    ...eyeStyle,
                    transform: `translate(${eyeOffsets.right.x}px, ${eyeOffsets.right.y}px) rotate(${eyeOffsets.right.rotate}deg)`,
                }}
            >
                {!isBlinking && (
                    <div
                        style={{
                            ...pupilStyle,
                            transform: `translate(-50%, -50%) translate(${pupilPositions.right.x}px, ${pupilPositions.right.y}px) scale(${pupilPositions.scale})`,
                        }}
                    >
                        {showIrisHighlight && (
                            <div
                                style={{
                                    width: "30%",
                                    height: "30%",
                                    backgroundColor: irisHighlightColor,
                                    borderRadius: "50%",
                                    position: "absolute",
                                    top: "20%",
                                    right: "20%",
                                }}
                            />
                        )}
                    </div>
                )}
                <div
                    style={{
                        ...eyelidBaseStyle,
                        top: 0,
                        transform: isBlinking ? "translateY(0)" : "translateY(-100%)",
                    }}
                />
                <div
                    style={{
                        ...eyelidBaseStyle,
                        bottom: 0,
                        transform: isBlinking ? "translateY(0)" : "translateY(100%)",
                    }}
                />
            </div>
        </div>
    )
}

addPropertyControls(EyeTracker, {
    eyeColor: { type: ControlType.Color, title: "Eye Color", defaultValue: "#FFFFFF" },
    pupilColor: { type: ControlType.Color, title: "Pupil Color", defaultValue: "#000000" },
    borderColor: { type: ControlType.Color, title: "Border Color", defaultValue: "#000000" },
    eyeShape: {
        type: ControlType.Enum,
        title: "Eye Shape",
        defaultValue: "almond",
        options: ["almond", "round", "wide", "egg"],
        optionTitles: ["Almond", "Round (Googly)", "Wide", "Egg"],
    },
    eyeSize: { type: ControlType.Number, title: "Eye Size", defaultValue: 80, min: 20, max: 400, step: 5, unit: "px" },
    eyeGap: { type: ControlType.Number, title: "Eye Gap", defaultValue: 0.15, min: 0, max: 0.5, step: 0.01 },
    pupilSize: { type: ControlType.Number, title: "Pupil Size", defaultValue: 0.4, min: 0.2, max: 0.6, step: 0.02 },
    borderWidth: { type: ControlType.Number, title: "Border Width", defaultValue: 0.05, min: 0, max: 0.15, step: 0.01 },
    trackingSpeed: {
        type: ControlType.Number,
        title: "Tracking Speed",
        defaultValue: 0.1,
        min: 0.01,
        max: 0.5,
        step: 0.01,
        unit: "s",
    },
    blinkSpeed: {
        type: ControlType.Number,
        title: "Blink Speed",
        defaultValue: 150,
        min: 50,
        max: 500,
        step: 10,
        unit: "ms",
    },
    blinkFrequency: {
        type: ControlType.Number,
        title: "Blink Interval",
        defaultValue: 3500,
        min: 1500,
        max: 10000,
        step: 100,
        unit: "ms",
    },
    blinkRandomness: {
        type: ControlType.Number,
        title: "Blink Randomness",
        defaultValue: 0.3,
        min: 0,
        max: 0.5,
        step: 0.05,
    },
    showIrisHighlight: { type: ControlType.Boolean, title: "Show Highlight", defaultValue: false },
    irisHighlightColor: {
        type: ControlType.Color,
        title: "Highlight Color",
        defaultValue: "rgba(255, 255, 255, 0.6)",
        hidden: (props) => !props.showIrisHighlight,
    },
    enableDizzy: { type: ControlType.Boolean, title: "Enable Dizzy", defaultValue: true },
    dizzyHoverDelay: {
        type: ControlType.Number,
        title: "Dizzy Delay",
        defaultValue: 1200,
        min: 500,
        max: 3000,
        step: 100,
        unit: "ms",
        hidden: (props) => !props.enableDizzy,
    },
})
