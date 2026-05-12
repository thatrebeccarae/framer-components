// Rolling card stack with 3 cards that reshuffles when a card is selected
import {
    useState,
    startTransition,
    type CSSProperties,
    useEffect,
    useRef,
} from "react"
import { addPropertyControls, ControlType } from "framer"
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
} from "framer-motion"

interface Card {
    title: string
    description: string
    image: {
        src: string
        alt: string
    }
    backgroundColor: string
    borderRadius: number
    shadowColor: string
    shadowBlur: number
    shadowSpread: number
    shadowOffsetX: number
    shadowOffsetY: number
    cardNumber: string
    bulletLists: {
        column1: string[]
        column2: string[]
        column3: string[]
    }
    arrowLink: string
}

interface CardStackProps {
    cards: Card[]
    stackOffset: number
    stackRotation: number
    titleFont: CSSProperties
    descriptionFont: CSSProperties
    bulletFont: CSSProperties
    titleColor: string
    descriptionColor: string
    borderRadius: number
    cardsPerPage: number
    showPagination: boolean
    paginationButtonColor: string
    paginationButtonTextColor: string
    paginationTextColor: string
    enableLoop: boolean
    loopInterval: number
    enableResponsive: boolean
    overflowVisible: boolean
    ctaIcon: "arrow" | "chevron" | "plus" | "none"
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 400
 */
export default function CardStack(props: CardStackProps) {
    const {
        cards = [
            {
                title: "Explore Nature",
                description: "Discover the beauty of natural landscapes",
                image: {
                    src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
                    alt: "Gradient 5 - Green",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "01",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
            {
                title: "Urban Adventures",
                description: "Experience the energy of city life",
                image: {
                    src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
                    alt: "Gradient 4 - Yellow",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "02",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
            {
                title: "Creative Spaces",
                description: "Find inspiration in artistic environments",
                image: {
                    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                    alt: "Gradient 2 - Purple",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "03",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
        ],
        stackOffset = -47,
        stackRotation = 0,
        titleFont = {
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
        descriptionFont = {
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
        bulletFont = {
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: "1.4em",
        },
        titleColor = "#0f0e0e",
        descriptionColor = "#666666",
        borderRadius = 16,
        cardsPerPage = 3,
        showPagination = true,
        paginationButtonColor = "#000000",
        paginationButtonTextColor = "#FFFFFF",
        paginationTextColor = "#000000",
        enableLoop = false,
        loopInterval = 3,
        enableResponsive = true,
        overflowVisible = true,
        ctaIcon = "arrow",
    } = props

    // Base width for scaling calculations (design reference width)
    const BASE_WIDTH = 600

    const [cardOrder, setCardOrder] = useState(() =>
        cards.map((_, index) => index)
    )
    const [containerWidth, setContainerWidth] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [draggedCard, setDraggedCard] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Calculate pagination
    const totalPages = Math.ceil(cards.length / cardsPerPage)
    const startIndex = currentPage * cardsPerPage
    const endIndex = Math.min(startIndex + cardsPerPage, cards.length)
    const currentPageCards = cards.slice(startIndex, endIndex)
    const currentPageIndices = Array.from(
        { length: currentPageCards.length },
        (_, i) => startIndex + i
    )

    // Update card order when page changes
    useEffect(() => {
        startTransition(() => {
            setCardOrder(currentPageIndices)
        })
    }, [currentPage, cardsPerPage, cards.length])

    // Reset to first page if current page is out of bounds
    useEffect(() => {
        if (currentPage >= totalPages && totalPages > 0) {
            startTransition(() => {
                setCurrentPage(0)
            })
        }
    }, [currentPage, totalPages])

    // Auto-loop through cards
    useEffect(() => {
        if (!enableLoop || cardOrder.length <= 1 || draggedCard !== null) return

        const interval = setInterval(() => {
            startTransition(() => {
                setCardOrder((prevOrder) => {
                    const newOrder = [...prevOrder]
                    const firstCard = newOrder.shift()
                    if (firstCard !== undefined) {
                        newOrder.push(firstCard)
                    }
                    return newOrder
                })
            })
        }, loopInterval * 1000)

        return () => clearInterval(interval)
    }, [enableLoop, loopInterval, cardOrder.length, draggedCard])

    // Use ResizeObserver for reliable container measurement
    useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width
                if (width > 0) {
                    startTransition(() => {
                        setContainerWidth(width)
                    })
                }
            }
        })

        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const handleCardClick = (index: number) => {
        const clickedCardPosition = cardOrder.indexOf(index)

        // Front card - no action needed
        if (clickedCardPosition === 0) return

        // Move clicked card to front
        const newOrder = [...cardOrder]
        const [clickedCard] = newOrder.splice(clickedCardPosition, 1)
        newOrder.unshift(clickedCard)

        startTransition(() => {
            setCardOrder(newOrder)
        })
    }

    const handleDragStart = (index: number) => {
        startTransition(() => {
            setDraggedCard(index)
        })
    }

    const handleDragEnd = (index: number, event: any, info: any) => {
        const cardPosition = cardOrder.indexOf(index)
        const dragDistance = Math.sqrt(
            Math.pow(info.offset.x, 2) + Math.pow(info.offset.y, 2)
        )

        // Threshold for drag to trigger reorder
        const DRAG_THRESHOLD = 50

        if (cardPosition === 0) {
            // Front card dragged - send to back if threshold met
            if (dragDistance > DRAG_THRESHOLD) {
                const newOrder = [...cardOrder]
                const [frontCard] = newOrder.splice(0, 1)
                newOrder.push(frontCard)

                startTransition(() => {
                    setCardOrder(newOrder)
                    setDraggedCard(null)
                })
            } else {
                startTransition(() => {
                    setDraggedCard(null)
                })
            }
        } else if (draggedCard === index && dragDistance > DRAG_THRESHOLD) {
            // Non-front card dragged - bring to front if threshold met
            const newOrder = [...cardOrder]
            const [draggedCardIndex] = newOrder.splice(cardPosition, 1)
            newOrder.unshift(draggedCardIndex)

            startTransition(() => {
                setCardOrder(newOrder)
                setDraggedCard(null)
            })
        } else {
            startTransition(() => {
                setDraggedCard(null)
            })
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            startTransition(() => {
                setCurrentPage(currentPage - 1)
            })
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            startTransition(() => {
                setCurrentPage(currentPage + 1)
            })
        }
    }

    // Calculate responsive dimensions based on container width
    const getResponsiveDimensions = () => {
        // Use container width, falling back to BASE_WIDTH if not measured yet
        const width = containerWidth > 0 ? containerWidth : BASE_WIDTH

        // Scale factor relative to design reference
        const scale = enableResponsive ? width / BASE_WIDTH : 1

        return {
            width,
            scale,
        }
    }

    const responsiveDimensions = getResponsiveDimensions()
    const responsiveScale = responsiveDimensions.scale

    // Don't render cards until we have a valid container width
    const shouldRenderCards = containerWidth > 0

    // Helper function to calculate responsive font size
    const getResponsiveFontSize = (
        fontSize: string | number | undefined
    ): string => {
        if (!fontSize) return "16px"

        const fontSizeStr =
            typeof fontSize === "number" ? `${fontSize}px` : fontSize
        const numericValue = parseFloat(fontSizeStr)

        if (isNaN(numericValue)) return "16px"

        const unit = fontSizeStr.replace(/[0-9.-]/g, "") || "px"

        return `${numericValue * responsiveScale}${unit}`
    }

    const getCardStyle = (position: number): CSSProperties => {
        // z-index based on cardsPerPage to support any stack size
        const zIndex = cardsPerPage - position

        return {
            position: "absolute",
            width: responsiveDimensions.width,
            zIndex,
            cursor: "grab",
            WebkitTapHighlightColor: "transparent",
            touchAction: "none",
        }
    }

    const getMotionProps = (position: number) => {
        const offsetY = position * stackOffset * responsiveScale
        const scale = 1 - position * 0.05

        return {
            initial: false,
            animate: {
                y: offsetY,
                scale: scale,
            },
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
            },
            drag: true,
            dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
            dragElastic: 0.2,
            dragTransition: { bounceStiffness: 600, bounceDamping: 20 },
            whileDrag: { scale: scale * 1.05, cursor: "grabbing", zIndex: 999 },
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 370 * responsiveScale,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 20,
                overflow: overflowVisible ? "visible" : "hidden",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: responsiveDimensions.width,
                    minHeight: 350 * responsiveScale,
                    flex: "0 0 auto",
                    overflow: overflowVisible ? "visible" : "hidden",
                    margin: "0 auto",
                }}
            >
                {shouldRenderCards &&
                    cardOrder.map((cardIndex, position) => {
                        if (position >= cardsPerPage) return null
                        const card = cards[cardIndex]
                        return (
                            <motion.div
                                key={cardIndex}
                                style={getCardStyle(position)}
                                {...getMotionProps(position)}
                                onTap={() => handleCardClick(cardIndex)}
                                onDragStart={() => handleDragStart(cardIndex)}
                                onDragEnd={(event, info) =>
                                    handleDragEnd(cardIndex, event, info)
                                }
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius:
                                            (card.borderRadius ||
                                                borderRadius) * responsiveScale,
                                        backgroundColor: card.backgroundColor,
                                        border: `${1 * responsiveScale}px solid ${titleColor}`,
                                        overflow: "visible",
                                        boxShadow: `${(card.shadowOffsetX || 0) * responsiveScale}px ${(card.shadowOffsetY || 4) * responsiveScale}px ${(card.shadowBlur || 20) * responsiveScale}px ${(card.shadowSpread || 0) * responsiveScale}px ${card.shadowColor || "rgba(0, 0, 0, 0.225)"}`,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8 * responsiveScale,
                                            alignItems: "flex-start",
                                            height: "100%",
                                            overflow: "visible",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                                paddingTop:
                                                    10 * responsiveScale,
                                                paddingLeft:
                                                    responsiveDimensions.width *
                                                    0.25,
                                                paddingRight:
                                                    20 * responsiveScale,
                                            }}
                                        >
                                            {card.cardNumber && (
                                                <div
                                                    style={{
                                                        fontSize:
                                                            getResponsiveFontSize(
                                                                typeof titleFont.fontSize ===
                                                                    "number"
                                                                    ? titleFont.fontSize /
                                                                          5.5
                                                                    : parseFloat(
                                                                          titleFont.fontSize ||
                                                                              "22"
                                                                      ) / 5.5
                                                            ),
                                                        fontWeight: 600,
                                                        color: titleColor,
                                                        marginRight:
                                                            8 * responsiveScale,
                                                        userSelect: "none",
                                                        WebkitUserSelect:
                                                            "none",
                                                    }}
                                                >
                                                    {card.cardNumber}
                                                </div>
                                            )}
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: titleColor,
                                                    textAlign: "left",
                                                    userSelect: "none",
                                                    WebkitUserSelect: "none",
                                                    ...titleFont,
                                                    fontSize:
                                                        getResponsiveFontSize(
                                                            titleFont.fontSize
                                                        ),
                                                    lineHeight:
                                                        titleFont.lineHeight,
                                                    letterSpacing:
                                                        titleFont.letterSpacing,
                                                }}
                                            >
                                                {card.title}
                                            </h3>
                                        </div>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: descriptionColor,
                                                paddingLeft:
                                                    20 * responsiveScale,
                                                paddingRight:
                                                    20 * responsiveScale,
                                                paddingTop:
                                                    30 * responsiveScale,
                                                marginBottom:
                                                    10 * responsiveScale,
                                                userSelect: "none",
                                                WebkitUserSelect: "none",
                                                display: "block",
                                                width: "100%",
                                                boxSizing: "border-box",
                                                ...descriptionFont,
                                                fontSize: getResponsiveFontSize(
                                                    descriptionFont.fontSize
                                                ),
                                                lineHeight:
                                                    descriptionFont.lineHeight,
                                                letterSpacing:
                                                    descriptionFont.letterSpacing,
                                            }}
                                        >
                                            {card.description}
                                        </p>
                                        <div
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "100%",
                                                paddingLeft:
                                                    20 * responsiveScale,
                                                paddingRight:
                                                    20 * responsiveScale,
                                                paddingBottom:
                                                    20 * responsiveScale,
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "33%",
                                                    height: 1 * responsiveScale,
                                                    backgroundColor: titleColor,
                                                    marginBottom:
                                                        15 * responsiveScale,
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 16 * responsiveScale,
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                {card.bulletLists && (
                                                    <>
                                                        <ul
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                listStyle:
                                                                    "none",
                                                                color: descriptionColor,
                                                                flex: 1,
                                                                minWidth: 0,
                                                                userSelect:
                                                                    "none",
                                                                WebkitUserSelect:
                                                                    "none",
                                                                wordWrap:
                                                                    "break-word",
                                                                overflowWrap:
                                                                    "break-word",
                                                                ...bulletFont,
                                                                fontSize:
                                                                    getResponsiveFontSize(
                                                                        bulletFont.fontSize
                                                                    ),
                                                                lineHeight:
                                                                    bulletFont.lineHeight,
                                                                letterSpacing:
                                                                    bulletFont.letterSpacing,
                                                            }}
                                                        >
                                                            {card.bulletLists.column1?.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                        <ul
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                listStyle:
                                                                    "none",
                                                                color: descriptionColor,
                                                                flex: 1,
                                                                minWidth: 0,
                                                                userSelect:
                                                                    "none",
                                                                WebkitUserSelect:
                                                                    "none",
                                                                wordWrap:
                                                                    "break-word",
                                                                overflowWrap:
                                                                    "break-word",
                                                                ...bulletFont,
                                                                fontSize:
                                                                    getResponsiveFontSize(
                                                                        bulletFont.fontSize
                                                                    ),
                                                                lineHeight:
                                                                    bulletFont.lineHeight,
                                                                letterSpacing:
                                                                    bulletFont.letterSpacing,
                                                            }}
                                                        >
                                                            {card.bulletLists.column2?.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                gap:
                                                                    8 *
                                                                    responsiveScale,
                                                                flex: 1,
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <ul
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    listStyle:
                                                                        "none",
                                                                    color: descriptionColor,
                                                                    minWidth: 0,
                                                                    userSelect:
                                                                        "none",
                                                                    WebkitUserSelect:
                                                                        "none",
                                                                    wordWrap:
                                                                        "break-word",
                                                                    overflowWrap:
                                                                        "break-word",
                                                                    ...bulletFont,
                                                                    fontSize:
                                                                        getResponsiveFontSize(
                                                                            bulletFont.fontSize
                                                                        ),
                                                                    lineHeight:
                                                                        bulletFont.lineHeight,
                                                                    letterSpacing:
                                                                        bulletFont.letterSpacing,
                                                                }}
                                                            >
                                                                {card.bulletLists.column3?.map(
                                                                    (
                                                                        item,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                            {ctaIcon !== "none" && (
                                                                <a
                                                                    href={
                                                                        card.arrowLink ||
                                                                        "#"
                                                                    }
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        marginTop:
                                                                            4 *
                                                                            responsiveScale,
                                                                        textDecoration:
                                                                            "none",
                                                                        color: titleColor,
                                                                    }}
                                                                >
                                                                    {ctaIcon === "arrow" && (
                                                                        <svg
                                                                            width={24 * responsiveScale}
                                                                            height={24 * responsiveScale}
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M5 12h14M13 6l6 6-6 6"
                                                                                stroke={titleColor}
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                    {ctaIcon === "chevron" && (
                                                                        <svg
                                                                            width={24 * responsiveScale}
                                                                            height={24 * responsiveScale}
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M9 6l6 6-6 6"
                                                                                stroke={titleColor}
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                    {ctaIcon === "plus" && (
                                                                        <svg
                                                                            width={24 * responsiveScale}
                                                                            height={24 * responsiveScale}
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M12 5v14M5 12h14"
                                                                                stroke={titleColor}
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
            </div>

            {showPagination && totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16 * responsiveScale,
                        padding: `${12 * responsiveScale}px ${20 * responsiveScale}px`,
                        borderRadius: 8 * responsiveScale,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        style={{
                            padding: `${8 * responsiveScale}px ${16 * responsiveScale}px`,
                            borderRadius: 6 * responsiveScale,
                            border: "none",
                            backgroundColor:
                                currentPage === 0
                                    ? "#CCCCCC"
                                    : paginationButtonColor,
                            color: paginationButtonTextColor,
                            cursor:
                                currentPage === 0 ? "not-allowed" : "pointer",
                            fontSize: getResponsiveFontSize(14),
                            fontWeight: 600,
                            opacity: currentPage === 0 ? 0.5 : 1,
                            transition: "opacity 0.2s",
                        }}
                    >
                        Previous
                    </button>

                    <span
                        style={{
                            fontSize: getResponsiveFontSize(14),
                            fontWeight: 500,
                            color: paginationTextColor,
                            minWidth: 80 * responsiveScale,
                            textAlign: "center",
                        }}
                    >
                        Page {currentPage + 1} of {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        style={{
                            padding: `${8 * responsiveScale}px ${16 * responsiveScale}px`,
                            borderRadius: 6 * responsiveScale,
                            border: "none",
                            backgroundColor:
                                currentPage === totalPages - 1
                                    ? "#CCCCCC"
                                    : paginationButtonColor,
                            color: paginationButtonTextColor,
                            cursor:
                                currentPage === totalPages - 1
                                    ? "not-allowed"
                                    : "pointer",
                            fontSize: getResponsiveFontSize(14),
                            fontWeight: 600,
                            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                            transition: "opacity 0.2s",
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

addPropertyControls(CardStack, {
    enableResponsive: {
        type: ControlType.Boolean,
        title: "Responsive",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    overflowVisible: {
        type: ControlType.Boolean,
        title: "Overflow",
        defaultValue: true,
        enabledTitle: "Visible",
        disabledTitle: "Hidden",
    },
    cards: {
        type: ControlType.Array,
        title: "Cards",
        control: {
            type: ControlType.Object,
            controls: {
                cardNumber: {
                    type: ControlType.String,
                    title: "Card Number",
                    defaultValue: "01",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Card Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Card description text",
                    displayTextArea: true,
                },
                image: {
                    type: ControlType.ResponsiveImage,
                    title: "Image",
                },
                bulletLists: {
                    type: ControlType.Object,
                    title: "Bullet Lists",
                    controls: {
                        column1: {
                            type: ControlType.Array,
                            title: "Column 1",
                            control: {
                                type: ControlType.String,
                            },
                            defaultValue: ["Item 1", "Item 2", "Item 3"],
                            maxCount: 5,
                        },
                        column2: {
                            type: ControlType.Array,
                            title: "Column 2",
                            control: {
                                type: ControlType.String,
                            },
                            defaultValue: ["Item 1", "Item 2", "Item 3"],
                            maxCount: 5,
                        },
                        column3: {
                            type: ControlType.Array,
                            title: "Column 3",
                            control: {
                                type: ControlType.String,
                            },
                            defaultValue: ["Item 1", "Item 2", "Item 3"],
                            maxCount: 3,
                        },
                    },
                },
                arrowLink: {
                    type: ControlType.Link,
                    title: "Arrow Link",
                    defaultValue: "#",
                },
                backgroundColor: {
                    type: ControlType.Color,
                    title: "Background",
                    defaultValue: "#FFFFE3",
                },
                borderRadius: {
                    type: ControlType.Number,
                    title: "Corner Radius",
                    defaultValue: 16,
                    min: 0,
                    max: 50,
                    step: 1,
                    unit: "px",
                },
                shadowColor: {
                    type: ControlType.Color,
                    title: "Shadow Color",
                    defaultValue: "rgba(0, 0, 0, 0.225)",
                },
                shadowBlur: {
                    type: ControlType.Number,
                    title: "Shadow Blur",
                    defaultValue: 20,
                    min: 0,
                    max: 100,
                    step: 1,
                    unit: "px",
                },
                shadowSpread: {
                    type: ControlType.Number,
                    title: "Shadow Spread",
                    defaultValue: 0,
                    min: -50,
                    max: 50,
                    step: 1,
                    unit: "px",
                },
                shadowOffsetX: {
                    type: ControlType.Number,
                    title: "Shadow Offset X",
                    defaultValue: 0,
                    min: -50,
                    max: 50,
                    step: 1,
                    unit: "px",
                },
                shadowOffsetY: {
                    type: ControlType.Number,
                    title: "Shadow Offset Y",
                    defaultValue: 4,
                    min: -50,
                    max: 50,
                    step: 1,
                    unit: "px",
                },
            },
        },
        defaultValue: [
            {
                title: "Explore Nature",
                description: "Discover the beauty of natural landscapes",
                image: {
                    src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
                    alt: "Gradient 5 - Green",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "01",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
            {
                title: "Urban Adventures",
                description: "Experience the energy of city life",
                image: {
                    src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
                    alt: "Gradient 4 - Yellow",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "02",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
            {
                title: "Creative Spaces",
                description: "Find inspiration in artistic environments",
                image: {
                    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                    alt: "Gradient 2 - Purple",
                },
                backgroundColor: "#FFFFE3",
                borderRadius: 16,
                shadowColor: "rgba(0, 0, 0, 0.225)",
                shadowBlur: 20,
                shadowSpread: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                cardNumber: "03",
                bulletLists: {
                    column1: ["Item 1", "Item 2", "Item 3"],
                    column2: ["Item 1", "Item 2", "Item 3"],
                    column3: ["Item 1", "Item 2", "Item 3"],
                },
                arrowLink: "#",
            },
        ],
    },
    cardsPerPage: {
        type: ControlType.Number,
        title: "Cards Per Page",
        defaultValue: 3,
        min: 1,
        max: 20,
        step: 1,
    },
    showPagination: {
        type: ControlType.Boolean,
        title: "Show Pagination",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    paginationButtonColor: {
        type: ControlType.Color,
        title: "Button Color",
        defaultValue: "#000000",
        hidden: ({ showPagination }) => !showPagination,
    },
    paginationButtonTextColor: {
        type: ControlType.Color,
        title: "Button Text Color",
        defaultValue: "#FFFFFF",
        hidden: ({ showPagination }) => !showPagination,
    },
    paginationTextColor: {
        type: ControlType.Color,
        title: "Page Text Color",
        defaultValue: "#000000",
        hidden: ({ showPagination }) => !showPagination,
    },
    titleFont: {
        type: ControlType.Font,
        title: "Title Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "26px",
            variant: "Semibold",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    descriptionFont: {
        type: ControlType.Font,
        title: "Description Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "17px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
    bulletFont: {
        type: ControlType.Font,
        title: "Bullet Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "13px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.4em",
        },
    },
    ctaIcon: {
        type: ControlType.Enum,
        title: "CTA Icon",
        options: ["arrow", "chevron", "plus", "none"],
        optionTitles: ["Arrow", "Chevron", "Plus", "None"],
        defaultValue: "arrow",
        displaySegmentedControl: true,
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: "#0f0e0e",
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Description Color",
        defaultValue: "#666666",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 16,
        min: 0,
        max: 50,
        step: 1,
        unit: "px",
    },
    enableLoop: {
        type: ControlType.Boolean,
        title: "Auto Loop",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    loopInterval: {
        type: ControlType.Number,
        title: "Loop Interval",
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 0.5,
        unit: "s",
        hidden: ({ enableLoop }) => !enableLoop,
    },
})