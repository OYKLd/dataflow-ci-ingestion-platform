"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="border px-3 py-2 rounded"
    >
      Logout
    </button>
  );
}