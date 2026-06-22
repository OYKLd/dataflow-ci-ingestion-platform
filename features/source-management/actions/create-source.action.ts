"use server";

import { redirect } from "next/navigation";
import { createSourceSchema } from "../schemas/source.schema";
import { createSource } from "../services/source.service";

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

  await createSource(
    parsed.data.name,
    parsed.data.description
  );

  redirect("/sources");
}