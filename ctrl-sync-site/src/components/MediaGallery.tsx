import { motion } from "framer-motion"
import { MEDIA } from "../content/media"

export function MediaGallery() {
  return (
    <section className="media-section" id="media">
      <div className="media-inner">
        <div className="media-intro">
          <p className="media-kicker">Deliverables</p>
          <h2 className="media-title">Project files</h2>
        </div>

        <motion.article
          className="media-docs"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="media-docs__label">Library</p>
          <ul className="media-docs__list">
            {MEDIA.documents.map((doc, i) => (
              <motion.li
                key={doc.file}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <a href={doc.file} target="_blank" rel="noreferrer" className="media-doc-link">
                  <span>{doc.label}</span>
                  <span className="media-doc-link__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.article>
      </div>
      <style>{`
        .media-section {
          background: var(--bg);
          padding: 5rem 0 5.5rem;
          border-top: 1px solid var(--line);
        }
        .media-inner {
          width: min(var(--max-wide), 100%);
          margin: 0 auto;
          padding: 0 var(--page-pad);
        }
        .media-intro {
          margin-bottom: 3rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--line);
        }
        .media-kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 0.75rem;
        }
        .media-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0;
          color: var(--ink);
        }
        .media-docs {
          background: linear-gradient(165deg, #3d4d66 0%, #2e3a52 48%, #283348 100%);
          color: #e8edf4;
          border-radius: var(--radius-xl);
          padding: 1.5rem 1.5rem 1.35rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 12px 28px rgba(30, 41, 59, 0.12);
        }
        .media-docs__label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(203, 213, 225, 0.55);
          margin: 0 0 1.15rem;
        }
        .media-docs__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .media-doc-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f1f5f9 !important;
          text-decoration: none !important;
          font-weight: 550;
          font-size: 0.95rem;
          transition: background 0.2s, border-color 0.2s;
        }
        .media-doc-link:hover {
          background: rgba(255, 255, 255, 0.11);
          border-color: rgba(255, 255, 255, 0.16);
          text-decoration: none !important;
        }
        .media-doc-link__arrow {
          opacity: 0.5;
          font-size: 1.1rem;
        }
      `}</style>
    </section>
  )
}
