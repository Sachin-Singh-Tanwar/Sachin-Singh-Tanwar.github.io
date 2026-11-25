import { useEffect, useRef, useState } from 'react'

export default function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setAllowed(mq.matches && window.innerWidth >= 1024)
    update()
    window.addEventListener('resize', update)
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    if (!allowed) return

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      setVisible(true)
    }
    const onOver = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null
      setHovering(Boolean(el?.closest('a, button, [role="button"], input, [data-cursor-hover]')))
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)

    let raf = 0
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18
      current.current.y += (target.current.y - current.current.y) * 0.18
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [allowed])

  if (!allowed) return null

  return (
    <div
      ref={ref}
      data-magnetic-cursor
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-white/50 mix-blend-difference transition-[width,height,background-color,opacity] duration-200 ${
        hovering ? 'h-12 w-12 bg-white/20' : 'h-6 w-6'
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
