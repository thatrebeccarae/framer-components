// Now-Playing music card for /links — fetches live track from Cloudflare Worker proxy,
// renders a slim on-brand header (animated indicator + label) above Spotify's embed iframe,
// which handles album art / title / artist / controls.
//
// Indicator style is selectable: "dot" (PulseDot ripple) or "bars" (decorative equalizer).
// The equalizer is NOT sound-reactive — the iframe is sandboxed and we have no access to
// the actual audio. It's a visual suggestion of playback, not a meter.
//
// On the Framer canvas, renders a placeholder block where the embed would live so the
// card is visible while designing.

import {
    useEffect,
    useState,
    useCallback,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion } from "framer-motion"

interface NowPlayingResponse {
    isPlaying: boolean
    isFallback?: boolean
    trackId?: string
    title?: string
    artist?: string
    album?: string
    albumArt?: string
    trackUrl?: string
    progressMs?: number
    durationMs?: number
    error?: string
}

interface MusicPillProps {
    workerUrl: string
    pollIntervalSeconds: number
    spotifyTheme: "dark" | "light"
    embedSize: "compact" | "standard"
    showWhenIdle: boolean
    liveLabel: string
    fallbackLabel: string
    cardBackground: string
    metaColor: string
    pulseEnabled: boolean
    pulseStyle: "dot" | "bars"
    pulseColor: string
    pulseInactiveColor: string
    pulseSize: number
    headerInset: number
    borderRadius: number
    borderWidth: number
    borderColor: string
    padding: number
    gap: number
    metaFont: any
    style?: CSSProperties
}

const SAMPLE_TRACK_ID = "4iV5W9uYEdYUVa79Axb7Rh"

function detectIsCanvas(): boolean {
    try {
        return RenderTarget.current() === RenderTarget.canvas
    } catch {
        return false
    }
}

function PulseDot({
    activeColor,
    inactiveColor,
    size,
    active,
}: {
    activeColor: string
    inactiveColor: string
    size: number
    active: boolean
}) {
    return (
        <span
            style={{
                position: "relative",
                width: size,
                height: size,
                flexShrink: 0,
                display: "inline-block",
            }}
            aria-hidden
        >
            <span
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    backgroundColor: active ? activeColor : inactiveColor,
                    transition: "background-color 200ms ease",
                }}
            />
            {active && (
                <motion.span
                    animate={{ scale: [1, 4], opacity: [0.65, 0] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeOut",
                        repeatDelay: 1,
                    }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        backgroundColor: activeColor,
                    }}
                />
            )}
        </span>
    )
}

// Decorative equalizer — 5 bars expanding from center with unique cycles per bar.
// Durations are intentionally non-harmonic (1.5 / 1.7 / 1.9 / 2.1 / 2.3s) so the
// bars never phase-lock back into a sequential pattern. Each bar has its own
// scale sequence and repeatDelay to break any perceived left-to-right rhythm.
// NOT sound-reactive — purely a visual suggestion of playback.
const BAR_CONFIGS = [
    {
        duration: 1.7,
        delay: 0,
        repeatDelay: 0.1,
        scale: [0.2, 0.55, 0.3, 0.85, 0.4, 0.7, 0.25],
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1],
    },
    {
        duration: 2.3,
        delay: 0.4,
        repeatDelay: 0.2,
        scale: [0.3, 0.8, 0.45, 0.65, 0.25, 0.9, 0.35],
        times: [0, 0.12, 0.28, 0.42, 0.58, 0.78, 1],
    },
    {
        duration: 1.9,
        delay: 0.15,
        repeatDelay: 0.05,
        scale: [0.25, 0.5, 0.75, 0.3, 0.6, 0.4, 0.2],
        times: [0, 0.18, 0.32, 0.5, 0.65, 0.85, 1],
    },
    {
        duration: 2.1,
        delay: 0.6,
        repeatDelay: 0.15,
        scale: [0.4, 0.65, 0.35, 0.9, 0.5, 0.25, 0.4],
        times: [0, 0.2, 0.4, 0.55, 0.7, 0.9, 1],
    },
    {
        duration: 1.5,
        delay: 0.25,
        repeatDelay: 0.25,
        scale: [0.2, 0.6, 0.4, 0.8, 0.35, 0.5, 0.2],
        times: [0, 0.12, 0.3, 0.45, 0.6, 0.8, 1],
    },
]

function EqualizerBars({
    activeColor,
    inactiveColor,
    size,
    active,
}: {
    activeColor: string
    inactiveColor: string
    size: number
    active: boolean
}) {
    const barWidth = 2
    const barGap = 2
    const containerHeight = Math.round(size * 1.8)
    const color = active ? activeColor : inactiveColor

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: barGap,
                height: containerHeight,
                flexShrink: 0,
            }}
            aria-hidden
        >
            {BAR_CONFIGS.map((cfg, i) => (
                <motion.span
                    key={i}
                    style={{
                        width: barWidth,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: 1,
                        transformOrigin: "center",
                        transition: "background-color 200ms ease",
                    }}
                    animate={
                        active ? { scaleY: cfg.scale } : { scaleY: 0.15 }
                    }
                    transition={
                        active
                            ? {
                                  duration: cfg.duration,
                                  repeat: Infinity,
                                  repeatDelay: cfg.repeatDelay,
                                  ease: "easeInOut",
                                  delay: cfg.delay,
                                  times: cfg.times,
                              }
                            : { duration: 0.2 }
                    }
                />
            ))}
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function MusicPillNowPlaying(props: MusicPillProps) {
    const {
        workerUrl,
        pollIntervalSeconds,
        spotifyTheme,
        embedSize,
        showWhenIdle,
        liveLabel,
        fallbackLabel,
        cardBackground,
        metaColor,
        pulseEnabled,
        pulseStyle,
        pulseColor,
        pulseInactiveColor,
        pulseSize,
        headerInset,
        borderRadius,
        borderWidth,
        borderColor,
        padding,
        gap,
        metaFont,
    } = props

    const isCanvas = detectIsCanvas()

    const [data, setData] = useState<NowPlayingResponse | null>(
        isCanvas
            ? { isPlaying: true, isFallback: false, trackId: SAMPLE_TRACK_ID }
            : null
    )
    const [didFirstFetch, setDidFirstFetch] = useState(isCanvas)

    const fetchNowPlaying = useCallback(async () => {
        if (!workerUrl) return
        try {
            const res = await fetch(workerUrl, { cache: "no-store" })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json: NowPlayingResponse = await res.json()
            setData(json)
        } catch (err) {
            console.warn("[MusicPill] fetch failed:", err)
            setData((prev) => prev ?? { isPlaying: false })
        } finally {
            setDidFirstFetch(true)
        }
    }, [workerUrl])

    useEffect(() => {
        if (isCanvas) return
        fetchNowPlaying()
        const intervalMs = Math.max(15, pollIntervalSeconds) * 1000
        const id = setInterval(fetchNowPlaying, intervalMs)
        return () => clearInterval(id)
    }, [isCanvas, fetchNowPlaying, pollIntervalSeconds])

    const hasTrack = !!data?.trackId
    const isLive = !!data?.isPlaying && !data?.isFallback
    const shouldRender = hasTrack && (isLive || showWhenIdle)

    const embedHeight = embedSize === "compact" ? 80 : 152
    const themeParam = spotifyTheme === "dark" ? "0" : "1"

    const borderStyle =
        borderWidth > 0
            ? {
                  borderWidth,
                  borderStyle: "solid" as const,
                  borderColor,
              }
            : {}

    if (!didFirstFetch) {
        return (
            <div
                style={{
                    ...props.style,
                    width: "100%",
                    backgroundColor: cardBackground,
                    borderRadius,
                    padding,
                    minHeight: 32 + gap + embedHeight,
                    opacity: 0.5,
                    ...borderStyle,
                }}
            />
        )
    }

    if (!shouldRender) return null

    const labelText = isLive ? liveLabel : fallbackLabel

    return (
        <div
            style={{
                ...props.style,
                position: "relative",
                width: "100%",
                backgroundColor: cardBackground,
                borderRadius,
                padding,
                display: "flex",
                flexDirection: "column",
                gap,
                overflow: "hidden",
                ...borderStyle,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minHeight: pulseSize,
                    paddingLeft: headerInset,
                }}
            >
                {pulseEnabled &&
                    (pulseStyle === "bars" ? (
                        <EqualizerBars
                            activeColor={pulseColor}
                            inactiveColor={pulseInactiveColor}
                            size={pulseSize}
                            active={isLive}
                        />
                    ) : (
                        <PulseDot
                            activeColor={pulseColor}
                            inactiveColor={pulseInactiveColor}
                            size={pulseSize}
                            active={isLive}
                        />
                    ))}
                <div
                    style={{
                        ...metaFont,
                        color: metaColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {labelText}
                </div>
            </div>

            {isCanvas ? (
                <div
                    style={{
                        width: "100%",
                        height: embedHeight,
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px dashed rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...metaFont,
                        color: metaColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    SPOTIFY EMBED (RUNTIME ONLY)
                </div>
            ) : (
                <iframe
                    key={data!.trackId}
                    src={`https://open.spotify.com/embed/track/${data!.trackId}?utm_source=generator&theme=${themeParam}`}
                    width="100%"
                    height={embedHeight}
                    frameBorder={0}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{
                        border: "none",
                        borderRadius: 8,
                        display: "block",
                    }}
                    title="Spotify player"
                />
            )}
        </div>
    )
}

addPropertyControls(MusicPillNowPlaying, {
    workerUrl: {
        type: ControlType.String,
        title: "Worker URL",
        defaultValue:
            "https://your-spotify-proxy.workers.dev/now-playing",
        placeholder: "https://your-worker.workers.dev/now-playing",
    },
    pollIntervalSeconds: {
        type: ControlType.Number,
        title: "Poll Interval",
        defaultValue: 30,
        min: 15,
        max: 300,
        step: 5,
        unit: "s",
    },
    spotifyTheme: {
        type: ControlType.Enum,
        title: "Embed Theme",
        options: ["dark", "light"],
        optionTitles: ["Dark", "Light"],
        defaultValue: "dark",
        displaySegmentedControl: true,
    },
    embedSize: {
        type: ControlType.Enum,
        title: "Embed Size",
        options: ["compact", "standard"],
        optionTitles: ["Compact 80", "Standard 152"],
        defaultValue: "compact",
        displaySegmentedControl: true,
    },
    showWhenIdle: {
        type: ControlType.Boolean,
        title: "Idle State",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    liveLabel: {
        type: ControlType.String,
        title: "Live Label",
        defaultValue: "NOW PLAYING ON SPOTIFY",
    },
    fallbackLabel: {
        type: ControlType.String,
        title: "Idle Label",
        defaultValue: "LAST PLAYED",
        hidden: (props) => !props.showWhenIdle,
    },
    pulseEnabled: {
        type: ControlType.Boolean,
        title: "Indicator",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    pulseStyle: {
        type: ControlType.Enum,
        title: "Style",
        options: ["dot", "bars"],
        optionTitles: ["Dot", "Bars"],
        defaultValue: "dot",
        displaySegmentedControl: true,
        hidden: (props) => !props.pulseEnabled,
    },
    pulseColor: {
        type: ControlType.Color,
        title: "Active Color",
        defaultValue: "rgb(30, 215, 96)",
        hidden: (props) => !props.pulseEnabled,
    },
    pulseInactiveColor: {
        type: ControlType.Color,
        title: "Idle Color",
        defaultValue: "rgba(249, 242, 230, 0.3)",
        hidden: (props) => !props.pulseEnabled,
    },
    pulseSize: {
        type: ControlType.Number,
        title: "Size",
        defaultValue: 6,
        min: 4,
        max: 12,
        step: 1,
        unit: "px",
        hidden: (props) => !props.pulseEnabled,
    },
    headerInset: {
        type: ControlType.Number,
        title: "Header Inset",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
    cardBackground: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "rgba(255, 255, 255, 0.08)",
    },
    metaColor: {
        type: ControlType.Color,
        title: "Label",
        defaultValue: "rgba(249, 242, 230, 0.7)",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
    borderWidth: {
        type: ControlType.Number,
        title: "Border Width",
        defaultValue: 1,
        min: 0,
        max: 4,
        step: 1,
        unit: "px",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255, 255, 255, 0.1)",
        hidden: (props) => !props.borderWidth,
    },
    padding: {
        type: ControlType.Number,
        title: "Padding",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 10,
        min: 0,
        max: 24,
        step: 2,
        unit: "px",
    },
    metaFont: {
        type: ControlType.Font,
        title: "Label Font",
        defaultValue: {
            fontSize: "11px",
            variant: "Semibold",
            letterSpacing: "0.05em",
            lineHeight: "1em",
        },
        controls: "extended",
        defaultFontType: "sans-serif",
    },
})
