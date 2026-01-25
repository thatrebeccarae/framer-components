// EyeTrackerV3 - Cartoon eyes that follow cursor, blink, and have dizzy easter egg
// Height-driven sizing with ResizeObserver (height-only, with threshold to prevent loops)

import { useEffect, useState, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface EyeTrackerV3Props {
    eyeColor: string
    pupilColor: string
    borderColor: string
    eyeGap: number
    eyeSize: number
    blinkSpeed: number
    blinkFrequency: number
    blinkRandomness: number
    pupilSize: number
    borderWidth: number
    trackingSpeed: number
    eyeShape: "almond" | "round" | "wide" | "egg"
    showIrisHighlight: boolean
    irisHighlightColor: string
    enableDizzy: boolean
    dizzyHoverDelay: number
    style?: CSSProperties
}

/**
 * EyeTrackerV3 - Animated Eye Tracker
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 188
 * @framerIntrinsicHeight 80
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */
export default function EyeTrackerV3(props: EyeTrackerV3Props) {
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
    const initialBlinkRef = useRef(false)

    // Measured container height for responsive sizing
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)

    const [animState, setAnimState] = useState({
        leftPupil: { x: 0, y: 0 },
        rightPupil: { x: 0, y: 0 },
        leftEyeOffset: { x: 0, y: 0, rotate: 0 },
        rightEyeOffset: { x: 0, y: 0, rotate: 0 },
        pupilScale: 1,
        isBlinking: false,
        isDizzy: false,
    })

    // Eye shape border radius presets
    const eyeShapeStyles: Record<string, string> = {
        almond: "50% 50% 50% 50% / 55% 55% 45% 45%",
        round: "50%",
        wide: "50% 50% 50% 50% / 45% 45% 55% 55%",
        egg: "50% 50% 50% 50% / 65% 65% 35% 35%", // More rounded on top, flatter on bottom
    }

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

    // Calculate eye dimensions from height based on shape
    // Height is the primary dimension, width is derived from the shape's aspect ratio
    const getEyeDimensions = () => {
        switch (eyeShape) {
            case "round":
                // 1:1 aspect ratio
                return { eyeWidth: baseHeight, eyeHeight: baseHeight }
            case "egg":
                // Taller than wide (width = height * 0.7)
                return { eyeWidth: baseHeight * 0.7, eyeHeight: baseHeight }
            case "wide":
                // Wider than tall (height = width * 0.5, so width = height * 2)
                return { eyeWidth: baseHeight * 2, eyeHeight: baseHeight }
            case "almond":
            default:
                // Slightly wider than tall (height = width * 0.85, so width = height / 0.85)
                return { eyeWidth: baseHeight / 0.85, eyeHeight: baseHeight }
        }
    }

    const { eyeWidth, eyeHeight } = getEyeDimensions()
    const gapPx = Math.min(eyeWidth, eyeHeight) * eyeGap
    const pupilDimension = Math.min(eyeWidth, eyeHeight) * pupilSize
    const scaledBorderWidth = Math.max(1, Math.round(Math.min(eyeWidth, eyeHeight) * borderWidth))

    // Cursor tracking
    useEffect(() => {
        if (typeof window === "undefined") return

        const handleMouseMove = (e: MouseEvent) => {
            if (!leftEyeRef.current || !rightEyeRef.current || animState.isDizzy) return

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
                            setAnimState(prev => ({ ...prev, isDizzy: true }))
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

            setAnimState(prev => ({
                ...prev,
                leftPupil: calcPupil(leftCenter),
                rightPupil: calcPupil(rightCenter),
            }))
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
        }
    }, [animState.isDizzy, enableDizzy, dizzyHoverDelay, eyeWidth, eyeHeight])

    // Dizzy animation
    useEffect(() => {
        if (!animState.isDizzy || typeof window === "undefined") return

        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }

        let startTime: number | null = null
        const bounceDur = 800, recenterDur = 400, totalDur = bounceDur + recenterDur
        const radius = Math.min(eyeWidth, eyeHeight) * 0.3

        const animate = (ts: number) => {
            if (!startTime) startTime = ts
            const elapsed = ts - startTime
            const progress = Math.min(elapsed / totalDur, 1)
            const p1 = Math.min(elapsed / bounceDur, 1)
            const p2 = Math.max(0, (elapsed - bounceDur) / recenterDur)

            const angle = p1 * Math.PI * 8
            const r = radius * (1 - p1)
            const leftX = Math.cos(angle) * r, leftY = Math.sin(angle) * r
            const rightX = Math.cos(-angle) * r, rightY = Math.sin(-angle) * r
            const scale = 1 + Math.sin(p1 * Math.PI) * 0.5
            const bounce = Math.min(eyeWidth, eyeHeight) * 0.15

            setAnimState(prev => ({
                ...prev,
                leftPupil: { x: p1 < 1 ? leftX : leftX * (1 - p2), y: p1 < 1 ? leftY : leftY * (1 - p2) },
                rightPupil: { x: p1 < 1 ? rightX : rightX * (1 - p2), y: p1 < 1 ? rightY : rightY * (1 - p2) },
                pupilScale: p1 < 1 ? scale : 1 + (scale - 1) * (1 - p2),
                leftEyeOffset: {
                    x: Math.cos(p1 * Math.PI * 5) * bounce * 0.5 * (1 - p1),
                    y: Math.sin(p1 * Math.PI * 6) * bounce * (1 - p1),
                    rotate: Math.sin(p1 * Math.PI * 7) * 8 * (1 - p1),
                },
                rightEyeOffset: {
                    x: Math.cos(p1 * Math.PI * 6 + Math.PI / 4) * bounce * 0.5 * (1 - p1),
                    y: Math.sin(p1 * Math.PI * 5 + Math.PI / 3) * bounce * (1 - p1),
                    rotate: Math.sin(p1 * Math.PI * 6 + Math.PI / 2) * 8 * (1 - p1),
                },
            }))

            if (progress < 1) {
                dizzyAnimationRef.current = requestAnimationFrame(animate)
            } else {
                setAnimState(prev => ({
                    ...prev,
                    pupilScale: 1,
                    leftEyeOffset: { x: 0, y: 0, rotate: 0 },
                    rightEyeOffset: { x: 0, y: 0, rotate: 0 },
                    isDizzy: false,
                }))
            }
        }

        dizzyAnimationRef.current = requestAnimationFrame(animate)
        return () => { if (dizzyAnimationRef.current) cancelAnimationFrame(dizzyAnimationRef.current) }
    }, [animState.isDizzy, eyeWidth, eyeHeight])

    // Blinking
    useEffect(() => {
        if (typeof window === "undefined") return

        const scheduleBlink = () => {
            const delay = blinkFrequency + (Math.random() - 0.5) * 2 * blinkFrequency * blinkRandomness
            blinkTimeoutRef.current = window.setTimeout(() => {
                setAnimState(prev => ({ ...prev, isBlinking: true }))
                setTimeout(() => {
                    setAnimState(prev => ({ ...prev, isBlinking: false }))
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

        return () => { if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current) }
    }, [blinkSpeed, blinkFrequency, blinkRandomness])

    const eyeStyle: CSSProperties = {
        width: eyeWidth,
        height: eyeHeight,
        backgroundColor: animState.isBlinking ? borderColor : eyeColor,
        borderRadius: eyeShapeStyles[eyeShape],
        position: "relative",
        overflow: "hidden",
        border: `${scaledBorderWidth}px solid ${borderColor}`,
        boxSizing: "border-box",
        flexShrink: 0,
        transition: `background-color ${blinkSpeed}ms ease-in-out`,
    }

    const pupilStyle: CSSProperties = {
        width: pupilDimension,
        height: pupilDimension,
        backgroundColor: pupilColor,
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transition: `transform ${trackingSpeed}s ease-out`,
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
        <div ref={containerRef} style={{ display: "flex", gap: gapPx, alignItems: "center", justifyContent: "center", width: totalWidth, height: "100%" }}>
            <div ref={leftEyeRef} style={{ ...eyeStyle, transform: `translate(${animState.leftEyeOffset.x}px, ${animState.leftEyeOffset.y}px) rotate(${animState.leftEyeOffset.rotate}deg)` }}>
                {!animState.isBlinking && (
                    <div style={{ ...pupilStyle, transform: `translate(-50%, -50%) translate(${animState.leftPupil.x}px, ${animState.leftPupil.y}px) scale(${animState.pupilScale})` }}>
                        {showIrisHighlight && <div style={{ width: "30%", height: "30%", backgroundColor: irisHighlightColor, borderRadius: "50%", position: "absolute", top: "20%", right: "20%" }} />}
                    </div>
                )}
                <div style={{ ...eyelidBaseStyle, top: 0, transform: animState.isBlinking ? "translateY(0)" : "translateY(-100%)" }} />
                <div style={{ ...eyelidBaseStyle, bottom: 0, transform: animState.isBlinking ? "translateY(0)" : "translateY(100%)" }} />
            </div>
            <div ref={rightEyeRef} style={{ ...eyeStyle, transform: `translate(${animState.rightEyeOffset.x}px, ${animState.rightEyeOffset.y}px) rotate(${animState.rightEyeOffset.rotate}deg)` }}>
                {!animState.isBlinking && (
                    <div style={{ ...pupilStyle, transform: `translate(-50%, -50%) translate(${animState.rightPupil.x}px, ${animState.rightPupil.y}px) scale(${animState.pupilScale})` }}>
                        {showIrisHighlight && <div style={{ width: "30%", height: "30%", backgroundColor: irisHighlightColor, borderRadius: "50%", position: "absolute", top: "20%", right: "20%" }} />}
                    </div>
                )}
                <div style={{ ...eyelidBaseStyle, top: 0, transform: animState.isBlinking ? "translateY(0)" : "translateY(-100%)" }} />
                <div style={{ ...eyelidBaseStyle, bottom: 0, transform: animState.isBlinking ? "translateY(0)" : "translateY(100%)" }} />
            </div>
        </div>
    )
}

addPropertyControls(EyeTrackerV3, {
    eyeColor: { type: ControlType.Color, title: "Eye Color", defaultValue: "#FFFFFF" },
    pupilColor: { type: ControlType.Color, title: "Pupil Color", defaultValue: "#000000" },
    borderColor: { type: ControlType.Color, title: "Border Color", defaultValue: "#000000" },
    eyeShape: { type: ControlType.Enum, title: "Eye Shape", defaultValue: "almond", options: ["almond", "round", "wide", "egg"], optionTitles: ["Almond", "Round (Googly)", "Wide", "Egg"] },
    eyeSize: { type: ControlType.Number, title: "Eye Size", defaultValue: 80, min: 20, max: 400, step: 5, unit: "px" },
    eyeGap: { type: ControlType.Number, title: "Eye Gap", defaultValue: 0.15, min: 0, max: 0.5, step: 0.01 },
    pupilSize: { type: ControlType.Number, title: "Pupil Size", defaultValue: 0.4, min: 0.2, max: 0.6, step: 0.02 },
    borderWidth: { type: ControlType.Number, title: "Border Width", defaultValue: 0.05, min: 0, max: 0.15, step: 0.01 },
    trackingSpeed: { type: ControlType.Number, title: "Tracking Speed", defaultValue: 0.1, min: 0.01, max: 0.5, step: 0.01, unit: "s" },
    blinkSpeed: { type: ControlType.Number, title: "Blink Speed", defaultValue: 150, min: 50, max: 500, step: 10, unit: "ms" },
    blinkFrequency: { type: ControlType.Number, title: "Blink Interval", defaultValue: 3500, min: 1500, max: 10000, step: 100, unit: "ms" },
    blinkRandomness: { type: ControlType.Number, title: "Blink Randomness", defaultValue: 0.3, min: 0, max: 0.5, step: 0.05 },
    showIrisHighlight: { type: ControlType.Boolean, title: "Show Highlight", defaultValue: false },
    irisHighlightColor: { type: ControlType.Color, title: "Highlight Color", defaultValue: "rgba(255, 255, 255, 0.6)", hidden: (props) => !props.showIrisHighlight },
    enableDizzy: { type: ControlType.Boolean, title: "Enable Dizzy", defaultValue: true },
    dizzyHoverDelay: { type: ControlType.Number, title: "Dizzy Delay", defaultValue: 1200, min: 500, max: 3000, step: 100, unit: "ms", hidden: (props) => !props.enableDizzy },
})
