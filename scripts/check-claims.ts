import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const extensions = new Set(['.ts', '.tsx', '.json', '.html', '.css'])
const skipDirs = new Set(['node_modules', 'dist', '.git'])
const files: string[] = []

function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(full)
      continue
    }
    if (extensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) files.push(full)
  }
}

walk(join(root, 'src'))
files.push(join(root, 'index.html'))

type Rule = {
  id: string
  message: string
  matches: (line: string) => boolean
}

const rules: Rule[] = [
  {
    id: 'tally-wording',
    message: 'Tally must be "scheduled audit — external trigger", not live/real-time/24-7.',
    matches: (line) => /\btally\b/i.test(line) && /\b(live|real[\s-]?time|24[\s/\-–]?7|always[\s-]?on)\b/i.test(line),
  },
  {
    id: 'repair-scope',
    message: 'repair-certified is only valid for books; other sources are configured + sealed + validated.',
    matches: (line) => /repair-certified/i.test(line) && !/\bbooks\b/i.test(line),
  },
  {
    id: 'invalidated-repair-claim',
    message: 'INVALIDATED incidents must show CLOSED, never REPAIRED or MTTR.',
    matches: (line) => /\binvalidated\b/i.test(line) && /\b(mttr|repaired)\b/i.test(line),
  },
  {
    id: 'rate-claim',
    message: 'Hourly rate claims such as $15–20/hr are forbidden.',
    matches: (line) => /\$\s*15\s*[-–—]\s*20\s*\/\s*hr/i.test(line),
  },
  {
    id: 'staged-label',
    message: 'Every staged reference needs an explicit uppercase STAGED label.',
    matches: (line) => /\bstaged\b/i.test(line) && !/\bSTAGED\b/.test(line),
  },
  {
    id: 'internal-surface',
    message: 'Internal-only terms must not appear in public portfolio files.',
    matches: (line) =>
      /\b(ledger|rclone|abxyz|central[ -]hub|outreach|case[ -]stud(?:y|ies)|backup|credential|secret|strategy)\b/i.test(
        line,
      ),
  },
]

const findings: string[] = []

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.matches(line)) {
        findings.push(`${file.slice(root.length + 1)}:${index + 1} [${rule.id}] ${rule.message}`)
      }
    }
  })
}

if (findings.length > 0) {
  console.error(`Claim lint FAILED with ${findings.length} finding(s):`)
  for (const finding of findings) console.error(`  - ${finding}`)
  process.exit(1)
}

console.log(`Claim lint OK — ${files.length} shipped text files checked.`)
