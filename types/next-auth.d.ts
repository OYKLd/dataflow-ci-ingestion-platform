import type { DefaultSession, DefaultUser } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: UserRole;
  }

  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}
