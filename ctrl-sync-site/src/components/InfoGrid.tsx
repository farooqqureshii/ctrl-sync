import { motion } from "framer-motion"

const items = [
  {
    n: "01",
    title: "The problem",
    body: "Standard split-controller setups assume two-handed dexterity. Many players improvise—or stop playing—because reach and endurance do not line up.",
  },
  {
    n: "02",
    title: "Our solution",
    body: "CTRL Sync is an adaptive attachment that reshapes the layout so a single hand can comfortably cover sticks, face buttons, and triggers.",
  },
  {
    n: "03",
    title: "Designed for real play",
    body: "We iterated toward a layout that feels natural over long sessions—ergonomics and fatigue drove the details, not just a bench demo.",
  },
  {
    n: "04",
    title: "Project context",
    body: "GNG 2101 at the University of Ottawa. A capstone-style exploration of human-centred hardware for more inclusive gaming.",
  },
] as const

export function InfoGrid() {
  return (
    <section className="story-section" id="about">
      <div className="story-inner">
        <header className="story-hero">
          <p className="story-kicker">About CTRL Sync</p>
          <h2 className="story-title">Adaptive hardware, explained in four steps</h2>
          <p className="story-dek">
            Clear structure, no clutter—the same project story with room to breathe.
          </p>
        </header>

        <div className="story-list">
          {items.map((item, i) => (
            <motion.article
              key={item.n}
              className="story-row"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="story-row__n">{item.n}</span>
              <div className="story-row__body">
                <h3 className="story-row__title">{item.title}</h3>
                <p className="story-row__text">{item.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <style>{`
        .story-section {
          padding: 5.25rem 0 6rem;
          background: var(--surface);
          border-top: 1px solid var(--line);
        }
        .story-inner {
          width: min(var(--max-wide), 100%);
          margin: 0 auto;
          padding: 0 var(--page-pad);
        }
        .story-hero {
          max-width: 40rem;
          margin-bottom: 3rem;
        }
        .story-kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 0.75rem;
        }
        .story-title {
          font-family: var(--font-display);
          font-size: clamp(1.85rem, 3.6vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 0 0 0.85rem;
          color: var(--ink);
        }
        .story-dek {
          margin: 0;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.6;
        }
        .story-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .story-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1.75rem 2.5rem;
          padding: 2rem 0;
          border-top: 1px solid var(--line);
          align-items: start;
        }
        .story-row:last-of-type {
          border-bottom: 1px solid var(--line);
        }
        .story-row__n {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--accent);
          line-height: 1;
          padding-top: 0.35rem;
        }
        .story-row__title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 650;
          letter-spacing: -0.02em;
          margin: 0 0 0.45rem;
          color: var(--ink);
        }
        .story-row__text {
          margin: 0;
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 44rem;
        }
        @media (max-width: 560px) {
          .story-row {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }
        }
      `}</style>
    </section>
  )
}
