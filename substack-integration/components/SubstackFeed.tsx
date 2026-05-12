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

type HeaderIconKind = "substack" | "email" | "link" | "none"

interface SubstackFeedProps {
    proxyUrl: string
    section: string
    excludeSections: string
    tagFilter: string
    layout: "list" | "grid" | "cards" | "carousel"
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
    // Carousel-only
    showHeader: boolean
    headerTitle: string
    headerLink: string
    headerFont: CSSProperties
    headerIcon: HeaderIconKind
    cardWidth: number
    cardImageRadius: number
    containerBorderColor: string
    showEndCard: boolean
    endCardLink: string
    endCardLabel: string
    endCardSubtitle: string
    endCardCta: string
    endCardBackground: string
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

function SubstackGlyph({ color, size = 16 }: { color: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            style={{ flexShrink: 0, display: "block" }}
        >
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
    )
}

function EmailGlyph({ color, size = 16 }: { color: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, display: "block" }}
        >
            <rect x="2.5" y="5" width="19" height="14" rx="2" />
            <polyline points="3,7 12,13 21,7" />
        </svg>
    )
}

function LinkGlyph({ color, size = 16 }: { color: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, display: "block" }}
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}

function ExternalArrowIcon({ color, size = 14, strokeWidth = 2 }: { color: string; size?: number; strokeWidth?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, display: "block" }}
        >
            <path d="M7 17L17 7" />
            <polyline points="8 7 17 7 17 16" />
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
        .replace(/&#8216;/g, "‘")
        .replace(/&#8217;/g, "’")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
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

// Header default — matches the Inter-SemiBold rhythm used by LinkCard labels
// and ImageGallery's "From Instagram" header on /links. Override per-instance
// via the `headerFont` property control.
const HEADER_FONT_DEFAULTS: CSSProperties = {
    fontFamily: 'Inter, "Helvetica Neue", system-ui, sans-serif',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "1em",
    letterSpacing: "-0.01em",
}

// Editorial type defaults for the carousel layout — leans on the project's
// PP Editorial New (serif) + Cartograph CF (mono) + Switzer (sans) faces.
const CAROUSEL_TITLE_DEFAULTS: CSSProperties = {
    fontFamily: '"PP Editorial New", "Times New Roman", Georgia, serif',
    fontWeight: 200,
    fontSize: 17,
    lineHeight: "1.2em",
    letterSpacing: "-0.01em",
}

const CAROUSEL_META_DEFAULTS: CSSProperties = {
    fontFamily: '"Cartograph CF", "SF Mono", ui-monospace, monospace',
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
}

const ENDCARD_HERO_DEFAULTS: CSSProperties = {
    fontFamily: '"PP Editorial New", "Times New Roman", Georgia, serif',
    fontWeight: 200,
    fontSize: 26,
    lineHeight: "1em",
    letterSpacing: "-0.02em",
}

const ENDCARD_SUBTITLE_DEFAULTS: CSSProperties = {
    fontFamily: 'Switzer, "Helvetica Neue", system-ui, sans-serif',
    fontWeight: 500,
    fontSize: 11,
    lineHeight: "1.35em",
    letterSpacing: "-0.005em",
}

const ENDCARD_PILL_DEFAULTS: CSSProperties = {
    fontFamily: '"Cartograph CF", "SF Mono", ui-monospace, monospace',
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
}

// Mock data shown in editor canvas / static export when real fetch isn't available.
const PREVIEW_POSTS: Array<{ date: string; title: string }> = [
    { date: "May 5, 2026", title: "The Marketing Seat That Survives" },
    { date: "Apr 30, 2026", title: "Claude Design: the complete guide to real work" },
    { date: "Apr 23, 2026", title: "The Marketing Layer for AI" },
    { date: "Apr 16, 2026", title: "Why Strategy Beats Tactics Every Quarter" },
    { date: "Apr 9, 2026", title: "I Rebuilt My Professional Brand for AI. It Cost $0." },
    { date: "Apr 2, 2026", title: "ROAS Is A Lie You Pay For" },
]

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
        showHeader = true,
        headerTitle = "From the Substack",
        headerLink = "",
        headerFont,
        headerIcon = "substack",
        cardWidth = 200,
        cardImageRadius = 8,
        containerBorderColor = "",
        showEndCard = false,
        endCardLink = "",
        endCardLabel = "",
        endCardSubtitle = "",
        endCardCta = "Check it out",
        endCardBackground = "rgb(0, 0, 0)",
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

    const effectiveLayout = layout === "carousel"
        ? "carousel"
        : isPhone && layout === "grid"
        ? ("cards" as const)
        : layout
    const effectiveColumns = isPhone ? 1 : isTablet ? Math.min(gridColumns, 2) : gridColumns
    const effectiveGap = isPhone && effectiveLayout === "cards" ? Math.max(gap, 32) : gap
    const effectiveListImageWidth = isPhone ? Math.min(listImageWidth, 100) : isTablet ? Math.min(listImageWidth, 180) : listImageWidth

    const sectionMode = Boolean(section)

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

    // Returns the SVG glyph for the chosen header icon. "none" returns null
    // so the caller can skip rendering the icon circle entirely.
    const renderHeaderGlyph = (): React.ReactNode => {
        switch (headerIcon) {
            case "email":
                return <EmailGlyph color={textColor} size={16} />
            case "link":
                return <LinkGlyph color={textColor} size={16} />
            case "none":
                return null
            case "substack":
            default:
                return <SubstackGlyph color={textColor} size={16} />
        }
    }

    // -------------------- CAROUSEL: header + horizontal scroll cards --------------------
    const renderCarousel = (children: React.ReactNode) => {
        const headerNode = showHeader ? (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 16px 0 16px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {headerIcon !== "none" && (
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 20,
                            border: `1px solid ${textColor}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {renderHeaderGlyph()}
                    </div>
                )}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        color: textColor,
                        ...HEADER_FONT_DEFAULTS,
                        ...headerFont,
                    }}
                >
                    {headerTitle}
                </div>
                {headerLink ? (
                    <a
                        href={headerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: textColor,
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                            transition: "opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                        aria-label="See all"
                    >
                        <ExternalArrowIcon color="currentColor" size={14} />
                    </a>
                ) : null}
            </div>
        ) : null

        const hasBorder = Boolean(
            containerBorderColor &&
            containerBorderColor !== "transparent" &&
            !/rgba\([^)]*,\s*0\s*\)/.test(containerBorderColor)
        )

        return (
            <div ref={ref} style={wrapperStyle}>
                <div
                    style={{
                        width: "100%",
                        background: backgroundColor,
                        borderRadius,
                        border: hasBorder ? `1px solid ${containerBorderColor}` : "none",
                        padding: "0 0 16px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        boxSizing: "border-box",
                        overflow: "hidden",
                    }}
                >
                    {headerNode}
                    <div
                        className="substack-carousel-track"
                        style={{
                            width: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "stretch",
                            gap,
                            padding: "0 16px 0 16px",
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {children}
                    </div>
                </div>
                <style>{`
                    .substack-carousel-track::-webkit-scrollbar { display: none; }
                    .substack-end-card:hover .substack-end-pill {
                        transform: translateY(-1px);
                    }
                `}</style>
            </div>
        )
    }

    // End-CTA card — centered brand panel.
    const renderEndCard = () => {
        if (!showEndCard || !endCardLink) return null
        const pillTextColor = endCardBackground && endCardBackground !== "transparent" && !/rgba\([^)]*,\s*0\s*\)/.test(endCardBackground)
            ? endCardBackground
            : "rgb(15, 14, 14)"
        return (
            <a
                key="__end-card__"
                className="substack-end-card"
                href={endCardLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: cardWidth,
                    flexShrink: 0,
                    background: endCardBackground,
                    borderRadius: cardImageRadius,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "24px 16px",
                    gap: 14,
                    boxSizing: "border-box",
                    transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ""
                }}
            >
                {endCardLabel && (
                    <div
                        style={{
                            color: textColor,
                            ...ENDCARD_HERO_DEFAULTS,
                        }}
                    >
                        {endCardLabel}
                    </div>
                )}
                {endCardSubtitle && (
                    <div
                        style={{
                            color: textColor,
                            ...ENDCARD_SUBTITLE_DEFAULTS,
                            maxWidth: "100%",
                        }}
                    >
                        {endCardSubtitle}
                    </div>
                )}
                {endCardCta && (
                    <div
                        className="substack-end-pill"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: textColor,
                            color: pillTextColor,
                            padding: "8px 14px",
                            borderRadius: 999,
                            marginTop: 4,
                            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            ...ENDCARD_PILL_DEFAULTS,
                        }}
                    >
                        {endCardCta}
                        <ExternalArrowIcon color={pillTextColor} size={11} strokeWidth={2.25} />
                    </div>
                )}
            </a>
        )
    }

    const renderCarouselCard = (
        key: string,
        link: string,
        image: string | undefined,
        date: string,
        title: string
    ) => (
        <a
            key={key}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                textDecoration: "none",
                color: "inherit",
                width: cardWidth,
                flexShrink: 0,
                background: cardBackground,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = ""
            }}
        >
            {showImages && (
                image ? (
                    <img
                        src={image}
                        alt=""
                        style={{
                            width: "100%",
                            aspectRatio: imageAspectRatio,
                            objectFit: "cover",
                            borderRadius: cardImageRadius,
                            display: "block",
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: imageAspectRatio,
                            background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
                            borderRadius: cardImageRadius,
                            flexShrink: 0,
                        }}
                    />
                )
            )}
            <div style={{ padding: "14px 0 0 0", display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
                {showDate && date && (
                    <span
                        style={{
                            color: secondaryTextColor,
                            ...CAROUSEL_META_DEFAULTS,
                            ...metaFont,
                        }}
                    >
                        {date}
                    </span>
                )}
                <h3
                    style={{
                        margin: 0,
                        color: textColor,
                        ...CAROUSEL_TITLE_DEFAULTS,
                        ...titleFont,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {decodeEntities(title)}
                </h3>
            </div>
        </a>
    )

    if (isStatic) {
        if (effectiveLayout === "carousel") {
            const previewCount = Math.min(maxPosts, PREVIEW_POSTS.length)
            return renderCarousel(
                <>
                    {PREVIEW_POSTS.slice(0, previewCount).map((post, i) =>
                        renderCarouselCard(`preview-${i}`, "#", undefined, post.date, post.title)
                    )}
                    {renderEndCard()}
                </>
            )
        }
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
        if (effectiveLayout === "carousel") {
            return renderCarousel(
                <>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: cardWidth,
                                flexShrink: 0,
                                background: cardBackground,
                                display: "flex",
                                flexDirection: "column",
                                animation: "pulse 1.5s ease-in-out infinite",
                            }}
                        >
                            <div style={{ width: "100%", aspectRatio: imageAspectRatio, background: "rgba(255,255,255,0.08)", borderRadius: cardImageRadius }} />
                            <div style={{ padding: "14px 0 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ height: 10, width: "50%", background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                                <div style={{ height: 18, width: "85%", background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
                            </div>
                            <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
                        </div>
                    ))}
                </>
            )
        }
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

    if (effectiveLayout === "carousel") {
        return renderCarousel(
            <>
                {visiblePosts.map((post, i) =>
                    renderCarouselCard(
                        `${post.link}-${i}`,
                        post.link,
                        post.image,
                        formatDate(post.pubDate),
                        post.title
                    )
                )}
                {renderEndCard()}
            </>
        )
    }

    // -------------------- LIST / GRID / CARDS render --------------------
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
                    a:hover .read-more-cta { opacity: 1; color: #F9F2E6; }
                    a:hover .read-more-cta svg { stroke: #F9F2E6; }
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
        options: ["list", "grid", "cards", "carousel"],
        optionTitles: ["List", "Grid", "Cards", "Carousel"],
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
        hidden: (props) => props.layout === "carousel",
    },
    loadMoreIncrement: {
        type: ControlType.Number,
        title: "Per Page",
        defaultValue: 6,
        min: 1,
        max: 50,
        step: 1,
        hidden: (props) => !props.showLoadMore || props.layout === "carousel",
        description: "Posts fetched per Load More click",
    },
    loadMoreText: {
        type: ControlType.String,
        title: "Load More Text",
        defaultValue: "LOAD MORE",
        hidden: (props) => !props.showLoadMore || props.layout === "carousel",
    },
    gridColumns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 2,
        min: 1,
        max: 4,
        step: 1,
        hidden: (props) => props.layout === "list" || props.layout === "carousel",
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
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        defaultValue: 200,
        min: 120,
        max: 400,
        step: 10,
        unit: "px",
        hidden: (props) => props.layout !== "carousel",
    },
    cardImageRadius: {
        type: ControlType.Number,
        title: "Image Radius",
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 1,
        unit: "px",
        hidden: (props) => props.layout !== "carousel",
    },
    containerBorderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "",
        description: "Stroke around the carousel container (leave blank for no border)",
        hidden: (props) => props.layout !== "carousel",
    },
    showHeader: {
        type: ControlType.Boolean,
        title: "Header",
        defaultValue: true,
        hidden: (props) => props.layout !== "carousel",
    },
    headerTitle: {
        type: ControlType.String,
        title: "Header Title",
        defaultValue: "From the Substack",
        hidden: (props) => props.layout !== "carousel" || !props.showHeader,
    },
    headerIcon: {
        type: ControlType.Enum,
        title: "Header Icon",
        options: ["substack", "email", "link", "none"],
        optionTitles: ["Substack", "Email", "Link", "None"],
        defaultValue: "substack",
        hidden: (props) => props.layout !== "carousel" || !props.showHeader,
    },
    headerFont: {
        type: ControlType.Font,
        title: "Header Font",
        controls: "extended",
        hidden: (props) => props.layout !== "carousel" || !props.showHeader,
    },
    headerLink: {
        type: ControlType.String,
        title: "Header Link",
        defaultValue: "",
        description: "Optional URL for top-right arrow",
        hidden: (props) => props.layout !== "carousel" || !props.showHeader,
    },
    showEndCard: {
        type: ControlType.Boolean,
        title: "End Card",
        defaultValue: false,
        hidden: (props) => props.layout !== "carousel",
    },
    endCardLink: {
        type: ControlType.String,
        title: "End Link",
        defaultValue: "",
        description: "Destination for the end-of-carousel CTA card",
        hidden: (props) => props.layout !== "carousel" || !props.showEndCard,
    },
    endCardLabel: {
        type: ControlType.String,
        title: "End Hero",
        defaultValue: "",
        description: "Large serif headline (e.g., the publication name)",
        hidden: (props) => props.layout !== "carousel" || !props.showEndCard,
    },
    endCardSubtitle: {
        type: ControlType.String,
        title: "End Subtitle",
        defaultValue: "",
        description: "Small sans-serif description below the hero",
        hidden: (props) => props.layout !== "carousel" || !props.showEndCard,
    },
    endCardCta: {
        type: ControlType.String,
        title: "End CTA",
        defaultValue: "Check it out",
        description: "Pill button text (rendered uppercase)",
        hidden: (props) => props.layout !== "carousel" || !props.showEndCard,
    },
    endCardBackground: {
        type: ControlType.Color,
        title: "End BG",
        defaultValue: "rgb(0, 0, 0)",
        hidden: (props) => props.layout !== "carousel" || !props.showEndCard,
    },
    showExcerpt: {
        type: ControlType.Boolean,
        title: "Excerpt",
        defaultValue: true,
        hidden: (props) => props.layout === "carousel",
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
        hidden: (props) => props.layout === "carousel",
    },
    readMoreText: {
        type: ControlType.String,
        title: "Read More Text",
        defaultValue: "READ MORE",
        hidden: (props) => !props.showReadMore || props.layout === "carousel",
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
