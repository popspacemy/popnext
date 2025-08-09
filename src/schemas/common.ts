import { z } from "zod/v4"

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
})

export type Pagination = z.infer<typeof paginationSchema>

export const getByIdSchema = z.object({
  id: z.uuid(),
})

export type Id = z.infer<typeof getByIdSchema>
