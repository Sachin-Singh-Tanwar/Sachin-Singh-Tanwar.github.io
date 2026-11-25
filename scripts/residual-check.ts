import { chromium } from 'playwright'

const URL = 'http://127.0.0.1:3001/'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  await page.goto(URL + '?residual=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)

  const result = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#hero > div > article')) as HTMLElement[]
    const status = cards.find((c) => (c.textContent || '').trim().startsWith('Status')) as HTMLElement | undefined
    const h1 = document.querySelector('[data-pitch]') as HTMLElement | null
    const accent = h1?.querySelector('span') as HTMLElement | null
    const br = h1?.querySelector('br') as HTMLElement | null

    let lineCount = 0
    let lineTops: number[] = []
    let rawRects: Array<{ top: number; left: number; w: number; h: number }> = []
    if (h1) {
      const range = document.createRange()
      range.selectNodeContents(h1)
      const rects = Array.from(range.getClientRects()).filter((r) => r.height > 0)
      rects.forEach((r) => {
        const top = Math.round(r.top)
        if (!lineTops.some((t) => Math.abs(t - top) <= 8)) lineTops.push(top)
      })
      lineTops.sort((a, b) => a - b)
      lineCount = lineTops.length
      rawRects = rects.map((r) => ({
        top: Math.round(r.top),
        left: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
      }))
    }

    let statusVoid = null
    if (status) {
      const sr = status.getBoundingClientRect()
      const leaves = Array.from(status.querySelectorAll('span')).filter(
        (d) => d.children.length === 0 && (d.textContent || '').trim(),
      )
      const last = leaves[leaves.length - 1]
      if (last) {
        const padBottom = parseFloat(getComputedStyle(status).paddingBottom) || 0
        statusVoid = Math.round(sr.bottom - last.getBoundingClientRect().bottom - padBottom)
      }
    }

    return {
      pitchText: h1?.textContent?.replace(/\s+/g, ' ').trim(),
      pitchFontSize: h1 ? getComputedStyle(h1).fontSize : null,
      pitchLineCount: lineCount,
      pitchLineTops: lineTops,
      brDisplay: br ? getComputedStyle(br).display : null,
      rawRects: rawRects.slice(0, 8),
      statusHeight: status ? Math.round(status.getBoundingClientRect().height) : null,
      accentColor: accent ? getComputedStyle(accent).color : null,
      accentFontFamily: accent ? getComputedStyle(accent).fontFamily : null,
      statusText: (status?.innerText || '').replace(/\s+/g, ' ').trim(),
      statusVoid: statusVoid,
      availabilityCards: cards.filter((c) => (c.textContent || '').trim().startsWith('Availability')).length,
      projectsCardText: (cards.find((c) => (c.textContent || '').trim().startsWith('Projects'))?.innerText || '').replace(/\s+/g, ' ').trim(),
      disciplinesCardText: (cards.find((c) => (c.textContent || '').trim().startsWith('Disciplines'))?.innerText || '').replace(/\s+/g, ' ').trim(),
    }
  })
  console.log('DESKTOP=' + JSON.stringify(result))

  await page.setViewportSize({ width: 375, height: 812 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  const mobile = await page.evaluate(() => {
    const h1 = document.querySelector('[data-pitch]') as HTMLElement | null
    const range = document.createRange()
    if (h1) range.selectNodeContents(h1)
    const rects = Array.from(range.getClientRects()).filter((r) => r.height > 0)
    const tops: number[] = []
    rects.forEach((r) => {
      const top = Math.round(r.top)
      if (!tops.some((t) => Math.abs(t - top) <= 8)) tops.push(top)
    })
    tops.sort((a, b) => a - b)
    return {
      pitchFontSize: h1 ? getComputedStyle(h1).fontSize : null,
      pitchLineCount: tops.length,
      tops: tops,
      text: h1?.textContent?.replace(/\s+/g, ' ').trim(),
    }
  })
  console.log('MOBILE=' + JSON.stringify(mobile))
  console.log('CONSOLE_ERROR_COUNT=' + errors.length)
  errors.slice(0, 10).forEach((e) => console.log('ERROR=' + e.slice(0, 300)))
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

