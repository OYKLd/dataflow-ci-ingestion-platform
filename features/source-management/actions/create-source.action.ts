"use server";

import { redirect } from "next/navigation";
import { createSourceSchema } from "../schemas/source.schema";
import { createSource } from "../services/source.service";
import { createSchemaVersion } from "@/features/source-schema/services/schema.service";

export async function createSourceAction(
  formData: FormData
) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const schemaJson = formData.get("schema") as string;

  const parsed = createSourceSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid form data"
    );
  }

  let schema;

  try {
    schema = JSON.parse(schemaJson);
  } catch {
    throw new Error("Invalid JSON schema");
  }

  const source = await createSource(
    parsed.data.name,
    parsed.data.description
  );

  await createSchemaVersion(
    source.id,
    schema
  );

  redirect("/sources");
}