"use client";

import { useState } from "react";

type RoleSelectProps = {
  userId: string;
  currentRole: string;
};

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const [role, setRole] = useState(currentRole);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);

    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        role: newRole,
      }),
    });

    window.location.reload();
  };

  return (
    <select
      value={role}
      onChange={handleChange}
      className="border px-2 py-1"
    >
      <option value="ADMIN">ADMIN</option>
      <option value="ANALYST">ANALYST</option>
      <option value="VIEWER">VIEWER</option>
    </select>
  );
}
