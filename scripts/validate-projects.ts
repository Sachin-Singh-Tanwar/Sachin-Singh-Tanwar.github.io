import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { projectSchema } from '../src/data/schema'

const path = fileURLToPath(new URL('../src/data/projects.json', import.meta.url))
const raw = readFileSync(path, 'utf8')

let data: unknown
try {
  data = JSON.parse(raw)
} catch (error) {
  console.error('projects.json is not valid JSON:', error)
  process.exit(1)
}

if (!Array.isArray(data)) {
  console.error('projects.json must be an array of projects')
  process.exit(1)
}

let failed = false
data.forEach((item, index) => {
  const result = projectSchema.safeParse(item)
  if (result.success) return
  failed = true
  const id = (item as { id?: unknown } | null)?.id ?? 'no id'
  console.error(`Project ${index} (${String(id)}) is invalid:`)
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
})

if (failed) process.exit(1)
console.log(`Validated ${data.length} projects successfully.`)
