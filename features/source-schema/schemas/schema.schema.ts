import { z } from "zod";

export const schemaColumnSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
});

export const sourceSchemaSchema = z.object({
  columns: z.array(schemaColumnSchema).min(1),
});