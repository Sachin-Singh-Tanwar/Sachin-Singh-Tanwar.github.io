import { useEffect, useState } from 'react'
import { scrollToSection } from '../lib/useSmoothScroll'

const stops = [
  { id: 'top', label: 'Top' },
  { id: 'work', label: 'Work' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'stack', label: 'Stack' },
  { id: 'lab', label: 'Lab' },
  { id: 'contact', label: 'Contact' },
]

export default function ScrollRail() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    const nodes = stops
      .map((stop) => document.getElementById(stop.id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="scroll-rail" aria-label="Section progress">
      {stops.map((stop) => (
        <button
          key={stop.id}
          type="button"
          data-active={active === stop.id}
          aria-label={stop.label}
          onClick={() => scrollToSection(stop.id)}
        >
          <span />
        </button>
      ))}
    </nav>
  )
}
