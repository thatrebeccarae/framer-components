import { useEffect } from "react"

/**
 * FluidTypography - Injects global CSS for fluid typography
 * Add this component to your Framer page (it renders nothing visible)
 * 
 * Usage: Drop this component anywhere on your page
 */
export default function FluidTypography() {
    useEffect(() => {
        const styleId = "fluid-typography-styles"
        
        // Don't add duplicate styles
        if (document.getElementById(styleId)) return
        
        const style = document.createElement("style")
        style.id = styleId
        style.textContent = `
:root{--dw:1440}
*{font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;box-sizing:border-box}
h1,.h1,h2,.h2,h3,.h3,h4,.h4,h5,.h5,h6,.h6,.h7{margin:0 0 .2em;text-wrap:balance;font-weight:400}

h1,.h1{--min:38;--base:80;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.04em;line-height:.9}
h2,.h2{--min:34;--base:48;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.04em;line-height:1}
h3,.h3{--min:30;--base:40;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.04em;line-height:1.1}
h4,.h4{--min:26;--base:32;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.04em;line-height:1.1}
h5,.h5{--min:20;--base:24;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.01em;line-height:1.1;text-transform:uppercase}
h6,.h6{--min:16;--base:18;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.02em;line-height:1.2}
.h7{--min:14;--base:16;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:-.01em;line-height:1.3}

p,.body,.p,li{--min:13;--base:14;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.5;font-weight:400;margin:0 0 .75em}
.body-large,.lede{--min:16;--base:18;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.4;letter-spacing:-.02em}
.body-small,.small{--min:12;--base:12;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.5}

a{text-decoration:underline;text-underline-offset:.15em;text-decoration-thickness:1px;transition:opacity .2s ease}
a:hover{opacity:.7}

.caption,figcaption,label{--min:12;--base:12;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.4;margin:0}
.meta,.utility{--min:10;--base:12;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:.05em;line-height:1.4;text-transform:uppercase}
.meta-sm{--min:8;--base:10;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;letter-spacing:.05em;line-height:1.4;text-transform:uppercase}

blockquote{--min:20;--base:24;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.3;letter-spacing:-.01em;font-style:italic;margin:1.5em 0;padding-left:1.25em;border-left:3px solid currentColor}
blockquote p{font-size:inherit!important;margin-bottom:.5em}

ul,ol{--min:13;--base:14;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.5;margin:0 0 1.5em;padding-left:1.5em}
li{margin-bottom:.5em}

hr{border:none;border-top:1px solid currentColor;opacity:.2;margin:2.5em 0}
strong{font-weight:600}
em{font-style:italic}

.card-title{--min:16;--base:18;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.2;letter-spacing:-.02em}
.sidebar-title{--min:14;--base:16;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important;line-height:1.25;letter-spacing:-.01em}

/* Framer overrides */
[class*="framer-"] p{--min:13;--base:14;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important}
[data-framer-name="Sidebar"] p{--min:8;--base:10;font-size:max(calc(var(--min)*1px),calc((var(--base)/var(--dw))*100vw))!important}
[data-framer-name="Logo Carousel"]{transform:scale(max(0.5,calc(100vw/1440)));transform-origin:center center}

@media(max-width:768px){
h1,.h1,h2,.h2{margin-bottom:.3em}
blockquote{padding-left:1em;margin:1.25em 0}
}
        `
        document.head.appendChild(style)
        
        return () => {
            const existingStyle = document.getElementById(styleId)
            if (existingStyle) existingStyle.remove()
        }
    }, [])
    
    return null
}
