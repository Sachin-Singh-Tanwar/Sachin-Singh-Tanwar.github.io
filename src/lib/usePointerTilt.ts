import { useEffect, type RefObject } from 'react'

type Latest = {
  target: HTMLElement | null
  x: number
  y: number
}

export function usePointerTilt<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let latest: Latest = { target: null, x: 0, y: 0 }

    const reset = (target: HTMLElement) => {
      target.style.setProperty('--tilt-x', '0deg')
      target.style.setProperty('--tilt-y', '0deg')
      target.style.setProperty('--glare-x', '50%')
      target.style.setProperty('--glare-y', '50%')
    }

    const apply = () => {
      frame = 0
      const target = latest.target
      if (!target) return
      const rect = target.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const px = Math.min(1, Math.max(0, (latest.x - rect.left) / rect.width))
      const py = Math.min(1, Math.max(0, (latest.y - rect.top) / rect.height))
      target.style.setProperty('--tilt-x', `${((0.5 - py) * 6).toFixed(2)}deg`)
      target.style.setProperty('--tilt-y', `${((px - 0.5) * 8).toFixed(2)}deg`)
      target.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
      target.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
    }

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-tilt]')
      if (!target || !root.contains(target)) return
      latest = { target, x: event.clientX, y: event.clientY }
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-tilt]')
      if (!target || !root.contains(target)) return
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return
      reset(target)
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerout', onOut)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerout', onOut)
    }
  }, [ref])
}
