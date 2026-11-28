import { type CSSProperties, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { coreStack } from '../data/featuredWork'
import { playTick } from '../lib/audioBus'
import { usePointerTilt } from '../lib/usePointerTilt'

const capabilities = [
  {
    no: '01',
    title: 'Web & product',
    text: 'Interfaces, component systems and pages built for use, speed and conversion.',
    items: ['React / Next.js', 'TypeScript', 'Responsive UI'],
  },
  {
    no: '02',
    title: 'Data & dashboards',
    text: 'Clear views over raw sources so daily decisions do not depend on a spreadsheet.',
    items: ['Python / Pandas', 'SQL / PostgreSQL', 'Power BI'],
  },
  {
    no: '03',
    title: 'Workflow systems',
    text: 'APIs, scheduled jobs and connected services with states people can follow.',
    items: ['FastAPI', 'Django REST', 'Integrations'],
  },
  {
    no: '04',
    title: 'Delivery quality',
    text: 'Fast load, keyboard use and browser checks before anything is called done.',
    items: ['Performance', 'Accessibility', 'Testing'],
  },
]

const pipeline = [
  {
    no: 'A',
    title: 'Optical Frontend',
    text: 'React · TypeScript · responsive views',
  },
  {
    no: 'B',
    title: 'Python API Core',
    text: 'FastAPI · Django REST · jobs',
  },
  {
    no: 'C',
    title: 'SQL Data Engine',
    text: 'PostgreSQL · MySQL · Pandas',
  },
]

const dockTokens = ['React', 'Python', 'SQL', 'TypeScript']

function StackGroup({ hidden = false, reverse = false }: { hidden?: boolean; reverse?: boolean }) {
  const items = reverse ? [...coreStack].reverse() : coreStack
  return (
    <div className="stack-group" aria-hidden={hidden}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

function StackDock() {
  const [offsets, setOffsets] = useState<Record<string, number>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragging = useRef<{ id: string; startX: number; base: number } | null>(null)

  const down = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = { id, startX: event.clientX, base: offsets[id] ?? 0 }
    setDraggingId(id)
    playTick()
  }

  const move = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    const current = dragging.current
    if (!current || current.id !== id) return
    const delta = Math.max(-72, Math.min(72, event.clientX - current.startX))
    setOffsets((previous) => ({ ...previous, [id]: current.base + delta }))
  }

  const up = (id: string) => {
    if (dragging.current?.id !== id) return
    dragging.current = null
    setDraggingId(null)
    setOffsets((previous) => ({ ...previous, [id]: 0 }))
  }

  return (
    <div className="stack-dock" role="group" aria-label="Drag stack tokens">
      <span className="stack-dock-label">Stack dock · drag</span>
      <div className="stack-dock-track">
        {dockTokens.map((token) => (
          <button
            key={token}
            type="button"
            className="stack-dock-token"
            style={{ '--drag-x': `${offsets[token] ?? 0}px` } as CSSProperties}
            data-dragging={draggingId === token}
            onPointerDown={(event) => down(token, event)}
            onPointerMove={(event) => move(token, event)}
            onPointerUp={() => up(token)}
            onPointerCancel={() => up(token)}
            onFocus={() => playTick()}
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CapabilitiesSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState(0)
  usePointerTilt(gridRef)

  return (
    <section
      id="capabilities"
      className="section capabilities-section"
      data-scroll-progress
      data-scroll-section
    >
      <div
        className="section-head section-head-light"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.04"
      >
        <p className="section-index">02 / Capabilities</p>
        <div className="section-head-row">
          <h2>Built for use, not just for launch.</h2>
          <p>Product thinking, data clarity and dependable delivery in one practice.</p>
        </div>
      </div>

      <div className="pipeline" data-reveal data-scroll-progress data-scroll-offset="0.1">
        <div className="pipeline-rail" aria-hidden="true">
          <span className="pipeline-pipe pipeline-pipe--one"><i /><i /><i /></span>
          <span className="pipeline-pipe pipeline-pipe--two"><i /><i /><i /></span>
        </div>
        {pipeline.map((node, index) => (
          <button
            key={node.no}
            type="button"
            className="pipeline-node"
            data-active={activeNode === index}
            data-dim={activeNode !== index}
            onPointerEnter={() => {
              if (activeNode !== index) playTick()
              setActiveNode(index)
            }}
            onFocus={() => setActiveNode(index)}
            onClick={() => setActiveNode(index)}
          >
            <span className="pipeline-no">{node.no}</span>
            <strong>{node.title}</strong>
            <span className="pipeline-text">{node.text}</span>
            <span className="pipeline-wire" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="capability-grid" ref={gridRef}>
        {capabilities.map((item, index) => (
          <article
            key={item.no}
            className="capability-card"
            data-stand
            data-tilt
            data-scroll-progress
            data-scroll-offset={(index * 0.12).toFixed(2)}
          >
            <p className="cap-no">{item.no}</p>
            <h3>{item.title}</h3>
            <p className="cap-text">{item.text}</p>
            <ul>
              {item.items.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        id="stack"
        className="stack-band"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.2"
      >
        <p
          className="stack-label"
          data-scroll-progress
          data-scroll-detail
          data-scroll-offset="0.26"
        >
          Core stack
        </p>
        <div className="stack-marquee" onPointerEnter={() => playTick()}>
          <div className="stack-track">
            <StackGroup />
            <StackGroup hidden />
          </div>
        </div>
        <div className="stack-marquee stack-marquee-reverse" onPointerEnter={() => playTick()}>
          <div className="stack-track">
            <StackGroup reverse />
            <StackGroup reverse hidden />
          </div>
        </div>
        <StackDock />
      </div>
    </section>
  )
}
