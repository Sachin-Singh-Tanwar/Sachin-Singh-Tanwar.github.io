import { useEffect } from 'react'

function collect(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-progress]'))
}

export function useScrollProgress() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shell = document.querySelector<HTMLElement>('.site-shell')
    let nodes = collect()
    let frame = 0
    let pendingRefresh = false
    const currents = new Map<HTMLElement, number>()
    let primed = false

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      let settling = false

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const offset = Number(node.dataset.scrollOffset ?? 0)
        // Scroll motion is tied to the part actually on screen, not to a
        // section top that may be long gone before the effect finishes.
        const visible = Math.max(0, Math.min(rect.bottom, viewport) - Math.max(rect.top, 0))
        const visibleSpan = Math.max(1, Math.min(rect.height, viewport))
        const raw =
          node.dataset.scrollMode === 'exit'
            ? rect.bottom / viewport
            : visible / visibleSpan
        const clamped = Math.min(1, Math.max(0, raw))
        const target = Math.min(1, Math.max(0, (clamped - offset) / (1 - offset)))
        // A short damped follow adds a few frames of lag so the effect settles
        // while the section is still on screen, without changing its mapping.
        const current = primed ? (currents.get(node) ?? target) : target
        const next = current + (target - current) * 0.24
        const settled = Math.abs(target - next) < 0.002
        const progress = settled ? target : next
        currents.set(node, progress)
        node.style.setProperty('--progress', progress.toFixed(3))
        if (!settled) settling = true
      })

      primed = true
      if (settling) schedule()
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const scheduleRefresh = () => {
      if (pendingRefresh) return
      pendingRefresh = true
      window.requestAnimationFrame(() => {
        pendingRefresh = false
        nodes = collect()
        schedule()
      })
    }

    const observer = new MutationObserver(scheduleRefresh)
    if (shell) observer.observe(shell, { childList: true, subtree: true })

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', scheduleRefresh)
    window.addEventListener('hashchange', scheduleRefresh)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', scheduleRefresh)
      window.removeEventListener('hashchange', scheduleRefresh)
    }
  }, [])
}
