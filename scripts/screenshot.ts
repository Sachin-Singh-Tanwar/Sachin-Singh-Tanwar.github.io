import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join } from 'path'

const URL = 'http://127.0.0.1:3001/'
const outDir = join(process.cwd(), 'screenshots')

async function main() {
  mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

  await page.goto(URL + '?lane1=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const nav = await page.evaluate(() => {
    const el = document.querySelector('[data-primary-nav]') as HTMLElement | null
    if (!el) return null
    const cs = getComputedStyle(el)
    const hint = el.querySelector('span') as HTMLElement | null
    return {
      height: el.getBoundingClientRect().height,
      position: cs.position,
      backdrop: cs.backdropFilter || (cs as any).webkitBackdropFilter,
      borderBottom: cs.borderBottomColor,
      wordmark: el.querySelector('a')?.textContent?.trim(),
      hint: hint?.textContent?.trim(),
      hintVisible: hint ? !!(hint.offsetWidth || hint.offsetHeight) : false,
      links: Array.from(el.querySelectorAll('a')).map((a) => ({
        text: a.textContent?.trim(),
        href: a.getAttribute('href'),
        visible: !!(a.offsetWidth || a.offsetHeight),
      })),
    }
  })
  console.log('NAV_DESKTOP=' + JSON.stringify(nav))

  const hero = await page.evaluate(() => {
    const h1 = document.querySelector('[data-pitch]') as HTMLElement | null
    const cs = h1 ? getComputedStyle(h1) : null
    const accent = h1?.querySelector('span') as HTMLElement | null
    const acs = accent ? getComputedStyle(accent) : null
    const byline = h1?.previousElementSibling as HTMLElement | null
    const clipped = Array.from(document.querySelectorAll('*')).filter((el) => {
      const st = getComputedStyle(el) as any
      return st.backgroundClip === 'text' || st.webkitBackgroundClip === 'text'
    }).length
    return {
      text: h1?.textContent?.replace(/\s+/g, ' ').trim(),
      fontSize: cs?.fontSize,
      fontWeight: cs?.fontWeight,
      letterSpacing: cs?.letterSpacing,
      fontFamily: cs?.fontFamily,
      color: cs?.color,
      accentText: accent?.textContent?.trim(),
      accentFontFamily: acs?.fontFamily,
      accentFontStyle: acs?.fontStyle,
      accentColor: acs?.color,
      byline: byline?.textContent?.trim(),
      bylineFontSize: byline ? getComputedStyle(byline).fontSize : null,
      bylineLetterSpacing: byline ? getComputedStyle(byline).letterSpacing : null,
      bylineColor: byline ? getComputedStyle(byline).color : null,
      gradientClassEls: document.querySelectorAll('.gradient-text').length,
      clippedEls: clipped,
    }
  })
  console.log('HERO_DESKTOP=' + JSON.stringify(hero))
  await page.screenshot({ path: join(outDir, '30-hero.png') })

  const toggleLoad = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-view]')).map((b) => {
      const el = b as HTMLElement
      return {
        view: el.getAttribute('data-view'),
        ariaPressed: el.getAttribute('aria-pressed'),
        active: el.getAttribute('data-active'),
        background: getComputedStyle(el).backgroundColor,
        color: getComputedStyle(el).color,
      }
    }),
  )
  console.log('TOGGLE_LOAD=' + JSON.stringify(toggleLoad))

  const vocab = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#hero > div > article')) as HTMLElement[]
    const projectsCard = cards.find((c) => (c.textContent || '').trim().startsWith('Projects'))
    const availabilityCard = cards.find((c) => (c.textContent || '').trim().startsWith('Availability'))
    const statusCard = cards.find((c) => (c.textContent || '').trim().startsWith('Status'))
    return {
      projectsCard: (projectsCard?.innerText || '').replace(/\s+/g, ' ').trim(),
      disciplinesCard: (cards.find((c) => (c.textContent || '').trim().startsWith('Disciplines'))?.innerText || '').replace(/\s+/g, ' ').trim(),
      availabilityCard: (availabilityCard?.innerText || '').replace(/\s+/g, ' ').trim(),
      statusCard: (statusCard?.innerText || '').replace(/\s+/g, ' ').trim(),
      totalEntriesInBody: document.body.innerText.includes('TOTAL ENTRIES'),
      categoriesInBody: document.body.innerText.includes('CATEGORIES'),
    }
  })
  console.log('VOCAB=' + JSON.stringify(vocab))

  await page.evaluate(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'auto' }))
  await page.waitForTimeout(700)
  await page.screenshot({ path: join(outDir, '31-work.png') })

  await page.evaluate(() => document.querySelector('#services')?.scrollIntoView({ behavior: 'auto' }))
  await page.waitForTimeout(700)
  const services = await page.evaluate(() => ({
    appDevelopment: document.body.innerText.includes('App Development'),
    dataPipelines: document.body.innerText.includes('Data Pipelines'),
    description: document.body.innerText.includes(
      'Scheduled scrapers and extraction with clean output schemas and cost guards.',
    ),
  }))
  console.log('SERVICES=' + JSON.stringify(services))
  await page.screenshot({ path: join(outDir, '32-services.png') })

  await page.setViewportSize({ width: 375, height: 812 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(700)
  const mobile = await page.evaluate(() => {
    const navEl = document.querySelector('[data-primary-nav]') as HTMLElement | null
    const h1 = document.querySelector('[data-pitch]') as HTMLElement | null
    const hint = navEl?.querySelector('span') as HTMLElement | null
    return {
      visibleNavText: navEl
        ? Array.from(navEl.querySelectorAll('a'))
            .filter((a) => !!(a.offsetWidth || a.offsetHeight))
            .map((a) => a.textContent?.trim())
        : [],
      hintVisible: hint ? !!(hint.offsetWidth || hint.offsetHeight) : false,
      pitchFontSize: h1 ? getComputedStyle(h1).fontSize : null,
      navHeight: navEl ? navEl.getBoundingClientRect().height : null,
    }
  })
  console.log('MOBILE=' + JSON.stringify(mobile))
  await page.screenshot({ path: join(outDir, '33-mobile-375.png') })

  console.log('DOC_TITLE=' + (await page.title()))
  console.log('CONSOLE_ERROR_COUNT=' + errors.length)
  errors.slice(0, 10).forEach((e) => console.log('ERROR=' + e.slice(0, 300)))
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

