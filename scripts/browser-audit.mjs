import { chromium } from 'playwright'

const url = 'http://127.0.0.1:4176/'
const report = []
const problems = []

function note(name, value) {
  report.push({ name, value })
  console.log(`${name}: ${JSON.stringify(value)}`)
}

function check(name, condition, detail) {
  if (!condition) problems.push(`${name}${detail ? ` — ${detail}` : ''}`)
  console.log(`${condition ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

function watch(page, label) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`${label} pageerror: ${error.message}`))
  return errors
}

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = watch(page, 'desktop')
  await page.addInitScript(() => {
    window.__oscillatorCount = 0
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Engine = window[key]
      if (!Engine?.prototype?.createOscillator) continue
      const create = Engine.prototype.createOscillator
      Engine.prototype.createOscillator = function (...args) {
        window.__oscillatorCount += 1
        return create.apply(this, args)
      }
    }
  })
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await page.locator('.intro').waitFor({ state: 'attached', timeout: 8000 })
  check('intro mounted on hard load', true)
  note('intro shards', await page.locator('.intro-piece').count())
  note('intro skip visible', await page.locator('.intro-skip').isVisible())
  note('intro sound pointer-events', await page.locator('.intro-sound').evaluate((el) => getComputedStyle(el).pointerEvents))
  note('cloned header/hero in intro', await page.locator('.intro-site-layer .site-header, .intro-site-layer .hero').count())

  await page.waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 10000 })
  const afterIntro = await page.evaluate(() => ({
    siteLive: document.body.classList.contains('site-live'),
    siteHit: document.body.classList.contains('site-hit'),
    introActive: document.documentElement.classList.contains('intro-active'),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  note('post-intro state', afterIntro)
  check('intro leaves site live', afterIntro.siteLive)
  check('no sticky hit/shake state', !afterIntro.siteHit)
  check('no sticky intro-active', !afterIntro.introActive)
  check('no horizontal overflow', afterIntro.scrollWidth <= afterIntro.clientWidth + 1, `${afterIntro.scrollWidth}/${afterIntro.clientWidth}`)

  const sectionOrder = await page.evaluate(() =>
    ['top', 'work', 'telemetry', 'capabilities', 'lab', 'contact']
      .map((id) => {
        const el = document.getElementById(id)
        return { id, top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null }
      })
      .sort((a, b) => a.top - b.top)
      .map((entry) => entry.id),
  )
  note('section order', sectionOrder)
  check('locked section order', sectionOrder.join(',') === 'top,work,telemetry,capabilities,lab,contact', sectionOrder.join(','))

  const status = await page.locator('.header-status-card strong').textContent()
  check('exact availability text', status === 'Available for Freelance & Roles', status)
  const github = await page.locator('.header-github-card strong').textContent()
  note('github card', github)

  const headerStyle = await page.locator('.header-island').evaluate((el) => {
    const style = getComputedStyle(el)
    return { radius: style.borderRadius, backdrop: style.backdropFilter, background: style.backgroundColor }
  })
  note('header island style', headerStyle)

  const shardStyle = await page.locator('.intro-piece').count().catch(() => 0)
  note('intro shard count after finish', shardStyle)

  await page.locator('#work').scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  const firstProject = await page.locator('[data-work-item]').first().textContent()
  const sentinel = page.locator('[data-work-item][data-id="sentinel"]')
  await sentinel.click()
  await page.waitForTimeout(120)
  const previewTitle = await page.locator('.preview-body h3').textContent()
  check('project selection changes preview', previewTitle === 'Sentinel Board', `${firstProject?.trim()} -> ${previewTitle}`)

  const lens = page.locator('.preview-viewport')
  const box = await lens.boundingBox()
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.4)
  await page.waitForTimeout(120)
  const lensActive = await page.locator('.xray-lens').evaluate((el) => el.classList.contains('is-active'))
  check('x-ray lens activates', lensActive)
  const stagedLabels = await page.locator('[id="work"] .viewport-label, [id="work"] .xray-lens').count()
  note('work staged/lens nodes', stagedLabels)

  await page.locator('#telemetry').scrollIntoViewIfNeeded()
  const stagedTelemetry = await page.locator('#telemetry').getByText('STAGED DEMO').count()
  check('telemetry staged label', stagedTelemetry > 0)
  note('telemetry labels', await page.locator('.telemetry-labels span').allTextContents())

  await page.locator('#capabilities').scrollIntoViewIfNeeded()
  check('pipeline nodes', (await page.locator('.pipeline-node').count()) === 3)

  await page.locator('#lab').scrollIntoViewIfNeeded()
  note('lab before cards', await page.evaluate(() => {
    const anchor = document.getElementById('lab')
    return {
      top: Math.round(anchor.getBoundingClientRect().top),
      placeholder: !!anchor.querySelector('.lab-placeholder'),
      cards: anchor.querySelectorAll('.lab-card').length,
    }
  }))
  await page.waitForFunction(() => document.querySelectorAll('.lab-card').length === 3, null, { timeout: 15000 })
  check('deferred lab mounted', (await page.locator('.lab-card').count()) === 3)
  note('lab canvases', await page.locator('.lab-canvas canvas').count())

  await page.locator('#contact').scrollIntoViewIfNeeded()
  const reshatter = page.locator('.reshatter-trigger')
  check('footer reshatter present', await reshatter.isVisible())
  await reshatter.click()
  await page.locator('.intro').waitFor({ state: 'attached', timeout: 8000 })
  check('footer reshatter replays intro', true)
  await page.waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 10000 })

  await page.keyboard.press('Control+k')
  await page.waitForSelector('.palette', { state: 'visible', timeout: 3000 })
  const paletteGroups = await page.locator('.palette-group > p').allTextContents()
  note('palette groups', paletteGroups)
  check('palette actions group', paletteGroups.includes('Actions'))
  const paletteLabels = await page.locator('.palette-label').allTextContents()
  check(
    'palette required actions',
    ['Toggle audio', 'Re-Shatter Screen', 'Copy email'].every((label) =>
      paletteLabels.some((item) => item.toLowerCase().startsWith(label.toLowerCase())),
    ),
    paletteLabels.join(' | '),
  )
  await page.keyboard.press('Escape')

  await page.context().grantPermissions(['clipboard-write'], { origin: url })
  const oscillatorBefore = await page.evaluate(() => window.__oscillatorCount)
  await page.locator('.copy-email').click()
  await page.waitForFunction(() => document.querySelector('.copy-email')?.dataset.copied === 'true')
  check('copy email success state', (await page.locator('.copy-email').textContent())?.includes('Copied to clipboard'))
  const sparkAnimation = await page.locator('.copy-spark--one').evaluate((el) => getComputedStyle(el).animationName)
  check('copy sparkle animates', sparkAnimation === 'copy-spark-one', sparkAnimation)
  const oscillatorAfter = await page.evaluate(() => window.__oscillatorCount)
  check('copy chord uses three tones', oscillatorAfter - oscillatorBefore === 3, `${oscillatorBefore} -> ${oscillatorAfter}`)
  const desktopHeaderFilter = await page.locator('.site-header').evaluate((el) => {
    const style = getComputedStyle(el)
    return style.backdropFilter || style.webkitBackdropFilter || 'none'
  })
  check('desktop header blur kept', desktopHeaderFilter !== 'none', desktopHeaderFilter)

  for (const [id, index] of [['telemetry', 2], ['contact', 6]]) {
    await page.locator('.scroll-rail button').nth(index).click()
    await page.waitForTimeout(1800)
    const sectionTop = await page.evaluate(
      (sid) => Math.round(document.getElementById(sid).getBoundingClientRect().top),
      id,
    )
    check(`rail navigates to ${id}`, sectionTop >= 40 && sectionTop <= 115, `${sectionTop}px`)
  }

  await page.locator('[data-work-item][data-id="sentinel"]').click()
  const captureState = async () => {
    await page.waitForFunction(
      () => {
        const img = document.querySelector('.preview-media img')
        return Boolean(img?.complete && img.naturalWidth > 0)
      },
      null,
      { timeout: 5000 },
    )
    return page.evaluate(() => {
      const media = document.querySelector('.preview-media')
      const img = media?.querySelector('img')
      const rect = media?.getBoundingClientRect()
      const buttons = [...document.querySelectorAll('.viewport-buttons button')]
      return {
        src: img?.getAttribute('src') ?? '',
        label: media?.querySelector('.preview-label')?.textContent ?? '',
        ratio: rect ? Number((rect.height / rect.width).toFixed(2)) : 0,
        naturalRatio: img?.naturalWidth ? Number((img.naturalHeight / img.naturalWidth).toFixed(2)) : 0,
        fit: img ? getComputedStyle(img).objectFit : '',
        viewportBackground: getComputedStyle(document.querySelector('.preview-viewport')).backgroundColor,
        autoActive: buttons.at(-1)?.getAttribute('data-active') === 'true',
      }
    })
  }

  const autoCapture = await captureState()
  check('auto follows desktop device', autoCapture.autoActive && autoCapture.src.includes('sentinel-board-desktop'), JSON.stringify(autoCapture))

  await page.locator('.viewport-buttons button').nth(2).click()
  const deviceCapture = await captureState()
  check('viewport toggle swaps to mobile capture', deviceCapture.src.includes('sentinel-board-mobile'), JSON.stringify(deviceCapture))
  check('mobile capture keeps portrait ratio', deviceCapture.ratio > 2 && deviceCapture.ratio < 2.3, `${deviceCapture.ratio}`)
  check('mobile frame matches source ratio', Math.abs(deviceCapture.ratio - deviceCapture.naturalRatio) < 0.02, `${deviceCapture.ratio}/${deviceCapture.naturalRatio}`)
  check('mobile capture fills its own frame', deviceCapture.fit === 'cover', deviceCapture.fit)
  check('no viewport letterbox background', deviceCapture.viewportBackground === 'rgba(0, 0, 0, 0)', deviceCapture.viewportBackground)

  await page.locator('.viewport-buttons button').nth(1).click()
  const tabletCapture = await captureState()
  check('tablet capture keeps portrait ratio', tabletCapture.src.includes('sentinel-board-tablet') && tabletCapture.ratio > 1.25 && tabletCapture.ratio < 1.4, JSON.stringify(tabletCapture))

  await page.locator('.viewport-buttons button').nth(3).click()
  const restoredCapture = await captureState()
  check('auto button restores device capture', restoredCapture.autoActive && restoredCapture.src.includes('sentinel-board-desktop'), JSON.stringify(restoredCapture))

  check('no desktop console/page errors', errors.length === 0, errors.join(' ; '))
  await page.close()

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const reducedErrors = watch(reduced, 'reduced')
  await reduced.goto(url, { waitUntil: 'domcontentloaded' })
  await reduced.waitForTimeout(400)
  check('reduced motion skips intro', (await reduced.locator('.intro').count()) === 0)
  check('reduced motion site live', await reduced.evaluate(() => document.body.classList.contains('site-live')))
  check('no reduced console/page errors', reducedErrors.length === 0, reducedErrors.join(' ; '))
  await reduced.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const mobileErrors = watch(mobile, 'mobile')
  await mobile.goto(url, { waitUntil: 'domcontentloaded' })
  await mobile.waitForTimeout(500)
  check('mobile skips intro', (await mobile.locator('.intro').count()) === 0)
  const mobileOverflow = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  check('no mobile horizontal overflow', mobileOverflow.scrollWidth <= mobileOverflow.clientWidth + 1, JSON.stringify(mobileOverflow))
  const headerFilter = await mobile.locator('.site-header').evaluate((el) => {
    const style = getComputedStyle(el)
    return style.backdropFilter || style.webkitBackdropFilter || 'none'
  })
  check('mobile header blur disabled', headerFilter === 'none', headerFilter)
  check('no mobile console/page errors', mobileErrors.length === 0, mobileErrors.join(' ; '))
  await mobile.close()

  for (const width of [320, 360, 390, 430, 600, 760, 761, 768, 834, 900, 901, 1024, 1280, 1440, 1920]) {
    const vp = await browser.newPage({ viewport: { width, height: 900 } })
    await vp.goto(url, { waitUntil: 'domcontentloaded' })
    await vp.waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 8000 }).catch(() => {})
    const geometry = await vp.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    check(`no overflow at ${width}px`, geometry.scrollWidth <= geometry.clientWidth + 1, JSON.stringify(geometry))
    await vp.close()
  }
} finally {
  await browser.close()
}

console.log(`\nSummary: ${problems.length === 0 ? 'ALL CHECKS PASSED' : `${problems.length} PROBLEM(S)`}`)
for (const problem of problems) console.log(` - ${problem}`)
process.exit(problems.length === 0 ? 0 : 1)
