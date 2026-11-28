import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  RotateCcw,
  Search,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { featuredWork } from '../data/featuredWork'
import { isAudioEnabled, playTick, subscribeAudio } from '../lib/audioBus'
import { EMAIL, copyEmail, jumpTo, requestReshatter, toggleAudio } from '../lib/siteActions'
import { GithubIcon, LinkedinIcon } from './Icons'

type PaletteGroup = 'Navigate' | 'Actions' | 'Profiles'

type PaletteItem = {
  id: string
  label: string
  hint: string
  group: PaletteGroup
  icon: ReactNode
  run: () => void
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CommandPalette({ open, onOpenChange }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null
  return <PaletteDialog onOpenChange={onOpenChange} />
}

function PaletteDialog({ onOpenChange }: Pick<Props, 'onOpenChange'>) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [soundOn, setSoundOn] = useState(isAudioEnabled)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeAudio(setSoundOn), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(id)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  const goTo = useCallback(
    (id: string) => {
      jumpTo(id)
      onOpenChange(false)
    },
    [onOpenChange],
  )

  const goToWork = useCallback(
    (id: string) => {
      window.location.hash = `#work/${id}`
      onOpenChange(false)
    },
    [onOpenChange],
  )

  const items = useMemo<PaletteItem[]>(() => {
    const navigation: PaletteItem[] = [
      {
        id: 'work',
        label: 'Go to selected work',
        hint: 'Projects',
        group: 'Navigate',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('work'),
      },
      ...featuredWork.map((project) => ({
        id: `work-${project.id}`,
        label: `Open ${project.title}`,
        hint: project.type,
        group: 'Navigate' as const,
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goToWork(project.id),
      })),
      {
        id: 'telemetry',
        label: 'Go to telemetry',
        hint: 'Query lens',
        group: 'Navigate',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('telemetry'),
      },
      {
        id: 'capabilities',
        label: 'Go to capabilities',
        hint: 'What I build',
        group: 'Navigate',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('capabilities'),
      },
      {
        id: 'lab',
        label: 'Go to UI Lab',
        hint: 'Experiments',
        group: 'Navigate',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('lab'),
      },
      {
        id: 'contact',
        label: 'Go to contact',
        hint: 'Start a project',
        group: 'Navigate',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('contact'),
      },
    ]

    const actions: PaletteItem[] = [
      {
        id: 'toggle-audio',
        label: soundOn ? 'Toggle audio off' : 'Toggle audio on',
        hint: soundOn ? 'Sound on' : 'Sound off',
        group: 'Actions',
        icon: soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />,
        run: () => toggleAudio(),
      },
      {
        id: 'reshatter',
        label: 'Re-Shatter Screen',
        hint: 'Replay opening',
        group: 'Actions',
        icon: <RotateCcw className="h-4 w-4" />,
        run: () => {
          onOpenChange(false)
          requestReshatter()
        },
      },
      {
        id: 'copy-email',
        label: 'Copy email',
        hint: EMAIL,
        group: 'Actions',
        icon: copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />,
        run: () => {
          void copyEmail()
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1400)
        },
      },
    ]

    const profiles: PaletteItem[] = [
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'github.com/Sachin-Singh-Tanwar',
        group: 'Profiles',
        icon: <GithubIcon className="h-4 w-4" />,
        run: () => window.open('https://github.com/Sachin-Singh-Tanwar', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'Profile',
        group: 'Profiles',
        icon: <LinkedinIcon className="h-4 w-4" />,
        run: () =>
          window.open('https://www.linkedin.com/in/sachin-singh-tanwar-5582582b4', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'email',
        label: 'Send email',
        hint: EMAIL,
        group: 'Profiles',
        icon: <Mail className="h-4 w-4" />,
        run: () => {
          window.location.href = `mailto:${EMAIL}`
        },
      },
    ]

    return [...navigation, ...actions, ...profiles]
  }, [copied, goTo, goToWork, onOpenChange, soundOn])

  const filtered = useMemo(
    () => items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  )

  const activeId = filtered[activeIndex]?.id

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      if (filtered.length === 0) return
      event.preventDefault()
      playTick()
      let next = activeIndex
      if (event.key === 'ArrowDown') next = (activeIndex + 1) % filtered.length
      if (event.key === 'ArrowUp') next = (activeIndex - 1 + filtered.length) % filtered.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = filtered.length - 1
      setActiveIndex(next)
      dialogRef.current
        ?.querySelector<HTMLElement>(`#palette-option-${filtered[next].id}`)
        ?.scrollIntoView({ block: 'nearest' })
      return
    }

    if (event.key === 'Enter' && document.activeElement === inputRef.current) {
      event.preventDefault()
      filtered[activeIndex]?.run()
      return
    }

    if (event.key !== 'Tab') return
    const nodes = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], input') ?? [],
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
    <div className="palette-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onOpenChange(false)
    }}>
      <div
        ref={dialogRef}
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onKeyDown={handleKeyDown}
      >
        <div className="palette-search">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            placeholder="Search sections, projects and actions"
            aria-label="Search sections, projects and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={activeId ? `palette-option-${activeId}` : undefined}
            autoComplete="off"
            data-palette-input
          />
          <button type="button" aria-label="Close site menu" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div id="palette-results" className="palette-results" role="listbox" aria-label="Site menu options">
          {(['Navigate', 'Actions', 'Profiles'] as const).map((group) => {
            const groupItems = filtered.filter((item) => item.group === group)
            if (groupItems.length === 0) return null
            return (
              <div key={group} className="palette-group">
                <p>{group}</p>
                {groupItems.map((item) => {
                  const index = filtered.indexOf(item)
                  return (
                    <button
                      key={item.id}
                      id={`palette-option-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      data-active={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => item.run()}
                    >
                      <span className="palette-icon" aria-hidden="true">{item.icon}</span>
                      <span className="palette-label">{item.label}</span>
                      <span className="palette-hint">{item.hint}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
          {filtered.length === 0 && <p className="palette-empty">No matching sections.</p>}
        </div>
        <div className="palette-foot">↑↓ to move · Enter to open · Esc to close</div>
      </div>
    </div>
  )
}
