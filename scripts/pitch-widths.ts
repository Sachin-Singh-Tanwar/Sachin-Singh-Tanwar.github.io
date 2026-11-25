import { chromium } from 'playwright'

const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:3001/'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(TARGET + '?pitch=' + Date.now(), { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)

  for (const width of [1440, 1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.waitForTimeout(400)
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('[data-pitch]') as HTMLElement | null
      const br = h1?.querySelector('br') as HTMLElement | null
      const range = document.createRange()
      if (h1) range.selectNodeContents(h1)
      const rects = Array.from(range.getClientRects()).filter((x) => x.height > 0)
      const tops: number[] = []
      rects.forEach((x) => {
        const top = Math.round(x.top)
        if (!tops.some((t) => Math.abs(t - top) <= 8)) tops.push(top)
      })
      tops.sort((a, b) => a - b)
      return {
        width: window.innerWidth,
        fontSize: h1 ? getComputedStyle(h1).fontSize : null,
        lineHeight: h1 ? getComputedStyle(h1).lineHeight : null,
        textWrap: h1 ? getComputedStyle(h1).textWrap : null,
        brDisplay: br ? getComputedStyle(br).display : null,
        normalized: h1?.textContent?.replace(/\s+/g, ' ').trim(),
        innerText: h1?.innerText?.replace(/\n/g, '\\n').trim(),
        lineCount: tops.length,
        lineTops: tops,
      }
    })
    console.log('PITCH=' + JSON.stringify(r))
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
