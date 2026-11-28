import { useEffect, useRef, useState } from 'react'
import { isAudioEnabled, subscribeAudio } from '../lib/audioBus'

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Telemetry', href: '#telemetry' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['top', 'work', 'telemetry', 'capabilities', 'stack', 'lab', 'contact']

type GithubState = { label: string; detail: string }

type Props = {
  onCommand: () => void
}

function istClock(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function SiteHeader({ onCommand }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState('top')
  const [soundOn, setSoundOn] = useState(isAudioEnabled)
  const [github, setGithub] = useState<GithubState>({
    label: 'GitHub · public profile',
    detail: 'Live activity unavailable',
  })
  const [clock, setClock] = useState(istClock)
  const compactTimer = useRef(0)

  useEffect(() => subscribeAudio(setSoundOn), [])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(istClock()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let frame = 0
    let lastY = window.scrollY
    let lastT = performance.now()

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const now = performance.now()
        const y = window.scrollY
        const velocity = (y - lastY) / Math.max(1, now - lastT)
        setScrolled(y > 24)
        if (velocity > 1.1) {
          setCompact(true)
          window.clearTimeout(compactTimer.current)
          compactTimer.current = window.setTimeout(() => setCompact(false), 900)
        } else if (velocity < -0.45) {
          setCompact(false)
          window.clearTimeout(compactTimer.current)
        }
        lastY = y
        lastT = now
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.clearTimeout(compactTimer.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/Sachin-Singh-Tanwar/repos?per_page=1&sort=updated',
          { headers: { Accept: 'application/vnd.github+json' } },
        )
        if (!response.ok || cancelled) return
        const data = (await response.json()) as Array<{ name?: string }>
        const name = data[0]?.name
        if (name && !cancelled) {
          setGithub({ label: 'GitHub · live', detail: `Latest repo: ${name}` })
        }
      } catch {
        // The real public profile link remains available as the fallback.
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const activeHref = `#${active === 'stack' ? 'capabilities' : active}`

  return (
    <header className="site-header" data-scrolled={scrolled} data-compact={compact}>
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="SST — home">
          <span className="brand-mark" aria-hidden="true">
            SST
          </span>
          <span className="brand-name">Sachin Singh Tanwar</span>
        </a>

        <div className="header-island">
          <nav className="header-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={activeHref === item.href}
                aria-current={activeHref === item.href ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
            <span className="active-pill" aria-hidden="true" data-target={activeHref} />
          </nav>

          <div className="header-island-status">
            <span className="live-dot" aria-hidden="true" />
            <span>SST</span>
          </div>

          <div className="header-equalizer" aria-hidden="true" data-sound={soundOn}>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="header-side">
          <div className="header-card header-status-card">
            <span className="header-card-label">Status</span>
            <strong>Available for Freelance &amp; Roles</strong>
            <span className="header-card-meta">IST {clock}</span>
          </div>
          <div className="header-card header-github-card">
            <span className="header-card-label">GitHub</span>
            <strong>{github.label}</strong>
            <span className="header-card-meta">{github.detail}</span>
          </div>
          <button type="button" className="command-trigger" onClick={onCommand} aria-label="Open site menu">
            <kbd>⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
