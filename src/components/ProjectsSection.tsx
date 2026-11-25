import { useCallback, useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import projectData from '../data/projects.json'
import { projectSchema, type Project } from '../data/schema'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

const projects: Project[] = projectData.map((item) => projectSchema.parse(item))

const FILTERS = ['All', 'Automation', 'Web', 'API', 'Tool'] as const
type Filter = (typeof FILTERS)[number]
type View = 'carousel' | 'grid'

const CATEGORY: Record<Exclude<Filter, 'All'>, Project['category']> = {
  Automation: 'automation',
  Web: 'web',
  API: 'api',
  Tool: 'tool',
}

const COUNTS: Record<Filter, number> = {
  All: projects.length,
  Automation: projects.filter((project) => project.category === 'automation').length,
  Web: projects.filter((project) => project.category === 'web').length,
  API: projects.filter((project) => project.category === 'api').length,
  Tool: projects.filter((project) => project.category === 'tool').length,
}

export default function ProjectsSection() {
  const [view, setView] = useState<View>('carousel')
  const [filter, setFilter] = useState<Filter>('All')
  const [progress, setProgress] = useState(0)
  const [slidesInView, setSlidesInView] = useState<number[]>([])
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [selected, setSelected] = useState<Project | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
  })

  const visible = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((project) => project.category === CATEGORY[filter]),
    [filter],
  )

  const sync = useCallback(() => {
    if (!emblaApi) return
    setProgress(emblaApi.scrollProgress())
    setSlidesInView(emblaApi.slidesInView())
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    sync()
    emblaApi.on('scroll', sync).on('select', sync).on('reInit', sync).on('slidesInView', sync)
    return () => {
      emblaApi.off('scroll', sync).off('select', sync).off('reInit', sync).off('slidesInView', sync)
    }
  }, [emblaApi, sync])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    emblaApi.scrollTo(0, true)
  }, [filter, emblaApi])

  useEffect(() => {
    if (view !== 'carousel' || !emblaApi) return
    emblaApi.reInit()
    sync()
  }, [view, emblaApi, sync])

  const activeIndex =
    visible.length > 1
      ? Math.min(visible.length - 1, Math.max(0, Math.round(progress * (visible.length - 1))))
      : 0

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      emblaApi?.scrollPrev()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      emblaApi?.scrollNext()
    }
  }

  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <section id="projects" className="border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          01 — Selected Work
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[18ch] text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Systems built to run without supervision.
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={filter === item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums transition-colors ${
                    filter === item
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-white/[0.02] text-white/55 hover:text-white'
                  }`}
                >
                  {item} {COUNTS[item]}
                </button>
              ))}
            </div>
            <div
              className="inline-flex items-center gap-1 self-start rounded-full border border-white/10 bg-white/[0.04] p-1"
              role="group"
              aria-label="Projects view mode"
            >
              {(['carousel', 'grid'] as View[]).map((mode) => {
                const isActive = view === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    data-view={mode}
                    data-active={isActive}
                    aria-pressed={isActive}
                    onClick={() => setView(mode)}
                    className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                      isActive ? 'bg-white text-black' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12">
          {view === 'carousel' ? (
            <div
              ref={emblaRef}
              className="overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Project carousel"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <div className="flex gap-4">
                {visible.map((project, index) => {
                  const isActive =
                    index === activeIndex &&
                    (slidesInView.length === 0 || slidesInView.includes(index))
                  return (
                    <div
                      key={project.id}
                      className={`project-slide min-w-0 shrink-0 basis-[min(85vw,420px)] transition-all duration-500 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                      }`}
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${visible.length}`}
                    >
                      <ProjectCard project={project} index={index} onOpen={setSelected} />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div data-projects-grid className="reveal-stagger grid grid-cols-1 gap-4 lg:grid-cols-3">
              {visible.map((project, index) => (
                <div key={project.id} className="reveal-on-scroll">
                  <ProjectCard project={project} index={index} onOpen={setSelected} />
                </div>
              ))}
            </div>
          )}
          {visible.length === 0 && (
            <p className="mt-8 text-sm text-white/50">No projects in this category yet.</p>
          )}
          {view === 'carousel' && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                Drag or use arrow keys
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Previous project"
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canPrev}
                  className="rounded-full border border-white/20 px-4 py-2 text-lg leading-none text-white/70 transition hover:border-white/40 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canNext}
                  className="rounded-full border border-white/20 px-4 py-2 text-lg leading-none text-white/70 transition hover:border-white/40 disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
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
