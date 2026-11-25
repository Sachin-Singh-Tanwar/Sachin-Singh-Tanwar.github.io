import { useEffect, useRef } from 'react'
import type { Project } from '../data/schema'
import ProjectCover from './ProjectCover'

type Props = {
  project: Project
  index: number
  onClose: () => void
}

export default function ProjectModal({ project, index, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

    focusable()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  const building = project.status === 'building'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-panel/95 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
              {building ? 'Building' : 'Case study'} · {project.year}
            </p>
            <h2 id="project-modal-title" className="mt-2 text-2xl font-bold sm:text-3xl">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-white/60">{project.tagline}</p>
          </div>
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1 text-lg leading-none text-white/60 transition hover:border-white/40 hover:text-white"
          >
            ×
          </button>
        </div>

        <div data-project-cover-strip className="relative mt-6 h-[140px] overflow-hidden rounded-xl border border-white/10">
          <ProjectCover index={index} category={project.category} />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-3 left-4 z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="tabular-nums text-white/85">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-white/45">{project.category}</span>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Problem
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{project.problem}</p>
          </section>
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Solution
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{project.solution}</p>
          </section>
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Impact
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{project.impact}</p>
          </section>
        </div>

        {building && (
          <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            In development — case study coming soon
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/60"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:text-cyan-200"
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
