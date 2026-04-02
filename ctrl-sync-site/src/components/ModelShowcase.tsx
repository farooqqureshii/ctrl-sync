import {
  Component,
  Suspense,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react"
import { Canvas, useThree } from "@react-three/fiber"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import * as THREE from "three"
import {
  Bounds,
  ContactShadows,
  Environment,
  Grid,
  Html,
  OrbitControls,
  useAnimations,
  useGLTF,
  useProgress,
} from "@react-three/drei"

const MODEL_URL = "/models/prototype.glb"

type ViewerApi = {
  reset: () => void
  snapshot: () => void
}

function CanvasFallback() {
  const { progress, active } = useProgress()
  // Before assets register, `active` can be false while Suspense is still waiting —
  // returning null here leaves a blank black canvas briefly (or indefinitely if
  // progress never flips). Always show the loader while this fallback is mounted.
  const pct = active ? Math.round(progress) : 0
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="model-canvas-fallback" aria-live="polite">
        <div className="model-canvas-fallback__ring" aria-hidden />
        <p className="model-canvas-fallback__label">Loading mesh</p>
        <div className="model-canvas-fallback__bar" aria-hidden>
          <div
            className="model-canvas-fallback__fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="model-canvas-fallback__pct">{pct}%</p>
      </div>
    </Html>
  )
}

type MatSnapshot = {
  wireframe: boolean
  color: THREE.Color
  emissive: THREE.Color
  emissiveIntensity: number
}

function PrototypeModel({
  url,
  wireframe,
}: {
  url: string
  wireframe: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const matBackup = useRef(new Map<THREE.Material, MatSnapshot>())
  const { scene: gltfScene, animations } = useGLTF(url)
  /** Deep clone so wireframe toggles never mutate the cached GLTF (fixes stuck mesh). */
  const scene = useMemo(() => gltfScene.clone(true), [gltfScene])
  const { actions } = useAnimations(animations, group)

  useLayoutEffect(() => {
    matBackup.current.clear()
  }, [scene])

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]
      for (const mat of mats) {
        if (!mat || !("wireframe" in mat)) continue
        const m = mat as THREE.MeshStandardMaterial & { color: THREE.Color }
        if (!matBackup.current.has(m)) {
          const hasEmissive = "emissive" in m && m.emissive
          matBackup.current.set(m, {
            wireframe: m.wireframe,
            color: m.color.clone(),
            emissive: hasEmissive ? m.emissive.clone() : new THREE.Color(0),
            emissiveIntensity:
              "emissiveIntensity" in m ? m.emissiveIntensity : 0,
          })
        }
        const orig = matBackup.current.get(m)!
        if (wireframe) {
          m.wireframe = true
          m.color.setHex(0xffffff)
          if ("emissive" in m && m.emissive) {
            m.emissive.setHex(0x6b6b6b)
            if ("emissiveIntensity" in m) {
              m.emissiveIntensity = 0.55
            }
          }
        } else {
          m.wireframe = orig.wireframe
          m.color.copy(orig.color)
          if ("emissive" in m && m.emissive) {
            m.emissive.copy(orig.emissive)
            if ("emissiveIntensity" in m) {
              m.emissiveIntensity = orig.emissiveIntensity
            }
          }
        }
      }
    })
  }, [scene, wireframe])

  useEffect(() => {
    if (!animations.length || !actions) return
    const first = Object.values(actions).find(Boolean)
    if (!first) return
    first.reset().fadeIn(0.4).play()
    return () => {
      first.fadeOut(0.2)
      first.stop()
    }
  }, [actions, animations])

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function ViewerActionsSetup({
  orbitRef,
  onReady,
}: {
  orbitRef: React.RefObject<OrbitControlsType | null>
  onReady: (api: ViewerApi | null) => void
}) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    const api: ViewerApi = {
      reset: () => {
        orbitRef.current?.reset()
      },
      snapshot: () => {
        gl.render(scene, camera)
        const dataUrl = gl.domElement.toDataURL("image/png")
        const a = document.createElement("a")
        a.download = `ctrl-sync-prototype-${Date.now()}.png`
        a.href = dataUrl
        a.click()
      },
    }
    onReady(api)
    return () => onReady(null)
  }, [gl, scene, camera, onReady, orbitRef])
  return null
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

function ModelScene({
  url,
  autoSpin,
  wireframe,
  onViewerReady,
}: {
  url: string
  autoSpin: boolean
  wireframe: boolean
  onViewerReady: (api: ViewerApi | null) => void
}) {
  const orbitRef = useRef<OrbitControlsType>(null)

  const registerViewer = useCallback(
    (api: ViewerApi | null) => {
      onViewerReady(api)
    },
    [onViewerReady],
  )

  return (
    <Canvas
      camera={{ position: [0.65, 0.4, 3.6], fov: 42, near: 0.01, far: 500 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      className="model-canvas"
    >
      <color attach="background" args={["#0e0e12"]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#a8c8ff" />
      <spotLight
        position={[-3, 5, 2]}
        angle={0.35}
        penumbra={0.85}
        intensity={0.65}
        color="#fde68a"
      />

      <Suspense fallback={<CanvasFallback />}>
        <Bounds fit clip={false} observe={false} margin={1.35} maxDuration={0.4}>
          <PrototypeModel url={url} wireframe={wireframe} />
        </Bounds>
        <Environment
          preset="city"
          environmentIntensity={wireframe ? 0.35 : 0.92}
        />
        <ContactShadows
          opacity={0.55}
          scale={12}
          blur={2.4}
          far={4.5}
          color="#000000"
          position={[0, -1.12, 0]}
        />
        <Grid
          infiniteGrid
          fadeDistance={14}
          fadeStrength={1.25}
          sectionSize={4}
          cellSize={0.45}
          cellThickness={0.6}
          sectionThickness={1}
          sectionColor={new THREE.Color("#3d3d48")}
          cellColor={new THREE.Color("#2e2e38")}
          position={[0, -1.12, 0]}
        />
      </Suspense>

      <OrbitControls
        ref={orbitRef}
        makeDefault
        enablePan={false}
        minDistance={0.02}
        maxDistance={400}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        zoomSpeed={0.9}
        autoRotate={autoSpin}
        autoRotateSpeed={1.35}
        rotateSpeed={1}
        dampingFactor={0.1}
        enableDamping
      />
      <ViewerActionsSetup orbitRef={orbitRef} onReady={registerViewer} />
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
  const [autoSpin, setAutoSpin] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const viewerApiRef = useRef<ViewerApi | null>(null)

  const registerViewer = useCallback((api: ViewerApi | null) => {
    viewerApiRef.current = api
  }, [])

  const requestFullscreen = () => {
    frameRef.current?.requestFullscreen?.().catch(() => {})
  }

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
        <div className="model-frame" ref={frameRef}>
          <div className="model-toolbar" role="toolbar" aria-label="3D viewer controls">
            <div className="model-toolbar__cluster" role="group" aria-label="View options">
              <button
                type="button"
                className={`model-toolbar__iconbtn${autoSpin ? " model-toolbar__iconbtn--on" : ""}`}
                aria-pressed={autoSpin}
                title="Auto-spin (pauses while you drag)"
                onClick={() => setAutoSpin((v) => !v)}
              >
                Spin
              </button>
              <button
                type="button"
                className={`model-toolbar__iconbtn${wireframe ? " model-toolbar__iconbtn--on" : ""}`}
                aria-pressed={wireframe}
                title="Wireframe topology view"
                onClick={() => setWireframe((v) => !v)}
              >
                Mesh
              </button>
              <button
                type="button"
                className="model-toolbar__iconbtn"
                title="Reset camera to default"
                onClick={() => viewerApiRef.current?.reset()}
              >
                Reset
              </button>
              <button
                type="button"
                className="model-toolbar__iconbtn"
                title="Save view as PNG"
                onClick={() => viewerApiRef.current?.snapshot()}
              >
                Snap
              </button>
              <button
                type="button"
                className="model-toolbar__iconbtn"
                title="Fullscreen viewer"
                onClick={requestFullscreen}
              >
                Full
              </button>
            </div>
          </div>
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
              <ModelScene
                url={`${MODEL_URL}?v=${attempt}`}
                autoSpin={autoSpin}
                wireframe={wireframe}
                onViewerReady={registerViewer}
              />
            </ModelLoadBoundary>
          )}
        </div>
      </div>
      <style>{`
        .model-canvas-fallback {
          width: 200px;
          padding: 1.1rem 1.25rem 1rem;
          border-radius: 14px;
          background: rgba(12, 12, 16, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
          font-family: var(--font-mono);
          text-align: center;
          pointer-events: none;
        }
        .model-canvas-fallback__ring {
          width: 36px;
          height: 36px;
          margin: 0 auto 0.65rem;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-top-color: rgba(167, 139, 250, 0.9);
          animation: model-fallback-spin 0.75s linear infinite;
        }
        .model-canvas-fallback__label {
          margin: 0 0 0.5rem;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .model-canvas-fallback__bar {
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .model-canvas-fallback__fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #22d3ee);
          transition: width 0.2s ease-out;
        }
        .model-canvas-fallback__pct {
          margin: 0.45rem 0 0;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.72);
        }
        @keyframes model-fallback-spin {
          to { transform: rotate(360deg); }
        }
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
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--line-strong);
          background: #0e0e12;
          height: min(72vh, 640px);
          box-shadow:
            0 24px 48px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.04) inset;
        }
        .model-frame:fullscreen {
          border-radius: 0;
          height: 100vh;
          max-height: none;
          border: none;
        }
        .model-toolbar {
          position: absolute;
          z-index: 3;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.65rem 0.65rem 0;
          pointer-events: none;
        }
        .model-toolbar__cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          pointer-events: auto;
          margin-left: auto;
          justify-content: flex-end;
        }
        .model-toolbar__iconbtn {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.38rem 0.52rem;
          min-height: 28px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 10, 12, 0.72);
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .model-toolbar__iconbtn:hover {
          border-color: rgba(255, 255, 255, 0.24);
          color: rgba(255, 255, 255, 0.92);
        }
        .model-toolbar__iconbtn--on {
          border-color: rgba(52, 211, 153, 0.45);
          background: rgba(5, 150, 105, 0.22);
          color: #d1fae5;
        }
        .model-canvas {
          display: block;
          width: 100%;
          height: 100%;
          touch-action: none;
        }
        @media (max-width: 640px) {
          .model-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .model-toolbar__cluster {
            margin-left: 0;
            justify-content: flex-start;
          }
          .model-toolbar__iconbtn {
            flex: 1 1 auto;
            text-align: center;
            min-width: 0;
          }
        }
      `}</style>
    </section>
  )
}
