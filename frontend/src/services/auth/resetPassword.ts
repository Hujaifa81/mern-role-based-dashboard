import { serverFetch } from "@/lib/server-fetch";

export async function resetPassword({ token, newPassword, userId }: { token: string; newPassword: string; userId: string }) {
  const response = await serverFetch.post("/auth/reset-password", {
    body: JSON.stringify({ token, newPassword, userId }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}
