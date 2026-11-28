import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { playTone } from '../lib/audioBus'

function ChromaticGlass({ spread, hue }: { spread: number; hue: number }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const initial = useRef({ spread, hue })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    } catch {
      host.classList.add('lab-canvas-fallback')
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: initial.current.spread },
        uHue: { value: initial.current.hue },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uSpread;
        uniform float uHue;
        void main() {
          vec2 p = vUv - 0.5;
          float d = length(p);
          float angle = atan(p.y, p.x);
          float bands = sin(d * (22.0 + uSpread * 26.0) - uTime * 1.4 + angle * 2.0);
          float split = sin(angle * 3.0 + uHue * 6.28318) * uSpread * 0.16;
          vec3 base = vec3(0.055, 0.09, 0.078);
          vec3 cyan = vec3(0.35, 0.86, 0.84);
          vec3 accent = vec3(0.79, 0.31, 0.16);
          vec3 col = base + cyan * max(0.0, bands + split) * 0.34 + accent * max(0.0, -bands + split) * 0.3;
          col += 0.06 * sin(uHue * 6.28318 + vec3(0.0, 2.1, 4.2));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    materialRef.current = material

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const clock = new THREE.Clock()
    let frame = 0
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(animate)
    }
    animate()

    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      materialRef.current = null
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uSpread.value = spread
    material.uniforms.uHue.value = hue
  }, [spread, hue])

  return <div ref={hostRef} className="lab-canvas" aria-hidden="true" />
}

function ClipMorph({ value }: { value: number }) {
  const t = value / 100
  const points = (from: number[], to: number[]) =>
    from.map((point, index) => `${point + (to[index] - point) * t}%`).join(' ')
  const polygon =
    value < 50
      ? `polygon(${points([0, 100, 100, 0], [8, 92, 78, 22])})`
      : `polygon(${points([8, 92, 78, 22], [2, 98, 68, 32])})`
  return <div className="lab-morph-shape" style={{ clipPath: polygon }} />
}

export default function LabSection() {
  const [spread, setSpread] = useState(45)
  const [hue, setHue] = useState(18)
  const [morph, setMorph] = useState(35)

  return (
    <section className="section lab-section" data-scroll-progress data-scroll-section>
      <div
        className="section-head"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.04"
      >
        <p className="section-index">04 / UI Lab</p>
        <div className="section-head-row">
          <h2>Small experiments. Real engineering.</h2>
          <p>Three live controls built in the page — no extra demo site, no recorded footage.</p>
        </div>
      </div>

      <div className="lab-grid">
        <article className="lab-card" data-stand data-tilt>
          <p className="lab-kicker">01 / Chromatic glass</p>
          <ChromaticGlass spread={spread / 100} hue={hue / 100} />
          <div className="lab-controls">
            <label>
              Fracture spread
              <input
                type="range"
                min="0"
                max="100"
                value={spread}
                onChange={(event) => setSpread(Number(event.target.value))}
              />
            </label>
            <label>
              Edge hue
              <input
                type="range"
                min="0"
                max="100"
                value={hue}
                onChange={(event) => setHue(Number(event.target.value))}
              />
            </label>
          </div>
        </article>

        <article className="lab-card" data-stand data-tilt>
          <p className="lab-kicker">02 / Audio pad</p>
          <div className="lab-pad">
            {[
              { label: 'C', hz: 261.63 },
              { label: 'E', hz: 329.63 },
              { label: 'G', hz: 392.0 },
              { label: 'B', hz: 493.88 },
            ].map((note) => (
              <button key={note.label} type="button" onPointerDown={() => playTone(note.hz)}>
                {note.label}
              </button>
            ))}
          </div>
          <p className="lab-note">Short sine tones generated in the browser. No samples, no autoplay.</p>
        </article>

        <article className="lab-card" data-stand data-tilt>
          <p className="lab-kicker">03 / Clip-path morpher</p>
          <ClipMorph value={morph} />
          <label className="lab-controls lab-controls-single">
            Shard geometry
            <input
              type="range"
              min="0"
              max="100"
              value={morph}
              onChange={(event) => setMorph(Number(event.target.value))}
            />
          </label>
        </article>
      </div>
    </section>
  )
}
