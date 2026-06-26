import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: { token: string };
}) {
  const invite = await prisma.invitation.findUnique({
    where: { token: params.token },
  });

  if (!invite || invite.used) {
    return <p>Invitation invalide</p>;
  }

  return (
    <form action="/api/auth/complete-invite" method="POST">
      <input type="hidden" name="token" value={params.token} />

      <input
        name="password"
        type="password"
        placeholder="Create password"
      />

      <button>Create account</button>
    </form>
  );
}