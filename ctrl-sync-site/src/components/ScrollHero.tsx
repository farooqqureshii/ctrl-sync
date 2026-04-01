import { useRef, useState, useLayoutEffect, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion"
import { PillCrosshair } from "./PillCrosshair"

/** Sits below the eyebrow line so it never collides with the subtitle or scatter pills. */
const EYEBROW_ACCESSIBILITY_PILL = {
  light: "#ede9fe",
  mid: "#c4b5fd",
  dark: "#7c3aed",
  text: "#1e0b38",
} as const

const HERO_PILLS = [
  {
    label: "Split pads",
    light: "#dbeafe",
    mid: "#93c5fd",
    dark: "#3b82f6",
    text: "#0c1e3e",
    ox: -448,
    oy: -208,
    rot: -12,
  },
  {
    label: "One-hand",
    light: "#fce7f3",
    mid: "#f9a8d4",
    dark: "#db2777",
    text: "#4a0d26",
    ox: 498,
    oy: -200,
    rot: 9,
  },
  {
    label: "uOttawa",
    light: "#d1fae5",
    mid: "#6ee7b7",
    dark: "#059669",
    text: "#022c22",
    ox: -462,
    oy: 228,
    rot: -8,
  },
  {
    label: "GNG 2101",
    light: "#ffedd5",
    mid: "#fdba74",
    dark: "#ea580c",
    text: "#431407",
    ox: 458,
    oy: 222,
    rot: 11,
  },
] as const

/**
 * Maps physical hero scroll → animation timeline.
 * The first ~3–4% of progress is stretched to cover “line 1 → line 2”, so right after
 * the fixed nav finishes settling (~80–100px doc scroll), the next hero beat is in range.
 */
function compressHeroProgress(u: number): number {
  if (u <= 0) return 0
  if (u >= 1) return 1
  const earlyPortion = 0.032
  const earlyMapped = 0.47
  if (u <= earlyPortion) return (u / earlyPortion) * earlyMapped
  return earlyMapped + ((u - earlyPortion) / (1 - earlyPortion)) * (1 - earlyMapped)
}

const LINE1_WORD_MOTION = [
  { y: 56, rot: -7, blur: 10 },
  { y: 44, rot: 5, blur: 8 },
  { y: 52, rot: -4, blur: 9 },
  { y: 48, rot: 6, blur: 7 },
  { y: 40, rot: -3, blur: 6 },
] as const

const GRID_PLUSES = [
  { top: "6%", left: "5%", c: "#a78bfa", s: 16, rot: 0 },
  { top: "12%", left: "92%", c: "#fb923c", s: 14, rot: 12 },
  { top: "52%", left: "3%", c: "#f472b6", s: 13, rot: -8 },
  { top: "72%", right: "4%", left: "auto", c: "#38bdf8", s: 15, rot: 6 },
  { top: "36%", left: "48%", c: "#34d399", s: 12, rot: -4 },
  { top: "90%", left: "50%", c: "#fbbf24", s: 14, rot: 0 },
] as const

function GridPlus({ c, s, rot }: { c: string; s: number; rot: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ color: c, transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ScrollHero() {
  const ref = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 420,
    damping: 44,
    mass: 0.18,
  })

  const heroDrive = useTransform(smooth, compressHeroProgress)

  const syncPhase = useCallback((v: number) => {
    let next = 0
    if (v < 0.38) next = 0
    else if (v < 0.72) next = 1
    else next = 2
    setPhase((p) => (p !== next ? next : p))
  }, [])

  useLayoutEffect(() => {
    syncPhase(heroDrive.get())
  }, [heroDrive, syncPhase])

  useMotionValueEvent(heroDrive, "change", syncPhase)

  const bg1 = useTransform(heroDrive, [0, 0.42], [1, 0])
  const bg2 = useTransform(heroDrive, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0])
  const bg3 = useTransform(heroDrive, [0.62, 0.78], [0, 1])

  const line1 = useTransform(heroDrive, [0, 0.34, 0.42], [1, 1, 0])
  const line2 = useTransform(heroDrive, [0.36, 0.44, 0.68, 0.76], [0, 1, 1, 0])
  const line3 = useTransform(heroDrive, [0.68, 0.78, 1], [0, 1, 1])

  const line1Blur = useTransform(heroDrive, [0.3, 0.42], [0, 8])
  const line1Filter = useTransform(line1Blur, (b) => `blur(${b}px)`)
  const line1Scale = useTransform(heroDrive, [0, 0.18, 0.32], [0.86, 1.04, 1])
  const line2Y = useTransform(heroDrive, [0.38, 0.5], [40, 0])
  const line2Skew = useTransform(heroDrive, [0.38, 0.55], [8, 0])
  const line3Scale = useTransform(heroDrive, [0.7, 0.9], [0.9, 1])

  const gamingClip = useTransform(
    heroDrive,
    [0.42, 0.58],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  )

  const reticleA = useTransform(heroDrive, [0, 1], [0, 72])
  const reticleB = useTransform(heroDrive, [0, 1], [0, -108])
  const reticleC = useTransform(heroDrive, [0, 1], [0, 54])
  const reticleD = useTransform(heroDrive, [0, 1], [0, -84])

  const blobX = useTransform(heroDrive, [0, 0.5, 1], ["-5%", "8%", "3%"])
  const blobY = useTransform(heroDrive, [0, 0.5, 1], ["10%", "60%", "85%"])

  const chars = "adaptive".split("")
  const line1Words = ["What", "if", "there", "was", "a"]

  return (
    <section ref={ref} className="scroll-hero" aria-label="Introduction">
      <div className="scroll-hero__sticky" data-phase={phase}>
        <motion.div className="scroll-hero__bg scroll-hero__bg--1" style={{ opacity: bg1 }} />
        <motion.div className="scroll-hero__bg scroll-hero__bg--2" style={{ opacity: bg2 }} />
        <motion.div className="scroll-hero__bg scroll-hero__bg--3" style={{ opacity: bg3 }} />

        <motion.div className="scroll-hero__blob scroll-hero__blob--1" style={{ left: blobX, top: blobY }} aria-hidden />
        <motion.div className="scroll-hero__blob scroll-hero__blob--2" aria-hidden />

        <div className="scroll-hero__grid" aria-hidden />

        <div className="hero-grid-pluses" aria-hidden>
          {GRID_PLUSES.map((p, i) => (
            <motion.span
              key={i}
              className="hero-grid-pluses__mark"
              style={{
                top: p.top,
                left: "left" in p ? p.left : "auto",
                right: "right" in p ? p.right : "auto",
              }}
              animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.08, 1] }}
              transition={{
                duration: 3.2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <GridPlus c={p.c} s={p.s} rot={p.rot} />
            </motion.span>
          ))}
        </div>

        <div className="hero-reticles" aria-hidden>
          <motion.div className="hero-reticles__item hero-reticles__item--tl" style={{ rotate: reticleA }}>
            <PillCrosshair
              size={44}
              color={phase === 2 ? "rgba(255,255,255,0.22)" : "rgba(13,13,13,0.2)"}
            />
          </motion.div>
          <motion.div className="hero-reticles__item hero-reticles__item--tr" style={{ rotate: reticleB }}>
            <PillCrosshair size={56} color="rgba(26,86,255,0.36)" />
          </motion.div>
          <motion.div className="hero-reticles__item hero-reticles__item--bl" style={{ rotate: reticleC }}>
            <PillCrosshair size={38} color="rgba(219,39,119,0.34)" />
          </motion.div>
          <motion.div className="hero-reticles__item hero-reticles__item--br" style={{ rotate: reticleD }}>
            <PillCrosshair size={52} color="rgba(5,150,105,0.32)" />
          </motion.div>
          <motion.div className="hero-reticles__item hero-reticles__item--c" style={{ rotate: reticleB }}>
            <PillCrosshair size={34} color="rgba(217,119,6,0.38)" />
          </motion.div>
        </div>

        <div className="scroll-hero__content">
          <div className="hero-stack">
            <div className="hero-stack__center">
              <div className="hero-stack__stage">
              <motion.div className="hero-pills" style={{ opacity: line1 }}>
                {HERO_PILLS.map((pill) => (
                  <span
                    key={pill.label}
                    className="hero-pill hero-pill--clay"
                    style={{
                      color: pill.text,
                      background: `linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 38%), linear-gradient(158deg, ${pill.light} 0%, ${pill.mid} 50%, ${pill.dark} 100%)`,
                      boxShadow:
                        "0 12px 28px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.06)",
                      transform: `translate3d(calc(-50% + ${pill.ox}px), calc(-50% + ${pill.oy}px), 0) rotate(${pill.rot}deg)`,
                    }}
                  >
                    {pill.label}
                  </span>
                ))}
              </motion.div>
              <motion.div
                className="hero-line hero-line--1"
                style={{
                  opacity: line1,
                  filter: line1Filter,
                  scale: line1Scale,
                }}
              >
                <p className="hero-display hero-display--line1">
                  <span className="hero-display--line1-lead">
                    {line1Words.map((word, i) => {
                      const w = LINE1_WORD_MOTION[i] ?? LINE1_WORD_MOTION[0]
                      return (
                        <motion.span
                          key={word}
                          className="hero-display__word"
                          initial={{
                            opacity: 0,
                            y: w.y,
                            rotate: w.rot,
                            filter: `blur(${w.blur}px)`,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotate: 0,
                            filter: "blur(0px)",
                          }}
                          transition={{
                            delay: 0.05 + i * 0.055,
                            duration: 0.52,
                            ease: [0.2, 0.9, 0.2, 1],
                          }}
                        >
                          {word}
                        </motion.span>
                      )
                    })}
                  </span>
                  <motion.span
                    className="hero-display__hl hero-display__hl--way"
                    initial={{ opacity: 0, filter: "blur(14px)", y: 24 }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                    }}
                    transition={{ delay: 0.26, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="hero-display__hl-letters">
                      {"way".split("").map((letter, i) => (
                        <motion.span
                          key={`way-${i}`}
                          className="hero-display__hl-char"
                          initial={{ opacity: 0, y: 40, rotate: i === 0 ? -14 : i === 2 ? 12 : -6 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 18,
                            mass: 0.85,
                            delay: 0.36 + i * 0.08,
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                    <span className="hero-way-arrows" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <svg
                          key={i}
                          className="hero-way-arrow"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ))}
                    </span>
                  </motion.span>
                </p>
              </motion.div>

              <motion.div
                className="hero-line hero-line--2"
                style={{
                  opacity: line2,
                  y: line2Y,
                  skewX: line2Skew,
                }}
              >
                <p className="hero-display hero-display--row hero-display--center">
                  <motion.span
                    className="hero-muted hero-muted-word hero-muted-word--to"
                    initial={false}
                    animate={
                      phase >= 1
                        ? { opacity: 1, x: 0, rotate: 0, filter: "blur(0px)" }
                        : { opacity: 0, x: -52, rotate: -9, filter: "blur(14px)" }
                    }
                    transition={{
                      duration: 0.62,
                      delay: phase >= 1 ? 0.04 : 0,
                      ease: [0.16, 1, 0.26, 1],
                    }}
                  >
                    to
                  </motion.span>
                  <motion.span
                    className="hero-muted hero-muted-word hero-muted-word--make"
                    initial={false}
                    animate={
                      phase >= 1
                        ? { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
                        : { opacity: 0, y: 44, scale: 0.82, rotate: 6, filter: "blur(12px)" }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 21,
                      mass: 0.95,
                      delay: phase >= 1 ? 0.22 : 0,
                    }}
                  >
                    make
                  </motion.span>
                  <span className="hero-muted-gap" aria-hidden>
                    {" "}
                  </span>
                  <motion.span className="hero-gaming" style={{ clipPath: gamingClip }}>
                    gaming
                  </motion.span>
                </p>
              </motion.div>

              <motion.div
                className="hero-line hero-line--3"
                style={{ opacity: line3, scale: line3Scale }}
              >
                <p className="hero-display hero-display--big hero-display--center">
                  {chars.map((ch, i) => (
                    <motion.span
                      key={`${ch}-${i}`}
                      className={`hero-adaptive-char ${phase === 2 ? "hero-adaptive-char--lit" : ""}`}
                      initial={false}
                      animate={
                        phase === 2
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : { opacity: 0, y: 28, filter: "blur(12px)" }
                      }
                      transition={{
                        delay: phase === 2 ? i * 0.024 : 0,
                        duration: 0.38,
                        ease: [0.25, 1, 0.3, 1],
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  <motion.span
                    className="hero-adaptive-mark"
                    aria-hidden
                    initial={false}
                    animate={
                      phase === 2
                        ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
                        : { opacity: 0, y: 24, rotate: -14, scale: 0.75 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: phase === 2 ? chars.length * 0.024 + 0.04 : 0,
                    }}
                  >
                    <span className="hero-adaptive-mark__cell">
                      <span
                        className="hero-adaptive-mark__ring hero-adaptive-mark__ring--dash"
                        aria-hidden
                      />
                      <span
                        className="hero-adaptive-mark__ring hero-adaptive-mark__ring--core"
                        aria-hidden
                      />
                      <span className="hero-adaptive-mark__glyph">?</span>
                    </span>
                  </motion.span>
                </p>
                <motion.p
                  className="hero-sub hero-sub--center"
                  initial={false}
                  animate={phase === 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ delay: phase === 2 ? 0.22 : 0, duration: 0.32 }}
                >
                  <span className="hero-sub__line">One hand · full control</span>
                  <span className="hero-sub__line hero-sub__line--soft">
                    Built for accessible play
                  </span>
                </motion.p>
              </motion.div>
              </div>
              <div className="hero-stack__frame">
                <motion.div className="hero-eyebrow-cluster" style={{ opacity: line1 }}>
                  <p className="hero-eyebrow">
                    Adaptive controller attachment · University of Ottawa · GNG 2101
                  </p>
                  <div className="hero-eyebrow-pill-row">
                    <span
                      className="hero-pill hero-pill--clay hero-pill--eyebrow-below"
                      style={{
                        color: EYEBROW_ACCESSIBILITY_PILL.text,
                        background: `linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 38%), linear-gradient(158deg, ${EYEBROW_ACCESSIBILITY_PILL.light} 0%, ${EYEBROW_ACCESSIBILITY_PILL.mid} 50%, ${EYEBROW_ACCESSIBILITY_PILL.dark} 100%)`,
                        boxShadow:
                          "0 12px 28px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      Accessibility
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scroll-hero {
          position: relative;
          height: 420vh;
        }
        .scroll-hero__sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          min-height: 520px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .scroll-hero__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .scroll-hero__bg--1 {
          background:
            radial-gradient(120% 80% at 85% 15%, rgba(254, 243, 199, 0.85) 0%, transparent 55%),
            radial-gradient(90% 70% at 10% 80%, rgba(224, 231, 255, 0.9) 0%, transparent 50%),
            linear-gradient(145deg, #ffffff 0%, #fdf4ff 35%, #f8fafc 100%);
        }
        .scroll-hero__bg--2 {
          background:
            radial-gradient(80% 60% at 20% 30%, rgba(252, 231, 243, 0.95) 0%, transparent 55%),
            radial-gradient(70% 55% at 85% 70%, rgba(167, 243, 208, 0.75) 0%, transparent 45%),
            radial-gradient(60% 50% at 50% 100%, rgba(165, 243, 252, 0.6) 0%, transparent 40%),
            linear-gradient(160deg, #ecfccb 0%, #fef3c7 40%, #fce7f3 100%);
        }
        .scroll-hero__bg--3 {
          background:
            radial-gradient(ellipse 90% 60% at 50% 0%, rgba(76, 29, 149, 0.45) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 100% 100%, rgba(8, 145, 178, 0.2) 0%, transparent 45%),
            linear-gradient(168deg, #1e1b4b 0%, #0f172a 42%, #020617 100%);
        }
        .scroll-hero__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.45;
          pointer-events: none;
          z-index: 1;
          width: min(55vw, 420px);
          height: min(55vw, 420px);
        }
        .scroll-hero__blob--1 {
          background: conic-gradient(from 120deg, #c084fc, #22d3ee, #f472b6, #c084fc);
          transform: translate(-20%, -10%);
        }
        .scroll-hero__blob--2 {
          right: -15%;
          bottom: 0;
          width: min(45vw, 340px);
          height: min(45vw, 340px);
          background: conic-gradient(from 220deg, #34d399, #60a5fa, #fbbf24, #34d399);
          opacity: 0.3;
        }
        .scroll-hero__sticky[data-phase="2"] .scroll-hero__blob--1,
        .scroll-hero__sticky[data-phase="2"] .scroll-hero__blob--2 {
          opacity: 0.22;
        }
        .scroll-hero__grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.35;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 48px 48px;
          background-position: center top;
        }
        .scroll-hero__sticky[data-phase="2"] .scroll-hero__grid {
          opacity: 0.14;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
        }
        .hero-grid-pluses {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .hero-grid-pluses__mark {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.65;
        }
        .hero-reticles {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .hero-reticles__item {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-reticles__item--tl { top: 7%; left: 2%; }
        .hero-reticles__item--tr { top: 9%; right: 3%; }
        .hero-reticles__item--bl { bottom: 12%; left: 3%; }
        .hero-reticles__item--br { bottom: 8%; right: 4%; }
        .hero-reticles__item--c { top: 42%; right: 5%; opacity: 0.85; }
        @media (max-width: 640px) {
          .hero-reticles__item--c { display: none; }
          .hero-reticles__item--tr { top: 14%; right: 2%; }
          .hero-grid-pluses__mark:nth-child(n+4) { display: none; }
        }
        .scroll-hero__content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--max-wide);
          margin: 0 auto;
          padding: clamp(1.75rem, 4.5vh, 3.25rem) var(--page-pad);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .hero-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          flex: 1;
          min-height: 0;
        }
        .hero-stack__center {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: clamp(1.75rem, 8vh, 4.25rem);
        }
        .hero-stack__frame {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .hero-stack__frame .hero-eyebrow-cluster .hero-eyebrow,
        .hero-stack__frame .hero-eyebrow-cluster .hero-pill,
        .hero-stack__stage .hero-pill {
          pointer-events: auto;
        }
        .hero-eyebrow-cluster {
          position: absolute;
          left: 50%;
          top: clamp(0.25rem, 5vh, 2.75rem);
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(1.15rem, 3.4vh, 1.65rem);
          max-width: min(42rem, 94vw);
          width: 100%;
          box-sizing: border-box;
          pointer-events: none;
        }
        .hero-eyebrow-pill-row {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding-top: 0.45rem;
          box-sizing: border-box;
        }
        .hero-stack__frame .hero-eyebrow {
          margin: 0;
          width: 100%;
          max-width: min(42rem, 94vw);
          padding-bottom: 0.45rem;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--muted);
          line-height: 1.5;
          text-align: center;
        }
        .hero-pill--eyebrow-below {
          position: relative;
          left: auto;
          top: auto;
          flex-shrink: 0;
          margin: 0;
          transform: translateX(-4rem);
        }
        .scroll-hero__sticky[data-phase="2"] .hero-eyebrow {
          color: rgba(255, 255, 255, 0.42);
        }
        .hero-stack__stage .hero-pills {
          position: absolute;
          left: 50%;
          top: 44%;
          z-index: 0;
          transform: translate(-50%, -50%);
          width: min(1180px, 98vw);
          height: min(720px, 76vh);
          margin: 0;
          flex-shrink: 0;
          pointer-events: none;
        }
        .hero-pill {
          position: absolute;
          left: 50%;
          top: 50%;
          pointer-events: auto;
          font-family: var(--font-mono);
          font-size: clamp(12px, 1.75vw, 16px);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.82rem 1.65rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          cursor: default;
          white-space: nowrap;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .hero-stack__stage {
          position: relative;
          z-index: 2;
          min-height: clamp(340px, 52vh, 580px);
          width: 100%;
          max-width: 1180px;
        }
        .hero-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 44%;
          z-index: 1;
          transform: translateY(-50%);
          width: 100%;
          text-align: center;
        }
        .hero-display {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(3.65rem, 11.2vw + 0.55rem, 9.35rem);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.058em;
          color: var(--ink);
        }
        .hero-display--line1 {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.02em;
        }
        .hero-display--line1-lead {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: baseline;
          gap: 0.08em 0.14em;
        }
        .hero-display__word {
          will-change: transform;
          display: inline-block;
        }
        .hero-display__hl {
          color: var(--accent);
          position: relative;
          text-shadow:
            0 0 50px rgba(26, 86, 255, 0.45),
            0 4px 24px rgba(26, 86, 255, 0.2);
        }
        .hero-display__hl--way {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          padding-bottom: 0.02em;
        }
        .hero-display__hl-letters {
          display: inline-flex;
          align-items: baseline;
          gap: 0.02em;
          animation: hero-way-glow 4s ease-in-out infinite;
        }
        .hero-display__hl-char {
          display: inline-block;
          will-change: transform;
        }
        @keyframes hero-way-glow {
          0%, 100% {
            filter: brightness(1);
            text-shadow:
              0 0 50px rgba(26, 86, 255, 0.45),
              0 4px 24px rgba(26, 86, 255, 0.2);
          }
          45% {
            filter: brightness(1.08);
            text-shadow:
              0 0 64px rgba(56, 189, 248, 0.55),
              0 6px 28px rgba(26, 86, 255, 0.35);
          }
        }
        .hero-way-arrows {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-top: 0.04em;
          width: 100%;
          max-width: 2.85em;
          color: var(--accent);
          opacity: 0.95;
        }
        .hero-way-arrow {
          width: 0.56em;
          height: 0.56em;
          display: block;
          flex: 0 0 auto;
          margin-left: -0.07em;
          opacity: 0;
          animation:
            hero-way-arrow-enter 0.5s cubic-bezier(0.2, 1, 0.15, 1) forwards,
            hero-way-arrow-bob 2.1s ease-in-out infinite;
        }
        .hero-way-arrow:first-child {
          margin-left: 0;
        }
        .hero-way-arrow:nth-child(1) {
          animation-delay: 0.68s, 1.28s;
        }
        .hero-way-arrow:nth-child(2) {
          animation-delay: 0.8s, 1.4s;
        }
        .hero-way-arrow:nth-child(3) {
          animation-delay: 0.92s, 1.52s;
        }
        @keyframes hero-way-arrow-enter {
          from {
            opacity: 0;
            transform: translateX(-0.28em) scale(0.65);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes hero-way-arrow-bob {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.9;
          }
          50% {
            transform: translateX(0.1em);
            opacity: 1;
          }
        }
        .hero-display--row {
          display: inline-flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 0.15em;
        }
        .hero-display--center {
          display: flex;
          justify-content: center;
          text-align: center;
        }
        .hero-display--big {
          font-size: clamp(3.95rem, 12.5vw + 0.45rem, 10rem);
          color: #fafafa;
          font-weight: 800;
          letter-spacing: -0.065em;
        }
        .hero-display--big.hero-display--center {
          align-items: baseline;
        }
        .hero-muted {
          color: var(--muted);
          font-weight: 700;
        }
        .hero-muted-word {
          display: inline-block;
          will-change: transform, filter;
        }
        .hero-muted-word--to {
          margin-right: 0.06em;
          transform-origin: 100% 50%;
        }
        .hero-muted-word--make {
          position: relative;
          margin-right: 0.1em;
          transform-origin: 50% 100%;
        }
        .hero-muted-word--make::after {
          content: "";
          position: absolute;
          left: -0.06em;
          right: -0.06em;
          bottom: 0.02em;
          height: max(0.07em, 4px);
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            rgba(26, 86, 255, 0) 0%,
            rgba(26, 86, 255, 0.45) 45%,
            rgba(56, 189, 248, 0.35) 100%
          );
          transform: scaleX(0);
          transform-origin: left center;
          opacity: 0;
          pointer-events: none;
        }
        .scroll-hero__sticky[data-phase="1"] .hero-muted-word--make::after,
        .scroll-hero__sticky[data-phase="2"] .hero-muted-word--make::after {
          animation: hero-make-underline 0.75s cubic-bezier(0.2, 1, 0.2, 1) 0.42s forwards;
        }
        @keyframes hero-make-underline {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        .hero-muted-gap {
          display: inline-block;
          width: 0.06em;
        }
        .scroll-hero__sticky[data-phase="2"] .hero-muted {
          color: rgba(255, 255, 255, 0.52);
        }
        .hero-gaming {
          display: inline-block;
          font-weight: 800;
          color: var(--ink);
          background: linear-gradient(165deg, #ffffff 0%, #f1f5f9 100%);
          padding: 0.08em 0.26em 0.12em;
          border-radius: var(--radius-md);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.9) inset,
            0 12px 32px rgba(0, 0, 0, 0.14);
          will-change: clip-path;
        }
        .hero-adaptive-char {
          display: inline-block;
        }
        .hero-adaptive-mark {
          display: inline-block;
          vertical-align: baseline;
          margin-left: 0.02em;
          flex-shrink: 0;
          line-height: 1.02;
        }
        .hero-adaptive-mark__cell {
          position: relative;
          display: inline-block;
          line-height: 1.02;
        }
        .hero-adaptive-mark__ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
          box-sizing: border-box;
          transform: translate(-50%, -50%);
        }
        .hero-adaptive-mark__ring--core {
          width: 1.18em;
          height: 1.18em;
          border: max(1.5px, 0.018em) solid rgba(125, 211, 252, 0.52);
          box-shadow:
            0 0 26px rgba(56, 189, 248, 0.32),
            inset 0 0 0 1px rgba(126, 232, 198, 0.16);
          animation: hero-adaptive-mark-spin 18s linear infinite;
        }
        .hero-adaptive-mark__ring--dash {
          width: 1.36em;
          height: 1.36em;
          border: max(1.5px, 0.016em) dashed rgba(94, 234, 212, 0.38);
          opacity: 0.85;
          animation: hero-adaptive-mark-spin-rev 26s linear infinite;
        }
        .hero-adaptive-mark__glyph {
          position: relative;
          z-index: 1;
          display: inline-block;
          font-family: var(--font-display);
          font-size: 1em;
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: 0;
          color: rgba(248, 250, 252, 0.2);
          -webkit-text-fill-color: rgba(248, 250, 252, 0.22);
          -webkit-text-stroke: max(2.5px, 0.034em) rgba(186, 230, 253, 0.94);
          paint-order: stroke fill;
          filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.45));
          animation: hero-adaptive-mark-shimmer 3.2s ease-in-out infinite;
        }
        @keyframes hero-adaptive-mark-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes hero-adaptive-mark-spin-rev {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }
        @keyframes hero-adaptive-mark-shimmer {
          0%,
          100% {
            -webkit-text-stroke-color: rgba(186, 230, 253, 0.9);
            -webkit-text-fill-color: rgba(248, 250, 252, 0.2);
            filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.42));
          }
          33% {
            -webkit-text-stroke-color: rgba(126, 232, 198, 0.95);
            -webkit-text-fill-color: rgba(204, 251, 241, 0.28);
            filter: drop-shadow(0 0 20px rgba(126, 232, 198, 0.5));
          }
          66% {
            -webkit-text-stroke-color: rgba(147, 197, 253, 0.92);
            -webkit-text-fill-color: rgba(239, 246, 255, 0.22);
            filter: drop-shadow(0 0 16px rgba(129, 140, 248, 0.42));
          }
        }
        .hero-adaptive-char--lit {
          animation: hero-char-glow 3.2s ease-in-out infinite;
        }
        .hero-adaptive-char--lit:nth-child(odd) {
          animation-delay: 0.15s;
        }
        @keyframes hero-char-glow {
          0%, 100% { color: #fafafa; text-shadow: 0 0 0 transparent; }
          33% { color: #7ee8c6; text-shadow: 0 0 24px rgba(126, 232, 198, 0.35); }
          66% { color: #a5b4fc; text-shadow: 0 0 24px rgba(165, 180, 252, 0.35); }
        }
        .hero-sub {
          margin: 1.65rem 0 0;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          max-width: 20rem;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .hero-sub__line {
          display: block;
        }
        .hero-sub__line--soft {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          opacity: 0.88;
        }
        .hero-sub--center {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        @media (max-width: 640px) {
          .scroll-hero__content {
            padding: clamp(1.5rem, 6vw, 2.75rem) var(--page-pad);
          }
          .hero-stack__center {
            flex: 1;
            min-height: 0;
          }
          .hero-stack__frame .hero-eyebrow-cluster {
            top: clamp(0.15rem, 3vh, 1.25rem);
          }
          .hero-stack__frame .hero-eyebrow {
            font-size: 10px;
            padding: 0 0.5rem;
          }
          .hero-eyebrow-pill-row {
            padding-top: 0.55rem;
          }
          .hero-eyebrow-cluster {
            gap: clamp(1.05rem, 3.8vh, 1.45rem);
          }
          .hero-stack__stage .hero-pills {
            top: 44%;
            width: min(1000px, 150vw);
            height: min(680px, 98vh);
            transform: translate(-50%, -50%) scale(0.5);
          }
          .hero-pill {
            font-size: 11px;
            padding: 0.62rem 1.18rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-grid-pluses__mark { animation: none !important; }
          .hero-adaptive-mark__ring--core,
          .hero-adaptive-mark__ring--dash,
          .hero-adaptive-mark__glyph {
            animation: none !important;
          }
          .hero-adaptive-mark__ring--core,
          .hero-adaptive-mark__ring--dash {
            transform: translate(-50%, -50%) rotate(0deg) !important;
          }
          .hero-display__hl-letters { animation: none !important; }
          .hero-way-arrow {
            animation: none !important;
            opacity: 0.85 !important;
            transform: none !important;
          }
          .scroll-hero__sticky[data-phase="1"] .hero-muted-word--make::after,
          .scroll-hero__sticky[data-phase="2"] .hero-muted-word--make::after {
            animation: none !important;
            transform: scaleX(1);
            opacity: 0.4;
          }
        }
      `}</style>
    </section>
  )
}
