"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}