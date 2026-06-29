import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canCreateSchema } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !canCreateSchema(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const schemas = await prisma.schemaVersion.findMany({
      include: {
        source: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(schemas);
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return NextResponse.json({ error: "Failed to fetch schemas" }, { status: 500 });
  }
}
