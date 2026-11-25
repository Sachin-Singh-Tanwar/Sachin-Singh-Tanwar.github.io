import { chromium } from 'playwright'
async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  const cards = await page.$$('button[aria-label^="Open details for"]')
  console.log('PROJECT_CARDS_COUNT=' + cards.length)
  if (cards.length > 0) {
    await cards[0].click()
    await page.waitForTimeout(1000)
    const dialog = await page.$('[role="dialog"], [aria-modal="true"]')
    console.log('DIALOG_OPENED=' + (dialog ? 'YES' : 'NO'))
    if (dialog) {
      const text = await dialog.textContent()
      console.log('DIALOG_HAS_PROBLEM=' + (text?.includes('Problem') ? 'YES' : 'NO'))
      console.log('DIALOG_HAS_SOLUTION=' + (text?.includes('Solution') ? 'YES' : 'NO'))
    }
  }
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
