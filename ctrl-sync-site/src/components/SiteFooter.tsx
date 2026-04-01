import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

const WM_CTRL = "CTRL".split("")
const WM_SYNC = "SYNC".split("")

function OttawaClock() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date())

    setTime(format())
    const id = window.setInterval(() => setTime(format()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className="site-footer__clock" suppressHydrationWarning>
      {time || "—"}
    </span>
  )
}

const FOOTER_LINKS = [
  ["#prototype", "Prototype"],
  ["#media", "Media"],
  ["#about", "About"],
] as const

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__glow site-footer__glow--1" aria-hidden />
      <div className="site-footer__glow site-footer__glow--2" aria-hidden />

      <div className="site-footer__inner">
        <div className="site-footer__wordmark" aria-hidden>
          <span className="site-footer__wm-word site-footer__wm-word--ctrl">
            {WM_CTRL.map((ch, i) => (
              <span
                key={`c-${i}`}
                className="site-footer__wm-char site-footer__wm-char--ctrl"
                data-ch={ch}
                style={{ "--wm-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="site-footer__wm-gap" />
          <span className="site-footer__wm-word site-footer__wm-word--sync">
            {WM_SYNC.map((ch, i) => (
              <span
                key={`s-${i}`}
                className="site-footer__wm-char site-footer__wm-char--sync"
                data-ch={ch}
                style={{ "--wm-i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </div>

        <div className="site-footer__bar">
          <p className="site-footer__credit">
            {year} CTRL Sync · GNG 2101, University of Ottawa
          </p>
          <nav className="site-footer__nav" aria-label="Footer">
            {FOOTER_LINKS.map(([href, label]) => (
              <a key={href} href={href} className="site-footer__link">
                {label}
              </a>
            ))}
          </nav>
          <div className="site-footer__bar-trail">
            <div className="site-footer__time" aria-live="polite">
              <span className="site-footer__time-dot" aria-hidden />
              <span className="site-footer__time-label">Ottawa</span>
              <OttawaClock />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          position: relative;
          margin-top: 0;
          padding: clamp(2.25rem, 5.5vh, 3.5rem) var(--page-pad) clamp(1.35rem, 3vh, 1.85rem);
          background:
            radial-gradient(ellipse 90% 55% at 50% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 58%),
            radial-gradient(ellipse 45% 50% at 12% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 52%),
            linear-gradient(172deg, #07070b 0%, #040406 45%, #020203 100%);
          overflow: hidden;
          display: block;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .site-footer__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(88px);
          pointer-events: none;
          opacity: 0.22;
        }
        .site-footer__glow--1 {
          width: min(55vw, 360px);
          height: min(55vw, 360px);
          left: -8%;
          bottom: -35%;
          background: #1a56ff;
        }
        .site-footer__glow--2 {
          width: min(42vw, 280px);
          height: min(42vw, 280px);
          right: -5%;
          top: -25%;
          background: #7c3aed;
        }
        .site-footer__inner {
          position: relative;
          z-index: 2;
          width: min(var(--max-wide), 100%);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(1.75rem, 4vh, 2.75rem);
        }
        .site-footer__wordmark {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: center;
          gap: 0 0;
          pointer-events: none;
          user-select: none;
          padding: clamp(0.35rem, 1.2vh, 0.85rem) 0;
          max-width: min(96vw, 56rem);
          margin: 0 auto;
        }
        .site-footer__wm-gap {
          display: inline-block;
          width: clamp(1.25rem, 5vw, 3rem);
          flex-shrink: 0;
        }
        .site-footer__wm-word {
          display: inline-flex;
          align-items: baseline;
          gap: 0.01em;
        }
        .site-footer__wm-char {
          position: relative;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(2.55rem, 10vw, 6.75rem);
          letter-spacing: -0.05em;
          line-height: 0.94;
          text-transform: uppercase;
          display: inline-block;
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-origin: border-box;
          background-clip: text;
          -webkit-background-clip: text;
        }
        /* Wireframe fill + schematic lines inside glyph */
        .site-footer__wm-char--ctrl {
          --wm-p: calc(var(--wm-i, 0) * 11px);
          --wm-q: calc(var(--wm-i, 0) * -7px);
          -webkit-text-stroke: 1.65px rgba(110, 231, 195, 0.94);
          background-image:
            linear-gradient(122deg, rgba(45, 212, 191, 0.45) 0%, rgba(45, 212, 191, 0.45) 9%, transparent 9.4%),
            linear-gradient(58deg, transparent 42%, rgba(167, 243, 208, 0.38) 42.4%, rgba(167, 243, 208, 0.38) 43.5%, transparent 44%),
            linear-gradient(-38deg, transparent 55%, rgba(52, 211, 153, 0.32) 55.4%, rgba(52, 211, 153, 0.32) 56.6%, transparent 57.2%),
            linear-gradient(168deg, transparent 68%, rgba(110, 231, 195, 0.28) 68.4%, rgba(110, 231, 195, 0.28) 69.4%, transparent 70%),
            repeating-linear-gradient(
              90deg,
              rgba(45, 212, 191, 0) 0 6px,
              rgba(45, 212, 191, 0.13) 6px 7px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(110, 231, 195, 0) 0 8px,
              rgba(110, 231, 195, 0.09) 8px 9px
            ),
            repeating-linear-gradient(
              -52deg,
              rgba(167, 243, 208, 0) 0 11px,
              rgba(167, 243, 208, 0.11) 11px 12px
            ),
            linear-gradient(
              198deg,
              rgba(6, 12, 14, 0.92) 0%,
              rgba(15, 35, 32, 0.55) 42%,
              rgba(8, 18, 22, 0.75) 100%
            );
          background-size:
            120% 120%,
            120% 120%,
            120% 120%,
            120% 120%,
            15px 15px,
            17px 17px,
            22px 22px,
            100% 100%;
          background-position:
            var(--wm-p) var(--wm-q),
            calc(var(--wm-p) * -0.6) calc(var(--wm-q) * 0.4),
            calc(var(--wm-p) * 0.5) calc(var(--wm-q) * -0.3),
            var(--wm-q) var(--wm-p),
            var(--wm-p) var(--wm-q),
            calc(var(--wm-q) + 4px) var(--wm-p),
            var(--wm-p) calc(var(--wm-q) * 0.5),
            0 0;
          text-shadow:
            0 0 1px rgba(167, 243, 208, 0.75),
            0 0 22px rgba(45, 212, 191, 0.45),
            0 0 48px rgba(45, 212, 191, 0.22),
            0 0 88px rgba(45, 212, 191, 0.1),
            1.5px 2px 0 rgba(13, 148, 136, 0.22),
            -1.5px -1.5px 0 rgba(204, 251, 241, 0.14);
          filter: drop-shadow(0 0 14px rgba(45, 212, 191, 0.4)) drop-shadow(0 0 36px rgba(45, 212, 191, 0.18));
        }
        .site-footer__wm-char--sync {
          --wm-p: calc(var(--wm-i, 0) * 13px);
          --wm-q: calc(var(--wm-i, 0) * -8px);
          -webkit-text-stroke: 1.65px rgba(56, 189, 248, 0.94);
          background-image:
            linear-gradient(62deg, rgba(125, 211, 252, 0.42) 0%, rgba(125, 211, 252, 0.42) 11%, transparent 11.5%),
            linear-gradient(-118deg, transparent 38%, rgba(56, 189, 248, 0.36) 38.5%, rgba(56, 189, 248, 0.36) 40%, transparent 40.6%),
            linear-gradient(28deg, transparent 62%, rgba(14, 165, 233, 0.34) 62.4%, rgba(14, 165, 233, 0.34) 63.8%, transparent 64.4%),
            linear-gradient(215deg, transparent 48%, rgba(186, 230, 253, 0.26) 48.3%, rgba(186, 230, 253, 0.26) 49.6%, transparent 50.2%),
            repeating-linear-gradient(
              90deg,
              rgba(56, 189, 248, 0) 0 7px,
              rgba(56, 189, 248, 0.14) 7px 8px
            ),
            repeating-linear-gradient(
              180deg,
              rgba(125, 211, 252, 0) 0 9px,
              rgba(125, 211, 252, 0.1) 9px 10px
            ),
            repeating-linear-gradient(
              48deg,
              rgba(14, 165, 233, 0) 0 13px,
              rgba(14, 165, 233, 0.12) 13px 14px
            ),
            linear-gradient(
              202deg,
              rgba(8, 18, 28, 0.92) 0%,
              rgba(12, 38, 58, 0.58) 45%,
              rgba(8, 22, 36, 0.78) 100%
            );
          background-size:
            120% 120%,
            120% 120%,
            120% 120%,
            120% 120%,
            16px 16px,
            19px 19px,
            24px 24px,
            100% 100%;
          background-position:
            var(--wm-p) var(--wm-q),
            calc(var(--wm-p) * -0.55) calc(var(--wm-q) * 0.45),
            calc(var(--wm-p) * 0.45) calc(var(--wm-q) * -0.35),
            var(--wm-q) var(--wm-p),
            calc(var(--wm-p) + 3px) var(--wm-q),
            var(--wm-p) calc(var(--wm-q) + 5px),
            calc(var(--wm-q) * 0.7) var(--wm-p),
            0 0;
          text-shadow:
            0 0 1px rgba(125, 211, 252, 0.78),
            0 0 24px rgba(56, 189, 248, 0.48),
            0 0 52px rgba(56, 189, 248, 0.24),
            0 0 96px rgba(14, 165, 233, 0.12),
            1.5px 2px 0 rgba(8, 145, 178, 0.24),
            -1.5px -1.5px 0 rgba(224, 242, 254, 0.12);
          filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.42)) drop-shadow(0 0 38px rgba(56, 189, 248, 0.2));
        }
        /* Offset “ghost” outline echo */
        .site-footer__wm-char::before {
          content: attr(data-ch);
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          font: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          text-transform: inherit;
          color: transparent;
          -webkit-text-fill-color: transparent;
          transform: translate(3px, 3px);
          -webkit-text-stroke: 1.8px rgba(45, 212, 191, 0.12);
          pointer-events: none;
        }
        .site-footer__wm-char--sync::before {
          transform: translate(2px, 4px);
          -webkit-text-stroke: 1.8px rgba(56, 189, 248, 0.12);
        }
        .site-footer__bar {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem 1rem;
          padding: clamp(1rem, 2.2vh, 1.35rem) clamp(0.65rem, 1.5vw, 0.85rem);
          border-radius: 14px;
          border: 1px solid rgba(74, 122, 150, 0.28);
          background: linear-gradient(
            168deg,
            rgba(35, 43, 50, 0.45) 0%,
            rgba(18, 22, 28, 0.72) 48%,
            rgba(15, 18, 24, 0.78) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.07),
            inset 0 -1px 0 rgba(0, 0, 0, 0.42),
            0 6px 24px rgba(0, 0, 0, 0.35);
        }
        .site-footer__credit {
          margin: 0;
          font-family: var(--font-mono);
          font-size: clamp(10px, 1.05vw, 12px);
          font-weight: 500;
          letter-spacing: 0.04em;
          line-height: 1.35;
          color: rgba(203, 213, 225, 0.52);
          max-width: min(22rem, 48%);
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          align-items: center;
          min-height: 2.25rem;
          z-index: 1;
        }
        .site-footer__nav {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.35rem 0.65rem;
          min-height: 2.25rem;
          max-width: calc(100% - 2 * clamp(5rem, 18vw, 11rem));
          pointer-events: none;
          z-index: 2;
        }
        .site-footer__nav .site-footer__link {
          pointer-events: auto;
        }
        .site-footer__bar-trail {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem 0.75rem;
          min-width: 0;
          min-height: 2.25rem;
          z-index: 1;
        }
        .site-footer__link {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(186, 230, 253, 0.62);
          padding: 0.45em 0.85em;
          border-radius: 10px;
          border: 1px solid rgba(74, 122, 150, 0.35);
          background: linear-gradient(
            175deg,
            rgba(74, 122, 150, 0.14) 0%,
            rgba(30, 41, 52, 0.5) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.09),
            inset 0 -1px 0 rgba(0, 0, 0, 0.28);
          transition: color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .site-footer__link:hover {
          color: rgba(167, 243, 208, 0.95);
          border-color: rgba(110, 231, 195, 0.45);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(0, 0, 0, 0.25),
            0 0 22px rgba(45, 212, 191, 0.12);
        }
        .site-footer__link:focus-visible {
          outline: 2px solid rgba(56, 189, 248, 0.55);
          outline-offset: 3px;
          border-radius: 10px;
        }
        .site-footer__time {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.45rem;
          flex-wrap: nowrap;
          font-family: var(--font-mono);
          padding: 0.4rem 0.7rem;
          min-height: 2.25rem;
          box-sizing: border-box;
          border-radius: 10px;
          border: 1px solid rgba(74, 122, 150, 0.3);
          background: linear-gradient(
            175deg,
            rgba(74, 122, 150, 0.1) 0%,
            rgba(22, 28, 36, 0.55) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -1px 0 rgba(0, 0, 0, 0.32);
        }
        .site-footer__time-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(126, 232, 198, 0.65);
          box-shadow:
            0 0 12px rgba(126, 232, 198, 0.45),
            inset 0 -1px 2px rgba(0, 0, 0, 0.35);
          flex-shrink: 0;
        }
        .site-footer__time-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(154, 230, 201, 0.55);
          line-height: 1;
          white-space: nowrap;
        }
        .site-footer__clock {
          font-size: clamp(11px, 1.05vw, 13px);
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(241, 245, 249, 0.82);
          font-variant-numeric: tabular-nums;
          line-height: 1;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .site-footer__bar {
            flex-direction: column;
            align-items: center;
          }
          .site-footer__credit {
            max-width: 36ch;
            text-align: center;
            flex: none;
            order: 3;
            justify-content: center;
          }
          .site-footer__nav {
            position: static;
            transform: none;
            max-width: 100%;
            order: 1;
          }
          .site-footer__bar-trail {
            flex: none;
            width: 100%;
            justify-content: center;
            order: 2;
          }
          .site-footer__time {
            justify-content: center;
          }
        }
        @media (max-width: 640px) {
          .site-footer__wm-char--ctrl,
          .site-footer__wm-char--sync {
            -webkit-text-stroke-width: 1.25px;
          }
          .site-footer__wm-char::before {
            -webkit-text-stroke-width: 1.35px;
          }
        }
      `}</style>
    </footer>
  )
}
