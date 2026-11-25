import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import projectData from '../data/projects.json'
import { projectSchema, type Project } from '../data/schema'
import { CARD_SURFACE } from '../lib/surface'
import { cn } from '../lib/cn'
import ProjectCover from './ProjectCover'
import ProjectModal from './ProjectModal'

const projects: Project[] = projectData.map((item) => projectSchema.parse(item))
const featured = projects[0]
const shippedCount = projects.length
const categories = Array.from(new Set(projects.map((project) => project.category)))
const liveCount = projects.filter((project) => project.status === 'live').length
const buildingCount = projects.filter((project) => project.status === 'building').length

const stack = ['Python', 'TypeScript', 'React', 'Node', 'Postgres', 'Playwright']

function istTime() {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function Hero() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [clock, setClock] = useState('')
  const closeModal = useCallback(() => setSelected(null), [])
  const tiltRef = useRef<HTMLButtonElement>(null)
  const glareRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setClock(istTime())
    const id = window.setInterval(() => setClock(istTime()), 30000)
    return () => window.clearInterval(id)
  }, [])

  const featuredIndex = useMemo(() => Math.max(0, projects.findIndex((item) => item.id === featured.id)), [])

  const onFeatureMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = tiltRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.transition = 'transform 90ms linear'
    el.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 8).toFixed(2)}deg) scale3d(1.01,1.01,1.01)`
    if (glareRef.current) {
      glareRef.current.style.opacity = '1'
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.16), transparent 55%)`
    }
  }

  const onFeatureLeave = () => {
    const el = tiltRef.current
    if (!el) return
    el.style.transition = 'transform 500ms cubic-bezier(0.22,1,0.36,1)'
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  const wrap = 'reveal-on-scroll col-span-12'

  return (
    <section id="hero" className="px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-3 auto-rows-[minmax(150px,auto)] md:gap-4">
        <article className={cn(CARD_SURFACE, wrap, 'p-6 md:p-8 lg:col-span-9')}>
          <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-white/50">
            Sachin Singh Tanwar · Automation Engineer
          </p>
          <h1
            data-pitch
            style={{ fontFamily: 'Inter, sans-serif' }}
            className="mt-6 max-w-[900px] text-balance font-sans text-[56px] font-semibold leading-[0.95] tracking-[-0.045em] text-white md:text-[96px]"
          >
            I build automation
            <br className="hidden xl:block" /> that{' '}
            <span
              className="font-serif italic"
              style={{ color: 'oklch(0.78 0.12 195)' }}
            >
              proves it ran
            </span>
            .
          </h1>
          <div className="mt-8 flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="#projects"
              className="w-full rounded-full bg-white px-7 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="border-b border-white/20 pb-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:border-white/50 hover:text-white"
            >
              Get in touch
            </a>
          </div>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 md:p-8 lg:col-span-3')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Status</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-cyan)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
            </span>
            Available for Work
          </div>
          <div className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em]">
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-white/35">Currently</span>
              <span className="text-right text-white/85">building — see selected work</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-white/35">Response</span>
              <span className="text-right text-white/85">within 24h</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-white/35">Local time</span>
              <span className="tabular-nums text-right text-white/85">{clock || '—'} IST</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-white/35">Live projects</span>
              <span className="tabular-nums text-right text-white/85">{liveCount}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-white/35">In build</span>
              <span className="tabular-nums text-right text-white/85">{buildingCount}</span>
            </div>
          </div>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 lg:col-span-6')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Projects</p>
          <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-[var(--accent-cyan)]">
            {shippedCount}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
            {liveCount} live
          </p>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 lg:col-span-6')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Disciplines</p>
          <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-[var(--accent-purple)]">
            {categories.length}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
            {categories.join(' / ')}
          </p>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-0 lg:col-span-8')}>
          <button
            ref={tiltRef}
            type="button"
            data-featured-card
            onMouseMove={onFeatureMove}
            onMouseLeave={onFeatureLeave}
            onClick={() => setSelected(featured)}
            aria-label={`Open featured project ${featured.title}`}
            className="group relative flex min-h-[230px] w-full overflow-hidden rounded-2xl text-left"
          >
            <span
              ref={glareRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
            />
            <span className="relative block w-1/2 shrink-0 overflow-hidden bg-[#08080a]">
              <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                <ProjectCover index={featuredIndex} category={featured.category} capture={featured.capture} />
              </span>
            </span>
            <span className="flex w-1/2 flex-col justify-center p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Featured / 01
              </span>
              <span className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{featured.title}</span>
              <span className="mt-1 text-sm text-[var(--text-muted)]">{featured.tagline}</span>
              <span className="mt-4 flex flex-wrap gap-2">
                {featured.tech.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/60">
                    {tech}
                  </span>
                ))}
              </span>
              <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                Open case study
              </span>
              <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {featured.status} · {featured.year} · {featured.tech[0]}
              </span>
            </span>
          </button>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 lg:col-span-4')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Stack</p>
          <div className="mt-4 divide-y divide-white/5 font-mono text-[11px] tracking-[0.08em]">
            {stack.map((item) => (
              <div key={item} className="flex items-center justify-between gap-3 py-2 text-white/75">
                <span>{item}</span>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
              </div>
            ))}
          </div>
        </article>
      </div>
      {selected && (
        <ProjectModal
          project={selected}
          index={Math.max(0, projects.findIndex((item) => item.id === selected.id))}
          onClose={closeModal}
        />
      )}
    </section>
  )
}
