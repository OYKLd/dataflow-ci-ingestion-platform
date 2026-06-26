"use server";

import { redirect } from "next/navigation";
import { createSourceSchema } from "../schemas/source.schema";
import { createSource } from "../services/source.service";
import { createSchemaVersion } from "@/features/source-schema/services/schema.service";

export async function createSourceAction(formData: FormData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const parsed = createSourceSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data");
  }

  // 🔥 lecture textarea
  const schemaText = formData.get("schemaText") as string;

  // 🔥 lecture fichier
  const schemaFile = formData.get("schemaFile") as File | null;

  let schema;

  try {
    if (schemaFile && schemaFile.size > 0) {
      const fileContent = await schemaFile.text();
      schema = JSON.parse(fileContent);
    } else if (schemaText) {
      schema = JSON.parse(schemaText);
    } else {
      throw new Error("Schema required (text or file)");
    }
  } catch {
    throw new Error("Invalid JSON schema");
  }

  const source = await createSource(
    parsed.data.name,
    parsed.data.description
  );

  await createSchemaVersion(source.id, schema);

  redirect("/sources");
}