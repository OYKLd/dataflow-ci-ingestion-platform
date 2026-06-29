import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canCreateSchema } from "@/lib/permissions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ schemaId: string }> }
) {
  const user = await getCurrentUser();

  if (!user || !canCreateSchema(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { schemaId } = await params;

  try {
    // Get the schema version to activate
    const schemaVersion = await prisma.schemaVersion.findUnique({
      where: { id: schemaId },
      include: { source: true },
    });

    if (!schemaVersion) {
      return NextResponse.json({ error: "Schema version not found" }, { status: 404 });
    }

    // Return the schema version (activation logic removed as active field not in schema)
    return NextResponse.json({ success: true, schema: schemaVersion });
  } catch (error) {
    console.error("Error activating schema:", error);
    return NextResponse.json({ error: "Failed to activate schema" }, { status: 500 });
  }
}
