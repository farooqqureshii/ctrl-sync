import {
  Component,
  Suspense,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react"
import { Canvas } from "@react-three/fiber"
import { Bounds, OrbitControls, Environment, useGLTF } from "@react-three/drei"

const MODEL_URL = "/models/prototype.glb"

function PrototypeModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)

function ModelErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="model-fallback">
      <p className="model-fallback__title">3D prototype</p>
      <p className="model-fallback__text">
        Add your exported model at{" "}
        <code>public/models/prototype.glb</code>, then refresh. Orbit controls activate
        once the mesh loads.
      </p>
      <button type="button" className="model-fallback__btn" onClick={onRetry}>
        Retry load
      </button>
      <style>{`
        .model-fallback {
          height: 100%;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          background: #141414;
          border-radius: var(--radius-xl);
        }
        .model-fallback__title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
          color: #fafafa;
        }
        .model-fallback__text {
          margin: 0;
          max-width: 28rem;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.95rem;
          line-height: 1.55;
        }
        .model-fallback__text code {
          font-size: 0.85em;
          background: rgba(255, 255, 255, 0.1);
          color: #fafafa;
        }
        .model-fallback__btn {
          margin-top: 1.35rem;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          padding: 0.65rem 1.35rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: #fafafa;
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .model-fallback__btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  )
}

function ModelScene({ url }: { url: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="model-canvas"
    >
      <color attach="background" args={["#141414"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1} color="#ffffff" />
      <directionalLight position={[-4, 2, -2]} intensity={0.3} color="#a8c0ff" />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.45} maxDuration={0.35}>
          <PrototypeModel url={url} />
        </Bounds>
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={0.15}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  )
}

class ModelLoadBoundary extends Component<
  { children: ReactNode; onFailed: () => void },
  { ok: boolean }
> {
  constructor(props: { children: ReactNode; onFailed: () => void }) {
    super(props)
    this.state = { ok: true }
  }

  static getDerivedStateFromError() {
    return { ok: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Model load error:", error.message, info.componentStack)
    this.props.onFailed()
  }

  render() {
    if (!this.state.ok) return null
    return this.props.children
  }
}

export function ModelShowcase() {
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  return (
    <section className="model-section" id="prototype">
      <div className="model-section__inner">
        <header className="model-header">
          <p className="model-kicker">Interactive</p>
          <h2 className="model-headline">Explore the prototype</h2>
          <p className="model-lede">
            Rotate and zoom the CTRL Sync attachment in 3D—see how reach is
            redistributed for comfortable one-handed play.
          </p>
        </header>
        <div className="model-frame">
          {failed ? (
            <ModelErrorFallback
              onRetry={() => {
                setFailed(false)
                setAttempt((a) => a + 1)
              }}
            />
          ) : (
            <ModelLoadBoundary
              key={attempt}
              onFailed={() => setFailed(true)}
            >
              <ModelScene url={`${MODEL_URL}?v=${attempt}`} />
            </ModelLoadBoundary>
          )}
        </div>
        <p className="model-hint">
          Drag to orbit · scroll to zoom. Place your mesh at{" "}
          <code>public/models/prototype.glb</code>.
        </p>
      </div>
      <style>{`
        .model-section {
          margin: 0;
          padding: 4.5rem 0 5rem;
          background: var(--surface);
          border-top: 1px solid var(--line);
        }
        .model-section__inner {
          width: min(var(--max-wide), 100%);
          margin: 0 auto;
          padding: 0 var(--page-pad);
        }
        .model-header {
          max-width: 38rem;
          margin-bottom: 2rem;
        }
        .model-kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 0.65rem;
        }
        .model-headline {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          color: var(--ink);
          margin: 0 0 0.85rem;
        }
        .model-lede {
          margin: 0;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.6;
          font-weight: 450;
        }
        .model-frame {
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--line-strong);
          background: #141414;
          height: min(72vh, 640px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
        }
        .model-canvas {
          display: block;
          width: 100%;
          height: 100%;
          touch-action: none;
        }
        .model-hint {
          margin: 1rem 0 0;
          font-size: 0.84rem;
          color: var(--faint);
          max-width: 40rem;
          line-height: 1.5;
        }
      `}</style>
    </section>
  )
}
