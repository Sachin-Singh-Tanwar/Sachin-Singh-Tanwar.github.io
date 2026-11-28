import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { featuredWork, type FeaturedWork, type Viewport } from '../data/featuredWork'
import { playTick } from '../lib/audioBus'
import { usePointerTilt } from '../lib/usePointerTilt'
import { useProjectRoute } from '../lib/useProjectRoute'

type Filter = 'All' | FeaturedWork['category']

const filters: Filter[] = ['All', ...Array.from(new Set(featuredWork.map((item) => item.category)))]
const projectIds = featuredWork.map((item) => item.id)
const viewportWidth: Record<Viewport, number> = { desktop: 100, tablet: 72, mobile: 46 }

// Mirrors the CSS breakpoints: the capture follows the device actually in use.
function detectViewport(): Viewport {
  if (window.innerWidth <= 760) return 'mobile'
  if (window.innerWidth <= 1024) return 'tablet'
  return 'desktop'
}

function mediaFor(item: FeaturedWork, viewport: Viewport) {
  return {
    src: item.imageByViewport?.[viewport] ?? item.image,
    label: item.imageLabelByViewport?.[viewport] ?? item.imageLabel,
    aspect: item.imageAspectByViewport?.[viewport] ?? '16 / 9',
  }
}

function Media({ item, viewport = 'desktop' }: { item: FeaturedWork; viewport?: Viewport }) {
  const media = mediaFor(item, viewport)
  if (media.src) {
    return <img src={media.src} alt={item.imageAlt ?? item.title} loading="lazy" decoding="async" />
  }
  if (item.diagram) {
    return (
      <div
        className="preview-diagram"
        aria-label={`${item.diagram.from} to ${item.diagram.to} gives ${item.diagram.result}`}
      >
        <span>{item.diagram.from}</span>
        <i aria-hidden="true">→</i>
        <span>{item.diagram.to}</span>
        <i aria-hidden="true">→</i>
        <span className="diagram-result">{item.diagram.result}</span>
      </div>
    )
  }
  return null
}

function DeviceFrame({
  item,
  viewport,
  children,
}: {
  item: FeaturedWork
  viewport: Viewport
  children: ReactNode
}) {
  const media = mediaFor(item, viewport)
  return (
    <div
      className={`device-frame device-frame--${viewport}`}
      data-viewport={viewport}
      data-tilt
      style={{ '--capture-aspect': media.aspect } as CSSProperties}
    >
      <div className="device-frame__bezel">
        <div className="preview-media" data-viewport={viewport}>
          {children}
          {media.label && <span className="preview-label">{media.label}</span>}
        </div>
      </div>
      <span className="device-frame__chin" aria-hidden="true" />
    </div>
  )
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('All')
  const [activeId, setActiveId] = useState(featuredWork[0].id)
  const [viewportOverride, setViewportOverride] = useState<Viewport | null>(null)
  const [autoViewport, setAutoViewport] = useState<Viewport>(() => detectViewport())
  const viewport = viewportOverride ?? autoViewport
  const [lens, setLens] = useState({ x: 50, y: 50, active: false })
  const [shattering, setShattering] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)
  const openTimer = useRef(0)
  const wasOpenRef = useRef(false)
  const { detailId, openProject, closeProject } = useProjectRoute(projectIds)
  usePointerTilt(previewRef)

  useEffect(() => {
    const update = () => setAutoViewport(detectViewport())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const visible = useMemo(
    () => (filter === 'All' ? featuredWork : featuredWork.filter((item) => item.category === filter)),
    [filter],
  )

  const active = visible.find((item) => item.id === activeId) ?? visible[0] ?? featuredWork[0]
  const detail = detailId ? featuredWork.find((item) => item.id === detailId) ?? null : null

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  useEffect(() => {
    if (detail) {
      wasOpenRef.current = true
      const frame = window.requestAnimationFrame(() => detailHeadingRef.current?.focus())
      return () => window.cancelAnimationFrame(frame)
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      openButtonRef.current?.focus()
    }
  }, [detail])

  const transition = (update: () => void) => {
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doc.startViewTransition && !reduced) doc.startViewTransition(update)
    else update()
  }

  const handleOpen = () => {
    window.clearTimeout(openTimer.current)
    playTick()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition(() => openProject(active.id))
      return
    }
    setShattering(true)
    openTimer.current = window.setTimeout(() => {
      setShattering(false)
      transition(() => openProject(active.id))
    }, 180)
  }

  const handleClose = () => transition(() => closeProject())

  const handleListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-work-item]') ?? [])
    if (buttons.length === 0) return
    const current = buttons.findIndex((button) => button.dataset.id === active.id)
    let next = current
    if (event.key === 'ArrowDown') next = (current + 1) % buttons.length
    if (event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = buttons.length - 1
    event.preventDefault()
    buttons[next].focus()
    setActiveId(buttons[next].dataset.id ?? featuredWork[0].id)
  }

  const handleLensMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    setLens({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }

  const viewportValue = viewportWidth[viewport]

  return (
    <section id="work" className="section work-section" data-scroll-progress data-scroll-section>
      <div
        className="section-head"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.04"
      >
        <p className="section-index">01 / Selected work</p>
        <div className="section-head-row">
          <h2>Work that holds up in delivery.</h2>
          <p>Browse by discipline. Open any project to see the live surface.</p>
        </div>
      </div>

      {detail ? (
        <article className="project-detail" aria-labelledby="project-detail-title">
          <span className="detail-split detail-split--left" aria-hidden="true" />
          <span className="detail-split detail-split--right" aria-hidden="true" />
          <button type="button" className="detail-back" onClick={handleClose}>
            <span aria-hidden="true">←</span> All work
          </button>
          <div className="detail-grid">
            <div className="detail-copy">
              <p className="section-index">
                {detail.no} / {detail.type}
              </p>
              <h3 id="project-detail-title" ref={detailHeadingRef} tabIndex={-1}>
                {detail.title}
              </h3>
              <p className="detail-lede">{detail.summary}</p>
              <p className="detail-body">{detail.detail}</p>
              <div className="tag-row">
                {detail.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a href={detail.href} target="_blank" rel="noreferrer" className="text-link">
                {detail.hrefLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="detail-media">
              <DeviceFrame item={detail} viewport={viewport}>
                <Media item={detail} viewport={viewport} />
              </DeviceFrame>
            </div>
          </div>
        </article>
      ) : (
        <div className="work-explorer" ref={previewRef}>
          <aside
            className="work-sidebar"
            data-scroll-progress
            data-scroll-detail
            data-scroll-offset="0.12"
          >
            <div className="work-filters" role="group" aria-label="Filter selected work">
              {filters.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  data-active={filter === item}
                  aria-pressed={filter === item}
                  style={{ '--i': String(index) } as CSSProperties}
                  onClick={() => {
                    playTick()
                    setFilter(item)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="work-list" ref={listRef} onKeyDown={handleListKeyDown}>
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-work-item
                  data-id={item.id}
                  className="work-item"
                  data-active={active.id === item.id}
                  aria-pressed={active.id === item.id}
                  onClick={() => {
                    playTick()
                    setActiveId(item.id)
                  }}
                >
                  <span className="work-no">{item.no}</span>
                  <span className="work-item-main">
                    <strong>{item.title}</strong>
                    <small>{item.type}</small>
                  </span>
                  <span className="work-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <p className="work-foot">Selected builds · 2026</p>
          </aside>

          <article
            className={`work-preview${shattering ? ' is-shattering' : ''}`}
            key={active.id}
            data-tilt
          >
            <div
              className="preview-topline"
              data-scroll-progress
              data-scroll-detail
              data-scroll-offset="0.2"
            >
              <span>{active.type}</span>
              <span>{active.no} / 03</span>
            </div>

            <div
              className="preview-viewport"
              style={{ '--preview-width': `${viewportValue}%` } as CSSProperties}
              onPointerMove={handleLensMove}
              onPointerLeave={() => setLens((current) => ({ ...current, active: false }))}
            >
              <DeviceFrame item={active} viewport={viewport}>
                <Media item={active} viewport={viewport} />
              </DeviceFrame>

              <div
                className={`xray-lens${lens.active ? ' is-active' : ''}`}
                style={
                  {
                    '--lens-x': `${lens.x}%`,
                    '--lens-y': `${lens.y}%`,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                <div className="xray-lens-inner">
                  <span>X-RAY / {active.no}</span>
                  <strong>{active.type}</strong>
                  <div className="xray-tags">
                    {active.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <small>{active.category} · public link</small>
                </div>
              </div>
            </div>

            <div
              className="viewport-control"
              role="group"
              aria-label="Viewport morph"
            >
              <div className="viewport-buttons">
                {[...(Object.keys(viewportWidth) as Viewport[]), 'auto' as const].map((size) => {
                  const activeChoice = size === 'auto' ? viewportOverride === null : viewportOverride === size
                  return (
                    <button
                      key={size}
                      type="button"
                      data-active={activeChoice}
                      aria-pressed={activeChoice}
                      onClick={() => {
                        playTick()
                        setViewportOverride(size === 'auto' ? null : size)
                      }}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <input
                type="range"
                min="46"
                max="100"
                value={viewportValue}
                aria-label="Preview viewport width"
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setViewportOverride(value < 59 ? 'mobile' : value < 86 ? 'tablet' : 'desktop')
                }}
              />
              <span className="viewport-label">Device captures · STAGED DEMO</span>
            </div>

            <div className="preview-body">
              <h3>{active.title}</h3>
              <p className="preview-summary">{active.summary}</p>
              <p className="preview-detail">{active.detail}</p>
              <div className="tag-row">
                {active.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="preview-actions">
                <button type="button" className="text-link text-link-button" ref={openButtonRef} onClick={handleOpen}>
                  Open case <span aria-hidden="true">→</span>
                </button>
                <a href={active.href} target="_blank" rel="noreferrer" className="preview-public-link">
                  {active.hrefLabel} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
