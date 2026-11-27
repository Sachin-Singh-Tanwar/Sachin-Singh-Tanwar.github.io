import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { CARD_SURFACE } from '../lib/surface'

type Tone = 'verified' | 'invalidated'

const evidenceRows: {
  id: string
  claim: string
  log: string
  commit: string
  observation: string
  status: string
  tone: Tone
}[] = [
  {
    id: 'S-01',
    claim: 'Books source repair certified',
    log: 'npm test → 48 passed',
    commit: '214c3bcd…',
    observation: 'Live board ↗ · 2026-11-26',
    status: 'VERIFIED',
    tone: 'verified',
  },
  {
    id: 'S-04',
    claim: 'Claim #4',
    log: '—',
    commit: '—',
    observation: 'Board shows CLOSED',
    status: 'INVALIDATED',
    tone: 'invalidated',
  },
  {
    id: 'S-05',
    claim: 'Claim #5',
    log: '—',
    commit: '—',
    observation: 'Board shows CLOSED',
    status: 'INVALIDATED',
    tone: 'invalidated',
  },
  {
    id: 'S-06',
    claim: 'Claim #6',
    log: '—',
    commit: '—',
    observation: 'Board shows CLOSED',
    status: 'INVALIDATED',
    tone: 'invalidated',
  },
]

const evidenceFilters = ['All', 'VERIFIED', 'INVALIDATED'] as const
type EvidenceFilter = (typeof evidenceFilters)[number]

const capabilities = [
  {
    area: 'Web',
    built: 'This site',
    sealed: 'No runtime graph dependency',
    validated: 'Build + lint + claim lint',
    proof: 'Local build verified',
  },
  {
    area: 'Data',
    built: 'Sentinel extractors',
    sealed: 'Versioned schema',
    validated: '48 tests pass',
    proof: '5/5 HEALTHY',
  },
  {
    area: 'Automation',
    built: 'Scheduled worker',
    sealed: 'Approval gates',
    validated: 'PENDING DATA GATE',
    proof: '15:05Z + 15:35Z',
  },
  {
    area: 'AI',
    built: 'Human-in-loop flows',
    sealed: 'Guardrails',
    validated: 'IN BUILD',
    proof: 'No shipped metric yet',
  },
]

const buildSteps = [
  {
    n: '01',
    title: 'Prompt',
    body: 'Start with the claim, not the decoration.',
  },
  {
    n: '02',
    title: 'Guidance + fallback',
    body: 'Modern Web Guidance + Baseline status; native path behind an @supports fallback.',
  },
  {
    n: '03',
    title: 'Playwright verification',
    body: 'Navigate, inspect DOM and computed styles, keyboard, reduced motion, 390px.',
  },
]

const architectureNodes = [
  { label: 'Portfolio source', detail: 'This site' },
  { label: 'GitHub Pages', detail: 'Public build' },
  { label: 'Browser', detail: 'Keyboard + reduced motion' },
  { label: 'Evidence repo', detail: 'Versioned extractors' },
  { label: 'Append-only data', detail: 'Scheduled rows' },
  { label: 'External trigger', detail: 'scheduled audit — external trigger' },
  { label: 'Read-only source', detail: 'Verified inputs' },
]

const enhancements = [
  {
    feature: '@scope',
    baseline: 'Baseline 2026 Newly',
    native: '@scope block',
    fallback: 'Class selectors',
    proof: 'web.dev Baseline 2026',
  },
  {
    feature: 'contrast-color()',
    baseline: 'Baseline 2026 Newly',
    native: 'contrast-color()',
    fallback: 'Explicit token',
    proof: 'Chrome I/O 2026',
  },
  {
    feature: 'animation-timeline: view()',
    baseline: 'Baseline 2026 Newly',
    native: 'view() reveal',
    fallback: 'Static content',
    proof: 'Live audit · 9 timelines',
  },
  {
    feature: 'Anchor positioning',
    baseline: 'MDN Newly / Bootstrap cautious',
    native: 'position-anchor',
    fallback: 'Absolute placement',
    proof: 'Conflict note below',
  },
  {
    feature: 'Container style queries',
    baseline: 'Baseline 2026 Newly',
    native: '@container style()',
    fallback: '@media fallback',
    proof: 'web.dev Baseline May 2026',
  },
]

function SectionHead({ index, title, note }: { index: string; title: string; note: string }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">
          {index} — {title}
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-[46ch] text-sm leading-relaxed text-white/55">{note}</p>
    </div>
  )
}

function EvidenceWorkbench() {
  const [filter, setFilter] = useState<EvidenceFilter>('All')
  const visible = evidenceRows.filter((row) => filter === 'All' || row.status === filter)

  return (
    <section
      id="evidence"
      data-proof-module="evidence-workbench"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="02"
          title="Evidence Workbench"
          note="Claim → command/log → commit → observation → status. Verified rows stay separate from INVALIDATED rows."
        />

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter evidence rows">
          {evidenceFilters.map((item) => (
            <button
              key={item}
              type="button"
              data-evidence-filter={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                filter === item
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/[0.02] text-white/55 hover:text-white'
              }`}
            >
              {item} {item === 'All' ? evidenceRows.length : evidenceRows.filter((row) => row.status === item).length}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full min-w-[760px] border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.18em]">Claim</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.18em]">Command / log</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.18em]">Commit</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.18em]">Screenshot / observation</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.18em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} data-evidence-row={row.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-4 py-4 align-top text-white/80">
                    <span className="block text-white/35">{row.id}</span>
                    {row.claim}
                  </td>
                  <td className="px-4 py-4 align-top text-white/60">{row.log}</td>
                  <td className="px-4 py-4 align-top text-white/60">{row.commit}</td>
                  <td className="px-4 py-4 align-top text-white/60">{row.observation}</td>
                  <td className="px-4 py-4 align-top">
                    <span
                      data-status={row.tone}
                      className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${
                        row.tone === 'verified'
                          ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                          : 'border-amber-300/30 bg-amber-300/10 text-amber-200'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.tone === 'invalidated' && (
                      <span className="mt-2 block text-white/40">gate: null · diff: null · duration: null</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          repair-certified: books only · other sources: configured + sealed + validated
        </p>
      </div>
    </section>
  )
}

function CapabilityMatrix() {
  return (
    <section
      id="capabilities"
      data-proof-module="capability-matrix"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="03"
          title="Capability Matrix"
          note="Built · Sealed · Validated · Proof. Future capability claims keep an explicit stage."
        />
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                <th scope="col" className="px-4 py-3 font-normal">Area</th>
                <th scope="col" className="px-4 py-3 font-normal">Built</th>
                <th scope="col" className="px-4 py-3 font-normal">Sealed</th>
                <th scope="col" className="px-4 py-3 font-normal">Validated</th>
                <th scope="col" className="px-4 py-3 font-normal">Proof</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((row) => (
                <tr key={row.area} data-capability-row={row.area} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="px-4 py-4 text-left font-semibold text-white/90">{row.area}</th>
                  <td className="px-4 py-4 text-white/65">{row.built}</td>
                  <td className="px-4 py-4 text-white/65">{row.sealed}</td>
                  <td className="px-4 py-4 font-mono text-[11px] text-cyan-200/80">{row.validated}</td>
                  <td className="px-4 py-4 font-mono text-[11px] text-white/55">{row.proof}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FocusTrapDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const nodes = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>(
        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    )
    if (nodes.length === 0) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div ref={containerRef} onKeyDown={onKeyDown} className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Focus trap</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input aria-label="Demo field one" placeholder="Field 1" className="w-24 rounded-md border border-white/15 bg-transparent px-2 py-1 text-xs" />
        <input aria-label="Demo field two" placeholder="Field 2" className="w-24 rounded-md border border-white/15 bg-transparent px-2 py-1 text-xs" />
        <button type="button" className="rounded-md border border-white/15 px-3 py-1 font-mono text-[10px] uppercase">Trap</button>
      </div>
      <p className="mt-3 text-xs text-white/45">Tab cycles inside this card.</p>
    </div>
  )
}

function BuildLab() {
  return (
    <section
      id="build-lab"
      data-proof-module="build-lab"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="04"
          title="Build Lab"
          note="The site itself is the demo: prompt → guidance with Baseline fallback → Playwright verification."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {buildSteps.map((step) => (
            <article key={step.n} data-build-step={step.n} className={`${CARD_SURFACE} min-w-0 p-6`}>
              <p className="font-mono text-3xl font-bold text-cyan-300/70">{step.n}</p>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className={`${CARD_SURFACE} min-w-0 p-6`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Visible focus token</p>
            <button
              type="button"
              className="mt-4 rounded-md border border-white/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80"
            >
              Tab to me
            </button>
            <p className="mt-4 text-xs text-white/45">2px outline · 2px offset · dark halo behind the ring.</p>
          </div>
          <FocusTrapDemo />
          <div className={`${CARD_SURFACE} min-w-0 p-6`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Claim linter</p>
            <pre className="mt-4 max-w-full overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-cyan-200/85">
              {`Claim lint OK — 21 shipped text files checked.`}
            </pre>
            <p className="mt-4 text-xs text-white/45">Build fails on forbidden Tally wording, fake rates and unlabelled STAGED copy.</p>
          </div>
          <div className={`${CARD_SURFACE} min-w-0 p-6`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">@supports fallback</p>
            <div className="enhanced-chip mt-4 inline-flex rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              Native when supported
            </div>
            <p className="mt-4 text-xs text-white/45">Same content, explicit fallback — no critical dependency.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReceiptsPanel() {
  return (
    <section
      id="receipts"
      data-proof-module="receipts-panel"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="05"
          title="Receipts Panel"
          note="Verified values only. Unresolved numbers stay labelled, never rounded into a claim."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <article className={`${CARD_SURFACE} min-w-0 p-6`} data-receipt="sentinel-tests">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Sentinel tests</p>
            <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-cyan-300">48</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">passed</p>
            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Duration under review · brief 67.86s / log 96.89s · unresolved
            </p>
          </article>
          <article className={`${CARD_SURFACE} min-w-0 p-6`} data-receipt="commits">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Evidence pins</p>
            <p className="mt-4 font-mono text-sm text-white/80">main 214c3bcd…</p>
            <p className="mt-1 font-mono text-sm text-white/80">data bc53ad87…</p>
            <p className="mt-4 text-xs text-white/45">Pins unchanged across evidence updates.</p>
          </article>
          <article className={`${CARD_SURFACE} min-w-0 p-6`} data-receipt="tally">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Tally</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-200">PENDING DATA GATE</p>
            <p className="mt-3 text-sm text-white/70">scheduled audit — external trigger</p>
            <p className="mt-4 font-mono text-[11px] text-white/45">15:05Z + 15:35Z</p>
          </article>
          <article className={`${CARD_SURFACE} min-w-0 p-6`} data-receipt="uptime">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Uptime rule</p>
            <p className="mt-4 font-mono text-sm text-white/80">STAGED rows excluded</p>
            <p className="mt-3 font-mono text-sm text-white/80">0 STAGED numbers counted</p>
            <p className="mt-4 text-xs text-white/45">Replay rows never enter the denominator.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function ArchitectureMap() {
  return (
    <section
      id="architecture"
      data-proof-module="architecture-map"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="06"
          title="Architecture Map"
          note="Static CSS diagram — repo lanes, public build, browser, external trigger and append-only evidence."
        />
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {architectureNodes.map((node, index) => (
              <div key={node.label} data-architecture-node={node.label} className="relative">
                <div className={`${CARD_SURFACE} h-full p-4`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/60">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white/90">{node.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{node.detail}</p>
                </div>
                {index !== architectureNodes.length - 1 && (
                  <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden -translate-y-1/2 font-mono text-white/25 lg:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            Static CSS diagram · no runtime graph dependency
          </p>
        </div>
      </div>
    </section>
  )
}

function ProgressiveEnhancementMatrix() {
  return (
    <section
      id="enhancement"
      data-proof-module="progressive-enhancement-matrix"
      className="scroll-mt-14 border-t border-white/5 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          index="07"
          title="Progressive Enhancement Matrix"
          note="Feature · Baseline status · native path · fallback · proof. Advanced APIs never carry critical work."
        />
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full min-w-[860px] border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.16em]">Feature</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.16em]">Baseline status</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.16em]">Native path</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.16em]">Fallback</th>
                <th scope="col" className="px-4 py-3 font-normal uppercase tracking-[0.16em]">Proof</th>
              </tr>
            </thead>
            <tbody>
              {enhancements.map((row) => (
                <tr key={row.feature} data-enhancement-row={row.feature} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="px-4 py-4 text-left font-normal text-white/85">{row.feature}</th>
                  <td className="px-4 py-4 text-cyan-200/75">{row.baseline}</td>
                  <td className="px-4 py-4 text-white/65">{row.native}</td>
                  <td className="px-4 py-4 text-white/65">{row.fallback}</td>
                  <td className="px-4 py-4 text-white/50">{row.proof}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-relaxed text-amber-100/85">
          Anchor positioning: MDN = Baseline 2026 Newly; Bootstrap.build = “close but not there yet”. Resolution: enhancement + fallback only, no critical dependency.
        </p>
      </div>
    </section>
  )
}

export default function ProofModules() {
  return (
    <>
      <EvidenceWorkbench />
      <CapabilityMatrix />
      <BuildLab />
      <ReceiptsPanel />
      <ArchitectureMap />
      <ProgressiveEnhancementMatrix />
    </>
  )
}
