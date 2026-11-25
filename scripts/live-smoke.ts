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

  await page.goto(URL + '?lane1smoke=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const title = await page.title()
  console.log('LIVE_TITLE=' + title)

  const asset = await page.evaluate(() => {
    const script = document.querySelector('script[type="module"]') as HTMLScriptElement | null
    return script?.src || ''
  })
  const assetStatus = asset ? (await page.request.get(asset)).status() : 0
  console.log('LIVE_ASSET_URL=' + asset)
  console.log('LIVE_ASSET_STATUS=' + assetStatus)

  const body = await page.evaluate(() => document.body.innerText)
  console.log('LIVE_NAME=' + (body.includes('Sachin Singh Tanwar') ? 'YES' : 'NO'))
  console.log('LIVE_SELECTED_WORK=' + (body.toLowerCase().includes('selected work') ? 'YES' : 'NO'))
  console.log('LIVE_PITCH=' + (body.includes('I build automation that proves it ran.') ? 'YES' : 'NO'))
  console.log('LIVE_APP_DEVELOPMENT=' + (body.includes('App Development') ? 'YES' : 'NO'))
  await page.screenshot({ path: join(process.cwd(), 'screenshots/live-hero.png') })

  const card = page.locator('[data-project-card]').first()
  await card.click()
  await page.waitForTimeout(800)
  console.log(
    'LIVE_MODAL=' +
      ((await page.$$('[role="dialog"][aria-modal="true"]')).length > 0 ? 'YES' : 'NO'),
  )
  await page.screenshot({ path: join(process.cwd(), 'screenshots/live-modal.png') })

  console.log('CONSOLE_ERROR_COUNT=' + errors.length)
  errors.slice(0, 10).forEach((e) => console.log('ERROR=' + e.slice(0, 300)))
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

