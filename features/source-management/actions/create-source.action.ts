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

  const parsed = createSourceSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid form data"
    );
  }

  const source = await createSource(
    parsed.data.name,
    parsed.data.description
  );

  await createSchemaVersion(source.id, {
    columns: [
      {
        name: "date",
        type: "date",
        required: true,
      },
      {
        name: "region",
        type: "string",
        required: true,
      },
      {
        name: "montant_fcfa",
        type: "integer",
        required: true,
      },
      {
        name: "client_id",
        type: "string",
        required: true,
      },
    ],
  });

  redirect("/sources");
}