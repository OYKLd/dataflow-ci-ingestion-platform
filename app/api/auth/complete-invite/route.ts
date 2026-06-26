import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const form = await req.formData();

  const token = form.get("token") as string;
  const password = form.get("password") as string;

  const invite = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invite || invite.used) {
    return new Response("Invalid invite", { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: invite.email,
      password: hashed,
      role: invite.role,
    },
  });

  await prisma.invitation.update({
    where: { id: invite.id },
    data: { used: true },
  });

  return Response.redirect("http://localhost:3000/login");
}