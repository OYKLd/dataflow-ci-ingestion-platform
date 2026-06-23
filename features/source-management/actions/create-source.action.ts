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
      name: "date_vente",
      type: "date",
      required: true,
    },
    {
      name: "agence_code",
      type: "string",
      required: true,
      pattern: "^AG-[A-Z]{3}-\\d{4}$",
    },
    {
      name: "region",
      type: "enum",
      required: true,
      allowed_values: [
        "Abidjan",
        "Bouaké",
        "Yamoussoukro",
        "Daloa",
        "San-Pédro",
        "Korhogo",
        "Man",
        "Gagnoa",
      ],
    },
    {
      name: "type_forfait",
      type: "enum",
      required: true,
      allowed_values: [
        "prepaid",
        "postpaid",
        "data_only",
        "fiber",
      ],
    },
    {
      name: "quantite",
      type: "integer",
      required: true,
      min: 1,
      max: 10000,
    },
    {
      name: "montant_fcfa",
      type: "integer",
      required: true,
      min: 0,
    },
    {
      name: "client_segment",
      type: "enum",
      required: false,
      allowed_values: [
        "B2C",
        "B2B",
        "VIP",
      ],
    },
    {
      name: "commercial_email",
      type: "string",
      required: true,
      pattern:
        "^[a-zA-Z0-9._-]+@orange\\.ci$",
    },
  ],
});

  redirect("/sources");
}