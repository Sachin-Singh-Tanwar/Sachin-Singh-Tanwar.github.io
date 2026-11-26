import { chromium } from 'playwright'

const TARGET = process.env.TARGET_URL || 'https://sachin-singh-tanwar.github.io/'

async function state(page: import('playwright').Page) {
  const carousel = await page.locator('[data-view="carousel"]').getAttribute('aria-pressed')
  const grid = await page.locator('[data-view="grid"]').getAttribute('aria-pressed')
  return { carousel, grid }
}

async function clickAndReport(page: import('playwright').Page, mode: string, width: number) {
  const btn = page.locator(`[data-view="${mode}"]`)
  const before = await state(page)
  await btn.click({ timeout: 5000 })
  const after = await state(page)
  console.log(
    `TOGGLE_CLICK width=${width} clicked=${mode} before=${JSON.stringify(before)} after=${JSON.stringify(after)}`,
  )
}

async function run(width: number, height: number) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(TARGET + '?toggle-proof=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
  })

  const styles = await page.evaluate(() => {
    const nav = document.querySelector('[data-primary-nav]') as HTMLElement
    const main = document.querySelector('main') as HTMLElement
    const group = document.querySelector('[aria-label="Projects view mode"]') as HTMLElement
    return {
      navZ: getComputedStyle(nav).zIndex,
      mainZ: getComputedStyle(main).zIndex,
      groupPosition: getComputedStyle(group).position,
      groupZ: getComputedStyle(group).zIndex,
    }
  })
  console.log(`TOGGLE_STYLES width=${width} ${JSON.stringify(styles)}`)

  // Force the control into the sticky-nav band and prove it is the hit target.
  await page.evaluate(() => {
    const el = document.querySelector('[data-view="carousel"]') as HTMLElement
    const r = el.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + r.top + r.height / 2 - 20)
  })
  await page.waitForTimeout(150)
  const overlap = await page.evaluate(() => {
    const el = document.querySelector('[data-view="carousel"]') as HTMLElement
    const r = el.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const hit = document.elementFromPoint(x, y) as HTMLElement | null
    const nav = document.querySelector('[data-primary-nav]')!.getBoundingClientRect()
    return {
      centerY: Math.round(y),
      navBottom: Math.round(nav.bottom),
      insideNavBand: y < nav.bottom,
      hitTag: hit?.tagName,
      hitView: hit?.getAttribute('data-view'),
      hitText: hit?.textContent?.trim().slice(0, 20),
    }
  })
  console.log(`TOGGLE_OVERLAP width=${width} ${JSON.stringify(overlap)}`)

  await clickAndReport(page, 'grid', width)
  await clickAndReport(page, 'carousel', width)
  await browser.close()
}

async function main() {
  await run(1440, 900)
  await run(390, 844)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})

