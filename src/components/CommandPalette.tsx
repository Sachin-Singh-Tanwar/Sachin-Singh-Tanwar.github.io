import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  Check,
  Command as CommandIcon,
  Mail,
  Search,
  X,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { GithubIcon, LinkedinIcon } from './Icons'

type PaletteItem = {
  id: string
  label: string
  hint: string
  group: 'Navigation' | 'Links'
  icon: ReactNode
  run: () => void
}

const EMAIL = 'sachin.singh.tanwar325@gmail.com'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      } else if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    setQuery('')
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  const items = useMemo<PaletteItem[]>(
    () => [
      {
        id: 'projects',
        label: 'Go to Projects',
        hint: 'Selected work',
        group: 'Navigation',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('projects'),
      },
      {
        id: 'evidence',
        label: 'Go to Evidence Workbench',
        hint: 'Verified claims',
        group: 'Navigation',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('evidence'),
      },
      {
        id: 'build-lab',
        label: 'Go to Build Lab',
        hint: 'Progressive enhancement demos',
        group: 'Navigation',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('build-lab'),
      },
      {
        id: 'services',
        label: 'Go to Services',
        hint: 'What I do',
        group: 'Navigation',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('services'),
      },
      {
        id: 'contact',
        label: 'Go to Contact',
        hint: 'Get in touch',
        group: 'Navigation',
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => goTo('contact'),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'github.com/Sachin-Singh-Tanwar',
        group: 'Links',
        icon: <GithubIcon className="h-4 w-4" />,
        run: () => window.open('https://github.com/Sachin-Singh-Tanwar', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'LinkedIn profile',
        group: 'Links',
        icon: <LinkedinIcon className="h-4 w-4" />,
        run: () => window.open('https://www.linkedin.com/in/sachin-singh-tanwar-5582582b4', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'email',
        label: 'Copy Email',
        hint: EMAIL,
        group: 'Links',
        icon: copied ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />,
        run: () => {
          void navigator.clipboard?.writeText(EMAIL)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        },
      },
    ],
    [copied],
  )

  const filtered = items.filter((item) =>
    `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <button
        type="button"
        data-command-trigger
        aria-label="Open command palette"
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur transition hover:border-white/30 hover:text-white"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Command</span>
        <kbd className="rounded border border-white/15 px-1.5 py-0.5">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Command palette">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            data-command-palette
            className="fixed left-1/2 top-1/4 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0b0d]/95 p-2 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-3 py-3">
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search actions…"
                aria-label="Search commands"
                data-palette-input
                className="w-full border-0 bg-transparent text-sm text-white caret-cyan-400 placeholder:text-white/30"
              />
              <button
                type="button"
                aria-label="Close command palette"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto py-2">
              {(['Navigation', 'Links'] as const).map((group) => {
                const groupItems = filtered.filter((item) => item.group === group)
                if (groupItems.length === 0) return null
                return (
                  <div key={group} className="px-1 pb-2">
                    <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                      {group}
                    </p>
                    {groupItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.run}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white',
                          copied && item.id === 'email' && 'text-cyan-200',
                        )}
                      >
                        <span className="text-cyan-300/80">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        <span className="truncate font-mono text-[10px] text-white/30">{item.hint}</span>
                      </button>
                    ))}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-white/40">No matching actions.</p>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              <CommandIcon className="h-3 w-3" /> K to toggle · Esc to close
            </div>
          </div>
        </div>
      )}
    </>
  )
}
