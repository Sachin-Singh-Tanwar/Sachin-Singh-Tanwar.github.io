# BLOCK-1-STATE.md — local portfolio lane scaffold

> Private working note for this local lane. No live write, no deploy, no VM change.
> Approved by exact user token `APPROVE-BLOCK-1` on 26 Nov 2026.

## Lane identity

| Field | Value |
|---|---|
| Local folder | `C:\Users\KArju\ox-playground\portfolio-v3` |
| Local branch | `redesign/2026-proof` |
| Base branch | `source` of `Sachin-Singh-Tanwar/Sachin-Singh-Tanwar.github.io` |
| Base commit | `79bb1c630ab1bfd795627d29dee66724c2f801c9` |
| `origin` | GitHub repo above — **read-only intent**; no push done |
| Live site branch | `main` (`5982610a8035c92bf19f60374300c95ea0f052f1`) — untouched |
| `gh-pages` / `legacy-3d` | older 3D build — untouched |
| VM | not touched; VM origin of old build is unverified, not claimed |

## Baseline verification (local only, 26 Nov 2026)

| Check | Result |
|---|---|
| `git status --short --branch` | clean on `redesign/2026-proof` |
| Node / npm | `v24.15.0` / `11.12.1` |
| `npm ci` | 83 packages added, 0 vulnerabilities |
| `npm run validate` | `Validated 8 projects successfully.` |
| `npm run lint` | exit 0; **4 warnings** (`react/set-state-in-effect`): `ProjectsSection.tsx:61`, `ProjectsSection.tsx:77`, `Hero.tsx:36`, `CommandPalette.tsx:45` |
| `npm run build` | exit 0; `dist/index.html` 2.73 kB, CSS `index-w5v-rQ27.css` 42.04 kB, JS `index-DA5y3OpC.js` 397.86 kB |
| Tracked changes | none — `node_modules/`, `dist/`, `screenshots/` are ignored |

## Explicitly not done in Block 1

- No UI/component rewrite.
- No claim-linter code, no `proof.json`, no JSON-LD change.
- No screenshot/receipt fabrication.
- No `git push`, no GitHub Actions run, no GitHub Pages deploy.
- No VM SSH/write.
- No Tally/Sentinel lane change.

## Next

Block 2 requires its own approval. Source-of-truth remains
`C:\Users\KArju\ox-playground\PORTFOLIO-RESEARCH-2026-2027.md` and
`C:\Users\KArju\ox-playground\PARTNER-PROGRESS.md`.
