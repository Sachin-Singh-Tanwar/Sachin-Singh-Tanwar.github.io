import { chromium } from 'playwright'
import { join } from 'path'

const URL = 'https://sachin-singh-tanwar.github.io/'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

  await page.goto(URL + '?smoke=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const body = await page.evaluate(() => document.body.innerText)
  console.log('LIVE_NAME=' + (body.includes('Sachin Singh Tanwar') ? 'YES' : 'NO'))
  console.log('LIVE_SELECTED_WORK=' + (body.toLowerCase().includes('selected work') ? 'YES' : 'NO'))
  await page.screenshot({ path: join(process.cwd(), 'screenshots/live-hero.png') })

  const card = page.locator('[data-project-card]').first()
  await card.click()
  await page.waitForTimeout(800)
  console.log('LIVE_MODAL=' + ((await page.$$('[role="dialog"][aria-modal="true"]')).length > 0 ? 'YES' : 'NO'))
  await page.screenshot({ path: join(process.cwd(), 'screenshots/live-modal.png') })

  console.log('CONSOLE_ERROR_COUNT=' + errors.length)
  errors.slice(0, 10).forEach((e) => console.log('ERROR=' + e.slice(0, 300)))
  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
