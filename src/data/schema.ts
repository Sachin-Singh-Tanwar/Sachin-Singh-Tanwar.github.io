import { z } from 'zod'

export const projectSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    tagline: z.string().min(1).max(80),
    problem: z.string().min(1),
    solution: z.string().min(1),
    impact: z.string().min(1),
    tech: z.array(z.string().min(1)).min(1),
    github: z.string().url().nullable(),
    live: z.string().url().nullable(),
    thumbnail: z.string().regex(/^\/thumbnails\/[a-z0-9-]+\.(png|webp)$/).nullable().optional(),
    capture: z.string().regex(/^\/thumbnails\/[a-z0-9-]+\.webp$/).nullable().optional(),
    category: z.enum(['automation', 'web', 'api', 'tool']),
    status: z.enum(['live', 'building']),
    year: z.number().int(),
  })
  .strict()

export type Project = z.infer<typeof projectSchema>
