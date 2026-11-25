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
    capture: z
      .string()
      .regex(/^\/thumbnails\/[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-\d{2}-\d{2}\.webp$/)
      .nullable()
      .optional(),
    category: z.enum(['automation', 'web', 'api', 'tool']),
    status: z.enum(['live', 'building']),
    year: z.number().int(),
  })
  .strict()
  .superRefine((project, ctx) => {
    if (/PLACEHOLDER:/i.test(project.impact)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['impact'],
        message: 'impact must not contain PLACEHOLDER:',
      })
    }
    if (project.capture) {
      const date = project.capture.match(/(\d{4}-\d{2}-\d{2})\.webp$/)?.[1]
      const parsed = date ? new Date(date) : null
      const validDate = !!date && !!parsed && !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date
      if (!validDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['capture'],
          message: 'capture filename must carry a valid YYYY-MM-DD date',
        })
      }
      if (project.status !== 'live' || !project.live) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['capture'],
          message: 'capture requires status live and a real live URL',
        })
      }
    }
  })

export type Project = z.infer<typeof projectSchema>
