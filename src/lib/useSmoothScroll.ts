import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null

const HEADER_OFFSET = 72

// Native scrollIntoView fights Lenis' own rAF loop: the browser moves the
// document, then Lenis pulls it back toward its stale target. Route every
// in-page jump through the active Lenis instance instead.
export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (!element) return

  if (activeLenis) {
    if (id === 'top') activeLenis.scrollTo(0, { duration: 0.85 })
    else {
      // Lenis treats a numeric target as an absolute scroll position. An
      // element target plus `offset` was measuring against the wrong edge and
      // left sections 130–140px below the header on long pages.
      const targetY = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      activeLenis.scrollTo(targetY, { duration: 0.9 })
    }
    return
  }

  element.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

export function scrollToTopImmediate(): void {
  if (activeLenis) activeLenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function useSmoothScroll(): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
    })
    activeLenis = lenis

    const update = () => ScrollTrigger.update()
    lenis.on('scroll', update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', update)
      lenis.destroy()
      if (activeLenis === lenis) activeLenis = null
    }
  }, [])
}
