# BLOCK-4-PROPOSAL.md — research gap closure (local only)

> Status: **APPROVED via `APPROVE-BLOCK-4` — IMPLEMENTED LOCALLY (no push/deploy)**
> Source-of-truth: `PORTFOLIO-RESEARCH-2026-2027.md` (LOCKED), `PARTNER-RULES.md`, `PARTNER-PROGRESS.md`.
> Lane: `C:\Users\KArju\ox-playground\portfolio-v3`, branch `redesign/2026-proof`.
> Current HEAD at proposal time: `036e810…`.
> **No push / deploy / VM / Actions / live repo write in this block.**

---

## 0. Why this block

Blocks 1–3 ne research ka core proof-system bana diya. Lekin research ke kuch items abhi **partial / pending** hain. Block 4 ka kaam sirf un gaps ko close karna hai — **bina naye fake claim ke**.

Koi bhi item jiske liye verified data na ho, uska stage likh kar rakha jayega: `PENDING VERIFIED PROOF` / `PENDING DATA GATE` / `BLOCKED`. Use `DONE` tabhi likha jayega jab local verification ho.

---

## 1. Scope — kya karunga

### B4.1 Real evidence assets (fake covers hatana)
- `ProjectCover` ki synthetic gradient SVG covers **hatana**.
- Jin projects ke paas real capture nahi hai: neutral text-only tile — `NO CAPTURE` + stage (`IN BUILD` / `LIVE PROOF · CAPTURE PENDING`). Koi gradient se bana “screenshot” nahi.
- Public live pages se **dated browser captures** lene ka option: Sentinel board aur Tally board. Save local `public/thumbnails/*-2026-11-27.webp` only after approval.
- Har capture ke saath: `alt`, visible caption, date, source URL, commit/pin agar available ho.
- Tally capture tabhi jab `PENDING DATA GATE` wala proof aa jaye; warna text-only stage card.

### B4.2 Build Lab remaining demos
Research ke Chrome I/O 2026 + Baseline digest items:
- **Theme token demo**: `light-dark()` native path + explicit-token fallback.
- **Entry/exit motion demo**: `@starting-style` + `transition-behavior: allow-discrete`, `@supports` ke peeche; reduced-motion me static.
- **Text scale demo**: `<meta name="text-scale">` ka note + adjustable text control with fallback.
- **`:open` demo**: details/summary open-state styling + `[open]` fallback.
- **`<search>` landmark proof**: semantic `<search>` element with labelled input.
- Sab demos keyboard-reachable, visible focus ke saath.

### B4.3 Progressive Enhancement Matrix completion
Matrix me baaki research rows add karna:
- `view-transition-name` — same-document enhancement only; cross-document nahi.
- `:open`, `light-dark()`, `contrast-color()` (already), `@scope` (already), `animation-timeline` (already), container style queries (already), anchor conflict (already).
- `rcap/rch/rex/ric`, two-value `display`, `animation-composition`, `text-indent`, `shape()`, `color-scheme`, `clamp/` etc. — sirf wahan jahan research ne observed status diya ho.
- Non-Baseline: `@function()`, CSS `if()`, `corner-shape()`, `sibling-index()` — `@supports` ke peeche, clearly labelled `ENHANCEMENT ONLY`.
- Har row me: `feature | Baseline status | native path | fallback | proof`.

### B4.4 WCAG 2.2 + keyboard evidence
- Public copy me explicit line: **“WCAG 2.2-aligned practices”**. Kabhi “WCAG 3 conformant” nahi.
- Keyboard-only test evidence panel: Tab order, focus ring, Escape close, Enter/Space activate — local Playwright results se.
- Focus token min 2px / 3:1 contrast / 2px offset; light + dark dono par visible.

### B4.5 Public machine-readable layer
- Embedded `application/ld+json` block with verified facts only:
  - `Person`, `WebSite`, `ItemList` of public project names + stages.
  - Koi client name, testimonial, logo, rating, hourly rate nahi.
- `proof.json` source-of-truth rahega; embedded block usse derive hoga.
- `llms.txt` optional experiment — is block me **nahi** banaya jayega.

### B4.6 Claim linter hardening
Naye rules:
- fabricated `logo` / `testimonial` / `client` claim detect.
- “WCAG 3 conformant” detect.
- unlabelled experimental soft-nav metric detect.
- cross-document view transition claim detect.
- Purane rules unchanged: Tally wording, repair scope, INVALIDATED repair, rate claim, STAGED label, internal-surface.

### B4.7 Evidence pins + receipts cleanup
- `proof.json` me `receipts` section ko research ke exact values se align karna:
  - Sentinel `48 passed` ✓.
  - Duration conflict `67.86s` brief / `96.89s` log → `unverified` (publish nahi).
  - Commits `214c3bcd…`, `bc53ad87…` unchanged.
  - Tally `PENDING DATA GATE` until `15:05Z + 15:35Z`.
  - STAGED rows uptime denominator se bahar.

---

## 2. Explicitly out of scope

- Koi push, PR, Pages deploy, VM write, GitHub Actions run.
- Fake metric, fake logo, fake testimonial, fake client, `$15–20/hr`.
- Tally `live / real-time / 24-7` wording.
- Case study / LEDGER / backup / outreach / ABXYZ / internal strategy — portfolio par nahi.
- Cross-document view transitions, voice-first nav, spatial/headset, heavy WebGL, a11y overlay, WCAG 3 claim.
- Sentinal duration ko “final” bolna jab tak `67.86s`/`96.89s` conflict resolve na ho.
- Deploy ke baad wala Playwright re-audit — alag approval.

---

## 3. Acceptance criteria

1. `npm run check:claims` OK (naye rules ke saath).
2. `npm run validate` → 8 projects OK.
3. `npm run lint` → exit 0; sirf existing 3 `set-state-in-effect` warnings.
4. `npm run build` → exit 0.
5. Local Playwright audit:
   - 6 modules + naye demos present.
   - No synthetic gradient project covers.
   - Har image/assets me `alt` + caption + date.
   - Focus ring `solid 2px`, offset `2px`.
   - 390px `scrollWidth == clientWidth`.
   - Reduced-motion `animationName = none`.
   - Embedded JSON-LD parse hota hai; koi fabricated field nahi.
   - Forbidden phrases body text me nahi.
6. `git status` clean; local commit; **no push/deploy/VM/Actions**.
7. `PARTNER-PROGRESS.md` me Block 4 entry; `PARTNER-RULES.md` me koi naya rule likhne ki zarurat na ho to append nahi.

---

## 4. Approval gate

Implement sirf exact token ke baad shuru hoga:

**`APPROVE-BLOCK-4`**

Isse pehle koi code write nahi. Token milte hi upar ka scope implement hoga, phir checks + local audit + progress update.
