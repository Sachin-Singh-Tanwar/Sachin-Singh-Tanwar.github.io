import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join } from 'path'

function badgeInCover() {
  const badge = document.querySelector('[data-projects-grid] [data-status-badge]') as HTMLElement | null
  const cover = badge?.closest('[data-cover]') as HTMLElement | null
  if (!badge || !cover) return false
  const b = badge.getBoundingClientRect()
  const c = cover.getBoundingClientRect()
  return b.left >= c.left && b.right <= c.right && b.top >= c.top && b.bottom <= c.bottom
}

async function main() {
  const outDir = join(process.cwd(), 'screenshots')
  mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const heroChildren = await page.evaluate(() => {
    const grid = document.querySelector('#hero > div') as HTMLElement
    return grid?.children.length ?? 0
  })
  console.log('HERO_CHILDREN=' + heroChildren)
  const statusText = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#hero > div > article')) as HTMLElement[]
    const card = cards.find(el => el.textContent?.trim().startsWith('Status'))
    return (card?.innerText ?? '').replace(/\s+/g, ' ').trim()
  })
  console.log('STATUS_CARD_TEXT=' + statusText)
  await page.screenshot({ path: join(outDir, '20-hero.png') })

  await page.evaluate(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
  await page.click('[data-view="grid"]')
  await page.waitForTimeout(900)
  console.log('BADGE_ON_COVER=' + ((await page.evaluate(badgeInCover)) ? 'YES' : 'NO'))
  const building = await page.evaluate(() => Array.from(document.querySelectorAll('[data-projects-grid] [data-status-badge]')).filter(el => el.textContent?.trim() === 'BUILDING').length)
  console.log('BUILDING_BADGES=' + building)
  await page.screenshot({ path: join(outDir, '21-projects.png') })

  const card = page.locator('[data-projects-grid] [data-project-card]').first()
  await card.click()
  await page.waitForTimeout(700)
  console.log('MODAL_OPEN=' + ((await page.$$('[role="dialog"][aria-modal="true"]')).length > 0 ? 'YES' : 'NO'))
  const strip = await page.evaluate(() => {
    const el = document.querySelector('[data-project-cover-strip]') as HTMLElement | null
    if (!el) return null
    return {
      height: Math.round(el.getBoundingClientRect().height),
      cover: Boolean(el.querySelector('[data-project-cover]')),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim(),
    }
  })
  console.log('MODAL_COVER_STRIP=' + (strip ? 'YES' : 'NO'))
  console.log('MODAL_STRIP_INFO=' + JSON.stringify(strip))
  await page.screenshot({ path: join(outDir, '22-modal.png') })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  await page.setViewportSize({ width: 375, height: 812 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(700)
  const cursorHidden = await page.evaluate(() => !document.querySelector('[data-magnetic-cursor]'))
  console.log('CURSOR_HIDDEN_AT_375=' + (cursorHidden ? 'YES' : 'NO'))
  await page.screenshot({ path: join(outDir, '23-mobile-375.png') })

  await browser.close()
  console.log('Screenshots saved to', outDir)
}

main().catch(e => { console.error(e); process.exit(1) })
