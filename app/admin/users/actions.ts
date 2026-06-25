import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}