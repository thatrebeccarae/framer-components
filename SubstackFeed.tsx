// Substack Feed — displays posts from Cloudflare Worker /feed endpoint
// Supports pagination via worker ?limit & ?offset, tag filtering, and Load More
import { useState, useEffect, useRef, useMemo, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface Post {
    title: string
    link: string
    pubDate: string
    excerpt: string
    image: string
    tags?: string[]
    section?: string
}

interface SubstackFeedProps {
    proxyUrl: string
    section: string
    excludeSections: string
    tagFilter: string
    layout: "list" | "grid" | "cards"
    maxPosts: number
    loadMoreIncrement: number
    showLoadMore: boolean
    loadMoreText: string
    backgroundColor: string
    cardBackground: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    titleFont: CSSProperties
    bodyFont: CSSProperties
    metaFont: CSSProperties
    gap: number
    borderRadius: number
    gridColumns: number
    showImages: boolean
    showExcerpt: boolean
    showDate: boolean
    showReadMore: boolean
    readMoreText: string
    imageAspectRatio: string
    listImageWidth: number
    padding: string
    style?: CSSProperties
}

function ArrowRightIcon({ color, size = 12 }: { color: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginLeft: 4, display: "inline-block", verticalAlign: "middle" }}
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    )
}

function decodeEntities(str: string): string {
    if (typeof document !== "undefined") {
        const el = document.createElement("textarea")
        el.innerHTML = str
        return el.value
    }
    return str
        .replace(/&#8212;/g, "—")
        .replace(/&#8211;/g, "–")
        .replace(/&#8216;/g, "\u2018")
        .replace(/&#8217;/g, "\u2019")
        .replace(/&#8220;/g, "\u201C")
        .replace(/&#8221;/g, "\u201D")
        .replace(/&#038;/g, "&")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
}

function useContainerWidth() {
    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (!ref.current) return
        setWidth(ref.current.getBoundingClientRect().width)
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width)
            }
        })
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return { ref, width }
}

// Build a /feed URL with the proxy + query params
function buildFeedUrl(proxyUrl: string, params: Record<string, string>) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.set(k, v)
    })
    const s = qs.toString()
    return s ? `${proxyUrl}/feed?${s}` : `${proxyUrl}/feed`
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function SubstackFeed(props: SubstackFeedProps) {
    const {
        proxyUrl = "https://substack-proxy.YOUR-SUBDOMAIN.workers.dev",
        section = "",
        excludeSections = "",
        tagFilter = "",
        layout = "cards",
        maxPosts = 6,
        loadMoreIncrement = 6,
        showLoadMore = true,
        loadMoreText = "LOAD MORE",
        backgroundColor = "transparent",
        cardBackground = "#ffffff",
        textColor = "#0f0e0e",
        secondaryTextColor = "#757575",
        accentColor = "#0f0e0e",
        titleFont,
        bodyFont,
        metaFont,
        gap = 24,
        borderRadius = 12,
        gridColumns = 2,
        showImages = true,
        showExcerpt = true,
        showDate = true,
        showReadMore = true,
        readMoreText = "READ MORE",
        imageAspectRatio = "16/9",
        listImageWidth = 240,
        padding = "0px",
    } = props

    const isStatic = useIsStaticRenderer()
    const { ref, width } = useContainerWidth()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [error, setError] = useState("")

    const isPhone = width === 0 || width < 700
    const isTablet = width >= 700 && width < 900

    const effectiveLayout = isPhone ? ("cards" as const) : layout
    const effectiveColumns = isPhone ? 1 : isTablet ? Math.min(gridColumns, 2) : gridColumns
    const effectiveGap = isPhone ? Math.max(gap, 32) : gap
    const effectiveListImageWidth = isPhone ? 100 : isTablet ? Math.min(listImageWidth, 180) : listImageWidth

    // Section filter routes through RSS (no pagination support). When section is set,
    // Load More is hidden because the worker returns the full section feed in one call.
    const sectionMode = Boolean(section)

    // Initial fetch — runs when identity-affecting props change
    useEffect(() => {
        if (isStatic) return
        if (!proxyUrl || proxyUrl.includes("YOUR-SUBDOMAIN")) return

        let cancelled = false
        async function load() {
            setLoading(true)
            setError("")
            try {
                const url = buildFeedUrl(proxyUrl, {
                    section,
                    exclude: excludeSections,
                    limit: String(maxPosts),
                    offset: "0",
                })
                const res = await fetch(url)
                if (!res.ok) throw new Error("Feed fetch failed")
                const data: Post[] = await res.json()
                if (cancelled) return
                startTransition(() => {
                    setPosts(data)
                    setHasMore(!sectionMode && data.length >= maxPosts)
                    setLoading(false)
                })
            } catch (e: any) {
                if (cancelled) return
                startTransition(() => {
                    setError(e.message)
                    setLoading(false)
                })
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [proxyUrl, section, excludeSections, maxPosts, sectionMode, isStatic])

    async function handleLoadMore() {
        if (loadingMore || !hasMore || sectionMode) return
        setLoadingMore(true)
        try {
            const url = buildFeedUrl(proxyUrl, {
                exclude: excludeSections,
                limit: String(loadMoreIncrement),
                offset: String(posts.length),
            })
            const res = await fetch(url)
            if (!res.ok) throw new Error("Load more failed")
            const data: Post[] = await res.json()
            startTransition(() => {
                setPosts((prev) => {
                    const seen = new Set(prev.map((p) => p.link))
                    const fresh = data.filter((p) => !seen.has(p.link))
                    return [...prev, ...fresh]
                })
                setHasMore(data.length >= loadMoreIncrement)
                setLoadingMore(false)
            })
        } catch (e) {
            setLoadingMore(false)
            setHasMore(false)
        }
    }

    // Client-side tag filter (OR match across comma-separated slugs)
    const visiblePosts = useMemo(() => {
        const raw = tagFilter.trim()
        if (!raw) return posts
        const wanted = new Set(
            raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        )
        if (wanted.size === 0) return posts
        return posts.filter((p) => {
            const tags = (p.tags || []).map((t) => t.toLowerCase())
            return tags.some((t) => wanted.has(t))
        })
    }, [posts, tagFilter])

    const formatDate = (d: string) => {
        try {
            return new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
        } catch {
            return d
        }
    }

    const wrapperStyle: CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        ...props.style,
    }

    if (isStatic) {
        return (
            <div ref={ref} style={wrapperStyle}>
                <div style={{ width: "100%", padding, backgroundColor, display: "flex", flexDirection: "column", gap }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ background: cardBackground, borderRadius, padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ width: "100%", aspectRatio: imageAspectRatio, background: "#e5e5e5", borderRadius: borderRadius / 2 }} />
                            <div style={{ height: 20, width: "70%", background: "#e5e5e5", borderRadius: 4 }} />
                            <div style={{ height: 14, width: "50%", background: "#eeeeee", borderRadius: 4 }} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div ref={ref} style={wrapperStyle}>
                <div style={{ width: "100%", padding, backgroundColor, display: "flex", flexDirection: "column", gap: effectiveGap }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{ background: cardBackground, borderRadius, padding: 20, display: "flex", flexDirection: "column", gap: 8, animation: "pulse 1.5s ease-in-out infinite" }}>
                            <div style={{ width: "100%", aspectRatio: imageAspectRatio, background: "#e5e5e5", borderRadius: borderRadius / 2 }} />
                            <div style={{ height: 18, width: "60%", background: "#e5e5e5", borderRadius: 4 }} />
                            <div style={{ height: 12, width: "40%", background: "#eeeeee", borderRadius: 4 }} />
                        </div>
                    ))}
                    <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div ref={ref} style={wrapperStyle}>
                <div style={{ width: "100%", padding: 20, backgroundColor, color: textColor, display: "flex", alignItems: "center", justifyContent: "center", ...bodyFont }}>
                    Unable to load posts. Please check your proxy URL.
                </div>
            </div>
        )
    }

    const isGrid = effectiveLayout === "grid"
    const isList = effectiveLayout === "list"

    const containerStyle: CSSProperties = {
        width: "100%",
        backgroundColor,
        padding,
        display: isGrid ? "grid" : "flex",
        flexDirection: isList ? "column" : "column",
        flexWrap: effectiveLayout === "cards" ? "wrap" : undefined,
        ...(isGrid
            ? { gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)` }
            : {}),
        gap: effectiveGap,
    }

    const arrowSize = metaFont?.fontSize ? parseInt(String(metaFont.fontSize), 10) || 12 : 12
    const showLoadMoreButton = showLoadMore && hasMore && !sectionMode && !tagFilter.trim()

    return (
        <div ref={ref} style={wrapperStyle}>
            <div style={containerStyle}>
                {visiblePosts.map((post, i) => (
                    <a
                        key={`${post.link}-${i}`}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            flexDirection: isList ? "row" : "column",
                            alignItems: isList ? "center" : undefined,
                            background: cardBackground,
                            borderRadius,
                            overflow: "hidden",
                            flex:
                                effectiveLayout === "cards"
                                    ? `1 1 calc(${100 / effectiveColumns}% - ${effectiveGap}px)`
                                    : isList
                                    ? "none"
                                    : "1",
                            minWidth: 0,
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = ""
                            e.currentTarget.style.boxShadow = ""
                        }}
                    >
                        {showImages && post.image && (
                            isList ? (
                                <img
                                    src={post.image}
                                    alt=""
                                    style={{
                                        width: effectiveListImageWidth,
                                        height: effectiveListImageWidth * 0.625,
                                        objectFit: "cover",
                                        borderRadius: borderRadius > 0 ? borderRadius / 2 : 0,
                                        flexShrink: 0,
                                    }}
                                />
                            ) : (
                                <img
                                    src={post.image}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        aspectRatio: imageAspectRatio,
                                        objectFit: "cover",
                                        display: "block",
                                        flexShrink: 0,
                                    }}
                                />
                            )
                        )}
                        <div style={{ padding: isPhone ? 12 : 16, display: "flex", flexDirection: "column", gap: isPhone ? 6 : 8, flex: 1, minWidth: 0 }}>
                            {showDate && post.pubDate && (
                                <span style={{ color: secondaryTextColor, ...metaFont, fontSize: metaFont?.fontSize || 12 }}>
                                    {formatDate(post.pubDate)}
                                </span>
                            )}
                            <h3 style={{ margin: 0, color: textColor, ...titleFont, fontSize: titleFont?.fontSize || 18 }}>
                                {decodeEntities(post.title)}
                            </h3>
                            {showExcerpt && post.excerpt && (
                                <p style={{ margin: 0, color: secondaryTextColor, ...bodyFont, fontSize: bodyFont?.fontSize || 14, lineHeight: bodyFont?.lineHeight || "1.4em", display: "-webkit-box", WebkitLineClamp: isPhone ? 2 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {decodeEntities(post.excerpt)}
                                </p>
                            )}
                            {showReadMore && (
                                <span
                                    style={{
                                        color: secondaryTextColor,
                                        ...metaFont,
                                        fontSize: metaFont?.fontSize || 12,
                                        marginTop: 4,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        transition: "color 0.2s ease, opacity 0.2s ease",
                                    }}
                                    className="read-more-cta"
                                >
                                    {readMoreText}
                                    <ArrowRightIcon color="currentColor" size={arrowSize} />
                                </span>
                            )}
                        </div>
                    </a>
                ))}
            </div>
            {showLoadMoreButton && (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "24px 0 0 0" }}>
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="substack-load-more-btn"
                        style={{
                            background: "transparent",
                            color: textColor,
                            border: `1px solid ${textColor}`,
                            borderRadius: 999,
                            padding: "12px 24px",
                            cursor: loadingMore ? "default" : "pointer",
                            opacity: loadingMore ? 0.5 : 1,
                            transition: "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease",
                            ...metaFont,
                            fontSize: metaFont?.fontSize || 12,
                        }}
                    >
                        {loadingMore ? "LOADING…" : loadMoreText}
                    </button>
                </div>
            )}
            {showReadMore && (
                <style>{`
                    .read-more-cta { opacity: 0.7; }
                    a:hover .read-more-cta { opacity: 1; color: ${accentColor}; }
                    a:hover .read-more-cta svg { stroke: ${accentColor}; }
                    .substack-load-more-btn:hover:not(:disabled) { background-color: ${textColor}; color: ${cardBackground}; }
                `}</style>
            )}
        </div>
    )
}

addPropertyControls(SubstackFeed, {
    proxyUrl: {
        type: ControlType.String,
        title: "Proxy URL",
        defaultValue: "https://substack-proxy.YOUR-SUBDOMAIN.workers.dev",
        description: "Your Cloudflare Worker URL",
    },
    section: {
        type: ControlType.String,
        title: "Section",
        defaultValue: "",
        description: "Only show posts from this section slug (disables Load More)",
    },
    excludeSections: {
        type: ControlType.String,
        title: "Exclude Sections",
        defaultValue: "",
        description: "Comma-separated section slugs to hide (e.g. open-tabs)",
    },
    tagFilter: {
        type: ControlType.String,
        title: "Tag Filter",
        defaultValue: "",
        description: "Comma-separated tag slugs (e.g. aeo,ai,strategy). OR match.",
    },
    layout: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["list", "grid", "cards"],
        optionTitles: ["List", "Grid", "Cards"],
        defaultValue: "cards",
        displaySegmentedControl: true,
    },
    maxPosts: {
        type: ControlType.Number,
        title: "Initial Posts",
        defaultValue: 6,
        min: 1,
        max: 50,
        step: 1,
        description: "Number of posts fetched on first load",
    },
    showLoadMore: {
        type: ControlType.Boolean,
        title: "Load More Button",
        defaultValue: true,
    },
    loadMoreIncrement: {
        type: ControlType.Number,
        title: "Per Page",
        defaultValue: 6,
        min: 1,
        max: 50,
        step: 1,
        hidden: (props) => !props.showLoadMore,
        description: "Posts fetched per Load More click",
    },
    loadMoreText: {
        type: ControlType.String,
        title: "Load More Text",
        defaultValue: "LOAD MORE",
        hidden: (props) => !props.showLoadMore,
    },
    gridColumns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 2,
        min: 1,
        max: 4,
        step: 1,
        hidden: (props) => props.layout === "list",
    },
    showImages: {
        type: ControlType.Boolean,
        title: "Images",
        defaultValue: true,
    },
    imageAspectRatio: {
        type: ControlType.Enum,
        title: "Image Ratio",
        options: ["16/9", "3/2", "4/3", "1/1", "2/1"],
        optionTitles: ["16:9", "3:2", "4:3", "1:1", "2:1"],
        defaultValue: "16/9",
        hidden: (props) => !props.showImages || props.layout === "list",
    },
    listImageWidth: {
        type: ControlType.Number,
        title: "Image Width",
        defaultValue: 240,
        min: 80,
        max: 400,
        step: 10,
        unit: "px",
        hidden: (props) => !props.showImages || props.layout !== "list",
    },
    showExcerpt: {
        type: ControlType.Boolean,
        title: "Excerpt",
        defaultValue: true,
    },
    showDate: {
        type: ControlType.Boolean,
        title: "Date",
        defaultValue: true,
    },
    showReadMore: {
        type: ControlType.Boolean,
        title: "Read More",
        defaultValue: true,
    },
    readMoreText: {
        type: ControlType.String,
        title: "Read More Text",
        defaultValue: "READ MORE",
        hidden: (props) => !props.showReadMore,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 24,
        min: 0,
        max: 64,
        step: 4,
        unit: "px",
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
    padding: {
        type: ControlType.Padding,
        title: "Padding",
        defaultValue: "0px",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "transparent",
    },
    cardBackground: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "#0f0e0e",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary",
        defaultValue: "#757575",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#0f0e0e",
    },
    titleFont: {
        type: ControlType.Font,
        title: "Title Font",
        controls: "extended",
    },
    bodyFont: {
        type: ControlType.Font,
        title: "Body Font",
        controls: "extended",
    },
    metaFont: {
        type: ControlType.Font,
        title: "Meta Font",
        controls: "extended",
    },
})
