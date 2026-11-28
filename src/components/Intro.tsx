import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { isAudioEnabled, subscribeAudio } from '../lib/audioBus'
import { fracturePaths } from '../lib/fracturePaths'

const pieceCount = 16
const motionAttrs = [
  'data-life',
  'data-reveal',
  'data-stand',
  'data-device',
  'data-scroll-progress',
  'data-scroll-detail',
  'data-scroll-section',
  'data-tilt',
]

function allowed(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(max-width: 700px)').matches) return false
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  const slow = Boolean(connection?.saveData) || /^(slow-)?2g$/.test(connection?.effectiveType ?? '')
  return !slow
}

function cloneRegion(node: Element | null): HTMLElement | null {
  if (!node) return null
  const rect = node.getBoundingClientRect()
  const clone = node.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')
  clone.setAttribute('aria-hidden', 'true')
  clone.setAttribute('inert', '')
  clone.style.position = 'absolute'
  clone.style.left = `${rect.left}px`
  clone.style.top = `${rect.top}px`
  clone.style.width = `${rect.width}px`
  clone.style.height = `${rect.height}px`
  clone.style.margin = '0'
  clone.style.pointerEvents = 'none'
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
  clone.querySelectorAll(motionAttrs.join(',')).forEach((element) => {
    motionAttrs.forEach((attr) => element.removeAttribute(attr))
  })
  clone.querySelectorAll('a, button').forEach((element) => element.setAttribute('tabindex', '-1'))
  return clone
}

// The welcome card is repeated only inside the shards. The live-site clone,
// chamber and beam are shared once, so the fracture stays light.
function welcomeLayer(): HTMLElement {
  const layer = document.createElement('div')
  layer.className = 'intro-welcome'

  const kicker = document.createElement('span')
  kicker.className = 'intro-welcome-kicker'
  kicker.textContent = 'Welcome to'

  const stepOne = document.createElement('span')
  stepOne.className = 'intro-welcome-step intro-welcome-step--one'
  stepOne.textContent = 'Selected work'

  const stepTwo = document.createElement('span')
  stepTwo.className = 'intro-welcome-step intro-welcome-step--two'
  stepTwo.textContent = 'Delivery. Use. Performance.'

  const name = document.createElement('span')
  name.className = 'intro-welcome-name'
  Array.from('Sachin Singh Tanwar').forEach((char, index) => {
    const piece = document.createElement('span')
    piece.className = 'intro-welcome-char'
    piece.style.setProperty('--i', String(index))
    piece.textContent = char === ' ' ? '\u00a0' : char
    name.appendChild(piece)
  })

  const rule = document.createElement('span')
  rule.className = 'intro-welcome-rule'

  layer.append(kicker, stepOne, stepTwo, name, rule)
  return layer
}

export default function Intro() {
  const [visible, setVisible] = useState(allowed)
  const [breaking, setBreaking] = useState(false)
  const [soundOn, setSoundOn] = useState(isAudioEnabled)
  const finished = useRef(false)
  const broken = useRef(false)
  const played = useRef(new Set<string>())
  const introRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const siteRef = useRef<HTMLDivElement>(null)
  const mountedAt = useRef(0)
  const readinessTimer = useRef(0)
  const settleTimer = useRef(0)
  const finishTimer = useRef(0)
  const hitTimer = useRef(0)
  const igniteTimer = useRef(0)
  const audio = useRef<AudioContext | null>(null)

  useEffect(() => subscribeAudio(setSoundOn), [])

  const playSound = useCallback((kind: 'tear' | 'settle') => {
    if (!isAudioEnabled()) return
    try {
      const AudioEngine =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioEngine) return
      const ctx = audio.current ?? new AudioEngine()
      audio.current = ctx
      if (ctx.state === 'suspended') void ctx.resume()

      // Brittle transients only. No sub-bass, no thud, no impact hit.
      const bursts =
        kind === 'tear'
          ? [
              { at: 0, dur: 0.13, cutoff: 2800, peak: 0.14, ping: 3400 },
              { at: 0.018, dur: 0.1, cutoff: 3600, peak: 0.11, ping: 4300 },
              { at: 0.045, dur: 0.09, cutoff: 4400, peak: 0.08, ping: 5300 },
              { at: 0.09, dur: 0.11, cutoff: 2400, peak: 0.06, ping: 2900 },
            ]
          : [
              { at: 0, dur: 0.08, cutoff: 3800, peak: 0.05, ping: 4600 },
              { at: 0.06, dur: 0.08, cutoff: 5000, peak: 0.038, ping: 5800 },
              { at: 0.13, dur: 0.09, cutoff: 3000, peak: 0.034, ping: 3600 },
              { at: 0.2, dur: 0.07, cutoff: 5400, peak: 0.025, ping: 6200 },
            ]
      const now = ctx.currentTime

      bursts.forEach(({ at, dur, cutoff, peak, ping }) => {
        const length = Math.max(1, Math.ceil(ctx.sampleRate * dur))
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < length; i += 1) {
          const t = i / ctx.sampleRate
          const decay = Math.exp(-t * (kind === 'tear' ? 38 : 54))
          const noise = (Math.random() * 2 - 1) * decay
          const ring = Math.sin(2 * Math.PI * (ping - t * ping * 0.18) * t) * decay * 0.42
          data[i] = noise * 0.72 + ring
        }

        const source = ctx.createBufferSource()
        source.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = cutoff
        const gain = ctx.createGain()
        const start = now + at
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(peak, start + 0.006)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
        source.connect(filter).connect(gain).connect(ctx.destination)
        source.start(start)
        source.stop(start + dur)
      })
    } catch {
      // Sound is an enhancement; the visual sequence never depends on it.
    }
  }, [])

  const soundOnce = useCallback(
    (kind: 'tear' | 'settle') => {
      if (played.current.has(kind)) return
      played.current.add(kind)
      playSound(kind)
    },
    [playSound],
  )

  useLayoutEffect(() => {
    if (!visible) return
    const root = document.documentElement
    mountedAt.current = performance.now()
    root.classList.add('intro-active')
    document.body.classList.remove('site-live', 'site-ignite', 'site-hit')

    // The real top-of-page UI is cloned once, behind the shards.
    if (siteRef.current) {
      const header = cloneRegion(document.querySelector('.site-header'))
      const hero = cloneRegion(document.querySelector('.hero'))
      if (header) siteRef.current.appendChild(header)
      if (hero) siteRef.current.appendChild(hero)
    }

    if (glassRef.current) {
      const template = document.createElement('div')
      template.className = 'intro-piece-content'
      template.appendChild(welcomeLayer())
      glassRef.current.querySelectorAll('.intro-piece').forEach((piece) => {
        piece.appendChild(template.cloneNode(true))
      })
    }

    return () => root.classList.remove('intro-active')
  }, [visible])

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    window.clearTimeout(readinessTimer.current)
    window.clearTimeout(settleTimer.current)
    window.clearTimeout(finishTimer.current)
    window.clearTimeout(hitTimer.current)
    soundOnce('tear')
    soundOnce('settle')
    setVisible(false)
    document.documentElement.classList.remove('intro-active')
    document.body.classList.remove('site-hit')
    document.body.classList.add('site-live', 'site-ignite')
    igniteTimer.current = window.setTimeout(() => document.body.classList.remove('site-ignite'), 700)
  }, [soundOnce])

  const triggerBreak = useCallback(
    (x?: number, y?: number) => {
      if (broken.current || finished.current) return
      broken.current = true

      if (typeof x === 'number' && typeof y === 'number' && introRef.current) {
        introRef.current.style.setProperty('--impact-x', String((x / window.innerWidth) * 100))
        introRef.current.style.setProperty('--impact-y', String((y / window.innerHeight) * 100))
      }

      soundOnce('tear')
      document.body.classList.add('site-hit')
      hitTimer.current = window.setTimeout(() => document.body.classList.remove('site-hit'), 140)
      setBreaking(true)
    },
    [soundOnce],
  )

  // Break as soon as real fonts and the hero image are ready, with a short
  // readable floor. A cap prevents a slow asset from holding the site hostage.
  useEffect(() => {
    if (!visible || breaking) return
    let cancelled = false
    // Measure the readable floor from the visual mount, not the passive effect,
    // so a busy first paint cannot stretch the opening past its cap.
    const start = mountedAt.current || performance.now()
    const elapsed = performance.now() - start

    const image = document.querySelector<HTMLImageElement>('.hero img')
    const imageReady = image
      ? image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          })
      : Promise.resolve()
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const cap = new Promise<void>((resolve) => {
      readinessTimer.current = window.setTimeout(resolve, Math.max(0, 1200 - elapsed))
    })

    void Promise.race([Promise.all([fontsReady, imageReady]), cap]).then(() => {
      if (cancelled) return
      const wait = Math.max(0, 900 - (performance.now() - start))
      readinessTimer.current = window.setTimeout(() => {
        if (!cancelled) triggerBreak()
      }, wait)
    })

    return () => {
      cancelled = true
      window.clearTimeout(readinessTimer.current)
    }
  }, [visible, breaking, triggerBreak])

  useEffect(() => {
    if (!breaking) return
    settleTimer.current = window.setTimeout(() => soundOnce('settle'), 540)
    finishTimer.current = window.setTimeout(finish, 1020)
    return () => {
      window.clearTimeout(settleTimer.current)
      window.clearTimeout(finishTimer.current)
    }
  }, [breaking, finish, soundOnce])

  useEffect(() => {
    if (!visible) {
      document.body.classList.add('site-live')
      return
    }
    const onKey = () => triggerBreak()
    const onPointer = (event: PointerEvent) => triggerBreak(event.clientX, event.clientY)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [visible, triggerBreak])

  useEffect(
    () => () => {
      window.clearTimeout(readinessTimer.current)
      window.clearTimeout(settleTimer.current)
      window.clearTimeout(finishTimer.current)
      window.clearTimeout(hitTimer.current)
      window.clearTimeout(igniteTimer.current)
      document.body.classList.remove('site-hit')
      void audio.current?.close()
    },
    [],
  )

  if (!visible) return null

  const introStyle = { '--impact-x': '50', '--impact-y': '46' } as CSSProperties

  return (
    <div
      ref={introRef}
      className={`intro${breaking ? ' is-breaking' : ''}`}
      style={introStyle}
      role="status"
      aria-label="Opening sequence"
    >
      <div className="intro-actions">
        <button
          type="button"
          className="intro-sound"
          data-sound={soundOn}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            window.dispatchEvent(new Event('site:toggle-audio'))
          }}
        >
          {soundOn ? 'Sound on' : 'Sound off'}
        </button>
        <button type="button" className="intro-skip" onClick={finish}>
          Skip
        </button>
      </div>

      <div className="intro-field" aria-hidden="true">
        <span className="intro-chamber" />

        <svg className="intro-monogram" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid meet">
          <path pathLength="100" d="M42 32 C74 10 22 58 62 60 C98 62 38 84 72 100" />
          <path pathLength="100" d="M116 32 C148 10 96 58 136 60 C172 62 112 84 146 100" />
          <path pathLength="100" d="M188 22 L212 22 L176 102 L200 102" />
        </svg>

        <span className="intro-crystal-slab">
          <span className="intro-crystal-slab-inner" />
        </span>

        <div ref={siteRef} className="intro-site-layer" />

        <span className="intro-welcome-effect" />

        <span className="intro-welcome-depth">
          {Array.from({ length: 3 }, (_, index) => (
            <span
              key={index}
              className={`intro-depth-plane intro-depth-plane--${index + 1}`}
              style={{ '--i': String(index) } as CSSProperties}
            />
          ))}
        </span>

        <svg className="intro-tear intro-fracture-web" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {fracturePaths.map((d) => (
            <path key={d} pathLength="100" d={d} />
          ))}
        </svg>

        <span className="intro-impact-core" />
        <span className="intro-flash" />

        <div ref={glassRef} className="intro-glass">
          {Array.from({ length: pieceCount }, (_, index) => (
            <span key={index} className={`intro-piece intro-piece--${index + 1}`} />
          ))}
        </div>

        <span className="intro-cinema">
          <span className="intro-cinema-beam" />
        </span>

        <span className="intro-rail" />
      </div>
    </div>
  )
}
