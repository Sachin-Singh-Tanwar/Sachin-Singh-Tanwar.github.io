import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }

const SMOKE_LIFE = 560
const SMOKE_GAP = 45
const MAX_SMOKE = 14

export default function CursorAccent() {
  const [enabled] = useState(
    () =>
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let latest: Point = { x: -200, y: -200 }
    let lastEmit = 0
    let lastPuff: Point = { x: -200, y: -200 }
    const timers = new Set<number>()

    const paint = () => {
      frame = 0
      const move = `translate3d(${latest.x}px, ${latest.y}px, 0)`
      if (leadRef.current) leadRef.current.style.transform = move
      if (trailRef.current) trailRef.current.style.transform = move
    }

    const clearSmoke = () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
      rootRef.current?.querySelectorAll('.cursor-smoke').forEach((node) => node.remove())
      lastPuff = { x: -200, y: -200 }
    }

    const emitSmoke = (x: number, y: number, now: number) => {
      const root = rootRef.current
      if (!root) return
      if (now - lastEmit < SMOKE_GAP) return
      if (Math.hypot(x - lastPuff.x, y - lastPuff.y) < 8) return
      lastEmit = now
      lastPuff = { x, y }

      const existing = root.querySelectorAll('.cursor-smoke')
      if (existing.length >= MAX_SMOKE) existing[0].remove()

      const puff = document.createElement('span')
      puff.className = 'cursor-smoke'
      puff.style.setProperty('--sx', `${x}px`)
      puff.style.setProperty('--sy', `${y}px`)
      puff.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 20)}px`)
      puff.style.setProperty('--dy', `${-12 - Math.round(Math.random() * 10)}px`)
      root.appendChild(puff)

      const timer = window.setTimeout(() => {
        puff.remove()
        timers.delete(timer)
      }, SMOKE_LIFE + 40)
      timers.add(timer)
    }

    const onMove = (event: PointerEvent) => {
      latest = { x: event.clientX, y: event.clientY }
      const target = event.target as Element | null
      const hot = Boolean(target?.closest('a:not(.device-laptop), button, [data-cursor-wash]'))
      rootRef.current?.classList.toggle('is-hot', hot)
      if (hot) emitSmoke(latest.x, latest.y, performance.now())
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    const onLeave = () => {
      rootRef.current?.classList.remove('is-hot')
      clearSmoke()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', clearSmoke, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      clearSmoke()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', clearSmoke)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor-accent" aria-hidden="true">
      <span ref={trailRef} className="cursor-accent-trail" />
      <span ref={leadRef} className="cursor-accent-dot" />
    </div>
  )
}
