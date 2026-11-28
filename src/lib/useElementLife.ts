import { useEffect } from 'react'

const effects = [
  'arrive',
  'split',
  'join',
  'flip',
  'lift',
  'butterfly',
  'wipe',
  'peek',
  'teeter',
  'spin',
  'stretch',
  'bars',
] as const

const skipRoot = '.intro, .cursor-accent, .skip-link, .scroll-progress, .copy-spark'
const motionAttr = '[data-scroll-progress], [data-reveal], [data-stand], [data-device], [data-tilt]'

function hashEffect(element: Element, index: number): string {
  const className = typeof element.className === 'string' ? element.className : ''
  const key = `${element.tagName}.${className}:${index}`
  let hash = 0
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return effects[hash % effects.length]
}

export function useElementLife() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.site-shell')
    if (!root) return

    const tagged = new WeakSet<Element>()
    let scheduled = 0

    const tag = () => {
      const elements = root.querySelectorAll<HTMLElement>('*')
      let index = 0

      elements.forEach((element) => {
        if (tagged.has(element) || element.hasAttribute('data-life')) return
        if (element.closest(skipRoot)) return
        if (element.matches(motionAttr)) return

        const style = window.getComputedStyle(element)
        if (style.animationName !== 'none' || style.position === 'fixed') return

        const dir = index % 2 === 0 ? 1 : -1
        element.dataset.life = hashEffect(element, index)
        element.dataset.lifeOffset = (0.015 + (index % 14) * 0.014).toFixed(3)
        element.style.setProperty('--life-delay', `${(0.04 + (index % 14) * 0.021).toFixed(3)}s`)
        element.style.setProperty('--life-x', `${dir * 16}px`)
        element.style.setProperty('--life-y', `${8 + (index % 3) * 4}px`)
        element.style.setProperty('--life-r', `${dir * (5 + (index % 3) * 2)}deg`)
        element.style.setProperty('--life-ry', `${dir * 70}deg`)
        element.style.setProperty('--life-sr', `${dir * (14 + (index % 3) * 6)}deg`)
        if (style.display === 'inline') element.classList.add('life-inline')

        tagged.add(element)
        index += 1
      })
    }

    const schedule = () => {
      if (scheduled) return
      scheduled = window.requestAnimationFrame(() => {
        scheduled = 0
        tag()
      })
    }

    tag()

    const observer = new MutationObserver(schedule)
    observer.observe(root, { childList: true, subtree: true })
    window.addEventListener('hashchange', schedule)

    return () => {
      if (scheduled) window.cancelAnimationFrame(scheduled)
      observer.disconnect()
      window.removeEventListener('hashchange', schedule)
    }
  }, [])
}
