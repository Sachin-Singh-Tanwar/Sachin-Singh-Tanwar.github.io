# Projects data guide

`src/data/projects.json` is the single source of truth for the project showcase. Every entry is
validated against `src/data/schema.ts` by `npm run validate` before a build or deploy.

## Add a project

1. Append one object to `src/data/projects.json`. Use a unique kebab-case `id`.
2. Add its thumbnail to `public/thumbnails/<id>.png` (1200x630 recommended).
3. Run `npm run validate`. Fix any reported field errors.
4. Run `npm run build`, then push. The deploy workflow rebuilds and publishes `dist/`.

Required fields: `id`, `title`, `tagline` (max 80 chars), `problem`, `solution`, `impact`,
`tech`, `github`, `live`, `thumbnail`, `category`, `status`, `year`. Use `null` for missing
links. `category` is one of `automation`, `web`, `api`, `tool`; `status` is `live` or `building`.

## Remove a project

Delete its object from the array and delete `public/thumbnails/<id>.png` if unused. Run
`npm run validate` and rebuild. Nothing else needs editing — filters, carousel and modal are
derived from the array.

## Mark a project as building

Set `"status": "building"` and `"impact": "In development"`. The card shows an amber badge and
the modal shows "In development — case study coming soon". Do not invent metrics or clients.

## Order

Array order is display order in the carousel. Move an object to change its position.

## Never do this

- Do not add extra fields: the schema is strict and validation will fail.
- Do not invent impact numbers, client logos or testimonials.
