import { lazy, Suspense, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion"
import { ScrollHero } from "./components/ScrollHero"
import { MediaGallery } from "./components/MediaGallery"
import { InfoGrid } from "./components/InfoGrid"
import { SiteFooter } from "./components/SiteFooter"
import { LogoMark } from "./components/LogoMark"

const ModelShowcase = lazy(async () => {
  const m = await import("./components/ModelShowcase")
  return { default: m.ModelShowcase }
})

function ModelSectionLoader() {
  return (
    <div className="model-section-loader">
      <div className="model-section-loader__shimmer" />
      <style>{`
        .model-section-loader {
          width: min(var(--max), 100%);
          margin: 0 auto;
          padding: var(--page-pad);
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        .model-section-loader__shimmer {
          height: min(72vh, 640px);
          border-radius: var(--radius-xl);
          border: 1px solid var(--line);
          background: linear-gradient(
            105deg,
            var(--surface-2) 0%,
            var(--surface) 50%,
            var(--surface-2) 100%
          );
          background-size: 200% 100%;
          animation: model-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes model-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  )
}

const SIGNALS = [
  { label: "One-handed ergonomics", color: "#1a56ff", border: "rgba(26,86,255,0.35)", bg: "rgba(26,86,255,0.08)", rot: -6 },
  { label: "Split-controller layout", color: "#db2777", border: "rgba(219,39,119,0.35)", bg: "rgba(219,39,119,0.08)", rot: 4 },
  { label: "Accessible play", color: "#059669", border: "rgba(5,150,105,0.35)", bg: "rgba(5,150,105,0.08)", rot: -3 },
  { label: "GNG 2101 · uOttawa", color: "#7c3aed", border: "rgba(124,58,237,0.35)", bg: "rgba(124,58,237,0.08)", rot: 5 },
] as const

function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-strip__inner">
        {SIGNALS.map((item) => (
          <span
            key={item.label}
            className="trust-strip__pill"
            style={{
              color: item.color,
              borderColor: item.border,
              background: item.bg,
              transform: `rotate(${item.rot}deg)`,
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
      <style>{`
        .trust-strip {
          background: var(--surface);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .trust-strip__inner {
          width: min(var(--max-wide), 100%);
          margin: 0 auto;
          padding: 1.35rem var(--page-pad);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.75rem 1rem;
        }
        .trust-strip__pill {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.62rem 1.15rem;
          border-radius: 999px;
          border: 2px solid;
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.85) inset,
            0 10px 24px rgba(13, 13, 13, 0.08);
        }
      `}</style>
    </div>
  )
}

function FloatingPillNav() {
  const { scrollY } = useScroll()
  const [interactive, setInteractive] = useState(false)

  useMotionValueEvent(scrollY, "change", (v) => {
    setInteractive(v > 56)
  })

  const headerOpacity = useTransform(scrollY, [12, 56], [0, 1])
  const headerY = useTransform(scrollY, [12, 56], [-72, 0])

  return (
    <motion.header
      className="float-nav"
      style={{
        opacity: headerOpacity,
        y: headerY,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <div className="float-nav__shell">
        <div className="float-nav__dock">
          <motion.a
            href="#"
            className="float-nav__pill float-nav__pill--brand"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogoMark size={28} className="float-nav__mark" />
            <span>CTRL Sync</span>
          </motion.a>

          <nav className="float-nav__links" aria-label="Primary">
            {(
              [
                ["#prototype", "Prototype"],
                ["#media", "Media"],
                ["#about", "About"],
              ] as const
            ).map(([href, label]) => (
              <motion.a
                key={href}
                href={href}
                className="float-nav__pill float-nav__pill--ghost"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {label}
              </motion.a>
            ))}
          </nav>

          <motion.a
            href="#prototype"
            className="float-nav__pill float-nav__pill--cta"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            View prototype
          </motion.a>
        </div>
      </div>

      <style>{`
        .float-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          padding: 1rem var(--page-pad) 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 100%);
        }
        .float-nav__shell {
          width: max-content;
          max-width: min(920px, calc(100vw - 2 * var(--page-pad)));
          margin: 0 auto;
          padding: 0.42rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(13, 13, 13, 0.07);
          background: linear-gradient(
            165deg,
            rgba(255, 255, 255, 0.92) 0%,
            rgba(248, 250, 252, 0.88) 100%
          );
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.95) inset,
            0 10px 36px rgba(13, 13, 13, 0.1),
            0 3px 12px rgba(13, 13, 13, 0.06);
        }
        .float-nav__dock {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.45rem 0.55rem;
        }
        .float-nav__links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.5rem 0.55rem;
        }
        .float-nav__pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-height: 2.5rem;
          padding: 0.5rem 1.05rem;
          box-sizing: border-box;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-decoration: none !important;
          border: 1px solid rgba(13, 13, 13, 0.08);
          background: linear-gradient(165deg, #ffffff 0%, #f3f4f6 52%, #e8eaee 100%);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.95) inset,
            0 -2px 8px rgba(13, 13, 13, 0.04) inset,
            0 10px 22px rgba(13, 13, 13, 0.09),
            0 3px 8px rgba(26, 86, 255, 0.06);
          color: var(--ink) !important;
          transition: box-shadow 0.2s;
        }
        .float-nav__pill:hover {
          text-decoration: none !important;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 1) inset,
            0 14px 28px rgba(13, 13, 13, 0.11),
            0 4px 12px rgba(26, 86, 255, 0.1);
        }
        .float-nav__pill--brand {
          padding-left: 0.65rem;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          background: linear-gradient(155deg, #18181b 0%, #0a0a0a 55%, #000000 100%);
          color: #fafafa !important;
          border-color: rgba(0, 0, 0, 0.55);
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.12) inset,
            0 -3px 12px rgba(0, 0, 0, 0.35) inset,
            0 12px 28px rgba(0, 0, 0, 0.22);
        }
        .float-nav__pill--brand .float-nav__mark {
          color: #7ee8c6;
        }
        .float-nav__pill--ghost {
          font-weight: 650;
          font-size: 0.8rem;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: var(--muted) !important;
        }
        .float-nav__pill--ghost:hover {
          color: var(--ink) !important;
        }
        .float-nav__pill--cta {
          font-size: 0.78rem;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: var(--font-mono);
          padding: 0.5rem 1.15rem;
          border: none;
          background: linear-gradient(165deg, #3b7dff 0%, #1a56ff 45%, #1546d4 100%);
          color: #fff !important;
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.28) inset,
            0 -2px 10px rgba(0, 35, 120, 0.25) inset,
            0 12px 26px rgba(26, 86, 255, 0.38);
        }
        @media (max-width: 680px) {
          .float-nav__links {
            display: none;
          }
          .float-nav__shell {
            max-width: calc(100vw - 1.75rem);
            padding: 0.38rem 0.45rem;
          }
          .float-nav__dock {
            justify-content: center;
          }
        }
      `}</style>
    </motion.header>
  )
}

function ScrollCue() {
  const { scrollY } = useScroll()
  const cueOpacity = useTransform(scrollY, (v) => {
    let a = 1
    if (v >= 32) a *= Math.max(0, 1 - Math.min(1, (v - 32) / 72))
    if (v >= 360) a *= Math.max(0, 1 - Math.min(1, (v - 360) / 240))
    return a
  })

  return (
    <motion.div className="scroll-cue" style={{ opacity: cueOpacity }}>
      <span className="scroll-cue__label">Scroll</span>
      <motion.span
        className="scroll-cue__chev"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        ↓
      </motion.span>
      <style>{`
        .scroll-cue {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          pointer-events: none;
          font-family: var(--font-mono);
          color: var(--faint);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .scroll-cue__chev {
          font-size: 0.9rem;
          opacity: 0.45;
        }
      `}</style>
    </motion.div>
  )
}

export default function App() {
  return (
    <>
      <FloatingPillNav />
      <main>
        <ScrollHero />
        <TrustStrip />
        <div id="content-start" className="main-content">
          <Suspense fallback={<ModelSectionLoader />}>
            <ModelShowcase />
          </Suspense>
          <MediaGallery />
          <InfoGrid />
        </div>
      </main>
      <SiteFooter />
      <ScrollCue />
    </>
  )
}
