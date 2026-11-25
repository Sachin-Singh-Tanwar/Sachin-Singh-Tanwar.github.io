import { useRef, type MouseEvent as ReactMouseEvent } from 'react'
import type { Project } from '../data/schema'
import { CARD_SURFACE } from '../lib/surface'
import ProjectCover from './ProjectCover'

type Props = {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export default function ProjectCard({ project, index, onOpen }: Props) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const glareRef = useRef<HTMLSpanElement>(null)
  const building = project.status === 'building'

  const handleMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.transition = 'transform 90ms linear'
    el.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 10).toFixed(2)}deg) rotateY(${((px - 0.5) * 10).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`
    if (glareRef.current) {
      glareRef.current.style.opacity = '1'
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.22), transparent 55%)`
    }
  }

  const handleLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 500ms cubic-bezier(0.22,1,0.36,1)'
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <button
      ref={cardRef}
      type="button"
      data-project-card=""
      onClick={() => onOpen(project)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={`Open details for ${project.title}`}
      className={`${CARD_SURFACE} group relative flex h-full w-full flex-col overflow-hidden text-left`}
    >
      <span
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
      />
      <div data-cover className="relative aspect-[16/10] w-full overflow-hidden bg-[#08080a]">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <ProjectCover index={index} category={project.category} capture={project.capture} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <span
          data-status-badge
          className={`absolute bottom-3 left-4 z-30 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.18em] backdrop-blur-sm ${
            building
              ? 'border-amber-400/30 bg-amber-400/15 text-amber-300'
              : 'border-cyan-400/30 bg-cyan-400/15 text-cyan-300'
          }`}
        >
          {building ? 'BUILDING' : 'LIVE'}
        </span>
        <span
          data-card-arrow
          aria-hidden="true"
          className="absolute right-4 top-4 z-30 font-mono text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          ↗
        </span>
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <span className="font-mono text-[10px] tabular-nums text-white/35">{project.year}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{project.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
