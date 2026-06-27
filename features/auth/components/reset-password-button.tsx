"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/features/auth/actions/reset-password.action";

type Props = {
  userId: string;
  userEmail: string;
};

export function ResetPasswordButton({ userId, userEmail }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("newPassword", newPassword);

    try {
      const result = await resetPasswordAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Password reset successfully");
        setNewPassword("");
        setTimeout(() => {
          setShowModal(false);
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
      >
        Reset Password
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Reset Password for {userEmail}
            </h3>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded">
                  {success}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setSuccess("");
                    setNewPassword("");
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
