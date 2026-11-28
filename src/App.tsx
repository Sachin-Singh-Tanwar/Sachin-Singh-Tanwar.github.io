import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CapabilitiesSection from './components/CapabilitiesSection'
import CommandPalette from './components/CommandPalette'
import CursorAccent from './components/CursorAccent'
import ContactSection from './components/ContactSection'
import Hero from './components/Hero'
import Intro from './components/Intro'
import ProjectsSection from './components/ProjectsSection'
import ScrollRail from './components/ScrollRail'
import SiteHeader from './components/SiteHeader'
import TelemetrySection from './components/TelemetrySection'
import { toggleAudio } from './lib/siteActions'
import { useElementLife } from './lib/useElementLife'
import { useScrollProgress } from './lib/useScrollProgress'
import { useSiteMotion } from './lib/useSiteMotion'
import { scrollToTopImmediate, useSmoothScroll } from './lib/useSmoothScroll'

const LabSection = lazy(() => import('./components/LabSection'))

// Three.js is only needed inside the Lab. Keep it off the opening path and
// mount the section shortly before it reaches the viewport.
function DeferredLabSection() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return
    const anchor = anchorRef.current
    if (!anchor) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [mounted])

  return (
    <div ref={anchorRef} id="lab" className="lab-anchor">
      {mounted ? (
        <Suspense fallback={<div className="lab-placeholder" />}>
          <LabSection />
        </Suspense>
      ) : (
        <div className="lab-placeholder" aria-hidden="true" />
      )}
    </div>
  )
}

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [introKey, setIntroKey] = useState(0)
  const [routeWipe, setRouteWipe] = useState(false)
  const wipeTimer = useRef(0)

  useSiteMotion()
  useElementLife()
  useScrollProgress()
  useSmoothScroll()

  useEffect(() => {
    const reshatter = () => {
      scrollToTopImmediate()
      setIntroKey((key) => key + 1)
    }
    const audio = () => toggleAudio()
    window.addEventListener('site:reshatter', reshatter)
    window.addEventListener('site:toggle-audio', audio)
    return () => {
      window.removeEventListener('site:reshatter', reshatter)
      window.removeEventListener('site:toggle-audio', audio)
    }
  }, [])

  useEffect(() => {
    const onHash = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      window.clearTimeout(wipeTimer.current)
      setRouteWipe(true)
      wipeTimer.current = window.setTimeout(() => setRouteWipe(false), 280)
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(wipeTimer.current)
    }
  }, [])

  return (
    <div className="site-shell">
      <a href="#work" className="skip-link">
        Skip to work
      </a>
      <div className={`route-wipe${routeWipe ? ' is-active' : ''}`} aria-hidden="true">
        <span />
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader onCommand={() => setCommandOpen(true)} />
      <main>
        <Hero />
        <ProjectsSection />
        <TelemetrySection />
        <CapabilitiesSection />
        <DeferredLabSection />
        <ContactSection />
      </main>
      <ScrollRail />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <CursorAccent />
      <Intro key={introKey} />
    </div>
  )
}
