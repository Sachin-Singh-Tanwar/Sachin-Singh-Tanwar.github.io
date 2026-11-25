import { readFileSync } from 'fs'
import { projectSchema } from '../src/data/schema'

const raw = JSON.parse(readFileSync('src/data/project.intake.example.json', 'utf8'))
const result = projectSchema.safeParse(raw)
console.log('INTAKE_EXAMPLE_VALID=' + (result.success ? 'YES' : 'NO'))
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2))
  process.exitCode = 1
} else {
  console.log('INTAKE_IMAGE=' + result.data.capture)
}

