// Substack Item Counter — displays the total number of posts in a Substack
// archive via a companion Cloudflare Worker proxy with a /count endpoint.
//
// Setup:
// 1. Add this component to your page
// 2. Set the "Proxy URL" to your Cloudflare Worker URL
// 3. Optionally set section/exclude filters (same as SubstackFeed)
// 4. The count updates automatically when new posts are published
//    (uses /count endpoint which paginates the full archive)

import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useState, startTransition, useMemo } from "react"

interface SubstackItemCounterProps {
    proxyUrl: string
    section: string
    excludeSections: string
    prefix: string
    suffix: string
    fontColor: string
    font: any
    textAlign: "left" | "center" | "right"
    style?: React.CSSProperties
}

function formatNumber(num: number): string {
    return num.toLocaleString("en-US")
}

/**
 * @framerDisplayName Substack Item Counter
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function SubstackItemCounter(props: SubstackItemCounterProps) {
    const {
        proxyUrl = "",
        section = "",
        excludeSections = "",
        prefix = "",
        suffix = "",
        fontColor = "#000000",
        font,
        textAlign = "center",
    } = props

    const [count, setCount] = useState(0)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (isCanvas) {
            setCount(6)
            return
        }
        if (!proxyUrl || proxyUrl.includes("YOUR-SUBDOMAIN")) return

        let cancelled = false
        async function fetchCount() {
            try {
                const params = new URLSearchParams()
                if (section) params.set("section", section)
                if (excludeSections) params.set("exclude", excludeSections)
                const qs = params.toString()
                const countUrl = qs ? `${proxyUrl}/count?${qs}` : `${proxyUrl}/count`

                const res = await fetch(countUrl)
                if (!res.ok) throw new Error("Count fetch failed")
                const data = await res.json()
                if (!cancelled) {
                    const n = typeof data?.count === "number" ? data.count : 0
                    startTransition(() => setCount(n))
                }
            } catch (e) {
                console.error("Substack Item Counter: fetch error", e)
                if (!cancelled) startTransition(() => setCount(0))
            }
        }
        fetchCount()
        return () => { cancelled = true }
    }, [proxyUrl, section, excludeSections, isCanvas])

    const formattedCount = useMemo(() => formatNumber(count), [count])

    const cleanPrefix = useMemo(() => {
        const trimmed = prefix?.trim() || ""
        return trimmed ? `${trimmed} ` : ""
    }, [prefix])

    const cleanSuffix = useMemo(() => {
        const trimmed = suffix?.trim() || ""
        return trimmed ? ` ${trimmed}` : ""
    }, [suffix])

    const displayText = `${cleanPrefix}${formattedCount}${cleanSuffix}`

    const textStyle = {
        color: fontColor,
        ...font,
        textAlign,
        whiteSpace: "pre-wrap" as const,
        wordWrap: "break-word" as const,
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
                alignItems: "center",
                width: "max-content",
            }}
        >
            <div style={textStyle}>{displayText}</div>
        </div>
    )
}

addPropertyControls(SubstackItemCounter, {
    proxyUrl: {
        type: ControlType.String,
        title: "Proxy URL",
        defaultValue: "",
        description: "Your Cloudflare Worker URL (e.g. https://substack-proxy.example.workers.dev)",
    },
    section: {
        type: ControlType.String,
        title: "Section",
        defaultValue: "",
        description: "Only count posts from this section slug",
    },
    excludeSections: {
        type: ControlType.String,
        title: "Exclude Sections",
        defaultValue: "",
        description: "Comma-separated section slugs to exclude",
    },
    prefix: {
        type: ControlType.String,
        title: "Prefix",
        defaultValue: "",
    },
    suffix: {
        type: ControlType.String,
        title: "Suffix",
        defaultValue: "",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Regular",
            letterSpacing: "0.05em",
            lineHeight: "1.4em",
        },
    },
    textAlign: {
        type: ControlType.Enum,
        title: "Text Align",
        options: ["left", "center", "right"],
        optionTitles: ["Left", "Center", "Right"],
        defaultValue: "center",
        displaySegmentedControl: true,
    },
    fontColor: {
        type: ControlType.Color,
        title: "Font Color",
        defaultValue: "#000000",
    },
})
