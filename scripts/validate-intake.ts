import { readFileSync } from 'fs'
import { projectSchema } from '../src/data/schema'

const raw = JSON.parse(readFileSync('src/data/project.intake.example.json', 'utf8'))
const result = projectSchema.safeParse(raw)
console.log('INTAKE_EXAMPLE_VALID=' + (result.success ? 'YES' : 'NO'))
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2))
  process.exitCode = 1
}

const placeholder = projectSchema.safeParse({ ...raw, impact: 'PLACEHOLDER: 99% recovery' })
console.log('PLACEHOLDER_IMPACT_REJECTED=' + (placeholder.success ? 'NO' : 'YES'))

const undated = projectSchema.safeParse({
  ...raw,
  status: 'live',
  live: 'https://example.com',
  capture: '/thumbnails/tally.webp',
})
console.log('UNDATED_CAPTURE_REJECTED=' + (undated.success ? 'NO' : 'YES'))

const noLive = projectSchema.safeParse({
  ...raw,
  capture: '/thumbnails/tally-2026-11-25.webp',
})
console.log('CAPTURE_WITHOUT_LIVE_REJECTED=' + (noLive.success ? 'NO' : 'YES'))
