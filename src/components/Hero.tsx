import { useEffect, useState } from 'react'
import projectData from '../data/projects.json'
import { projectSchema, type Project } from '../data/schema'
import { CARD_SURFACE } from '../lib/surface'
import { cn } from '../lib/cn'

const projects: Project[] = projectData.map((item) => projectSchema.parse(item))
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-white/35">{label}</span>
      <span className="text-right text-white/85">{value}</span>
    </div>
  )
}

export default function Hero() {
  const [clock, setClock] = useState(() => istTime())

  useEffect(() => {
    const id = window.setInterval(() => setClock(istTime()), 30000)
    return () => window.clearInterval(id)
  }, [])

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
            className="mt-6 max-w-[900px] text-balance font-sans text-[52px] font-semibold leading-[0.98] tracking-[-0.045em] text-white md:text-[88px]"
          >
            Web systems that{' '}
            <span className="font-serif italic" style={{ color: 'oklch(0.78 0.12 195)' }}>
              show the receipt.
            </span>
          </h1>
          <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-white/60 md:text-base">
            Fast, accessible builds with evidence attached — every claim links to a commit, test, or browser observation.
          </p>
          <div className="mt-8 flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="#projects"
              className="w-full rounded-full bg-white px-7 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white/90 sm:w-auto"
            >
              See selected work
            </a>
            <a
              href="#services"
              className="border-b border-white/20 pb-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:border-white/50 hover:text-white"
            >
              See services
            </a>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            Evidence Workbench · IN BUILD · Build Lab · IN BUILD · Tally case study · PENDING DATA GATE
          </p>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 md:p-8 lg:col-span-3')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Status</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-cyan)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
            </span>
            Available for work
          </div>
          <div className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em]">
            <StatusRow label="Currently" value="building — see selected work" />
            <StatusRow label="Response" value="within 24h" />
            <StatusRow label="Local time" value={`${clock || '—'} IST`} />
            <StatusRow label="Shipped proofs" value={String(liveCount)} />
            <StatusRow label="In build" value={String(buildingCount)} />
            <StatusRow label="STAGED NUMBERS COUNTED" value="0" />
          </div>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 lg:col-span-6')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Proof counters</p>
          <p className="mt-4 font-mono text-[13px] leading-relaxed text-[var(--accent-cyan)]">
            {liveCount} SHIPPED PROOFS · {buildingCount} IN BUILD · 0 STAGED NUMBERS COUNTED
          </p>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-6 lg:col-span-6')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Disciplines</p>
          <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-[var(--accent-purple)]">
            {new Set(projects.map((project) => project.category)).size}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
            {Array.from(new Set(projects.map((project) => project.category))).join(' / ')}
          </p>
        </article>

        <article className={cn(CARD_SURFACE, wrap, 'p-0 lg:col-span-8')}>
          <a
            href="https://sachin-singh-tanwar.github.io/sentinel/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Sentinel board"
            className="group grid min-h-[230px] w-full grid-cols-1 text-left sm:grid-cols-2"
          >
            <span className="flex flex-col justify-between gap-8 border-b border-white/10 p-6 sm:border-b-0 sm:border-r">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                WEB PROOF / FEATURED 01
              </span>
              <span>
                <span className="block font-mono text-5xl font-bold tabular-nums text-[var(--accent-cyan)]">5/5</span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                  HEALTHY
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                WEB PROOF · 5/5 HEALTHY · 0 SCHEMA FAILURES · STAGED REPLAY LABELLED
              </span>
            </span>
            <span className="flex flex-col justify-center p-6">
              <span className="text-xl font-semibold text-[var(--text-primary)]">Sentinel</span>
              <span className="mt-2 text-sm text-[var(--text-muted)]">
                Board-level proof for versioned extractors, with STAGED replays kept out of repair claims.
              </span>
              <span className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/60">
                  0 schema failures
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/60">
                  0 required nulls
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/60">
                  VIEW INCIDENT #1
                </span>
              </span>
              <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                configured + sealed + validated · repair-certified: books only
              </span>
              <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200/80 transition group-hover:text-cyan-100">
                Open Sentinel board
              </span>
            </span>
          </a>
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
    </section>
  )
}
