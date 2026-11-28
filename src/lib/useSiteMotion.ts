import { useEffect } from 'react'

const selector = '[data-reveal], [data-stand], [data-device], [data-life]'

export function useSiteMotion() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('motion-ready')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('motion-static')
      return
    }

    const observed = new WeakSet<HTMLElement>()
    const waiting = new Set<HTMLElement>()

    const isInView = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect()
      return rect.bottom > 0 && rect.top < window.innerHeight
    }

    const release = (element: HTMLElement) => {
      element.classList.add('is-visible')
      waiting.delete(element)
      observer.unobserve(element)
    }

    const tryRelease = (element: HTMLElement) => {
      if (element.classList.contains('is-visible')) return
      const hiddenParent = element.parentElement?.closest('[data-reveal]:not(.is-visible)')
      if (hiddenParent || !isInView(element)) {
        if (element.hasAttribute('data-life')) waiting.add(element)
        return
      }
      release(element)
    }

    const flushWaiting = () => {
      waiting.forEach((element) => {
        if (!element.isConnected) {
          waiting.delete(element)
          return
        }
        tryRelease(element)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          tryRelease(target)
          if (target.hasAttribute('data-reveal')) flushWaiting()
        })
      },
      { threshold: 0.04, rootMargin: '0px 0px -2% 0px' },
    )

    const scan = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        if (observed.has(element)) return
        observed.add(element)
        observer.observe(element)
      })
    }

    scan()

    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-life'],
    })

    window.addEventListener('scroll', flushWaiting, { passive: true })
    window.addEventListener('resize', flushWaiting)

    return () => {
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('scroll', flushWaiting)
      window.removeEventListener('resize', flushWaiting)
    }
  }, [])
}
