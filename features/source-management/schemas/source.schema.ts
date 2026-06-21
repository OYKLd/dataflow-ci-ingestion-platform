import { z } from "zod";

export const createSourceSchema = z.object({
  name: z
    .string()
    .min(3, "Source name must contain at least 3 characters"),

  description: z.string().optional(),
});

export type CreateSourceSchema = z.infer<
  typeof createSourceSchema
>;