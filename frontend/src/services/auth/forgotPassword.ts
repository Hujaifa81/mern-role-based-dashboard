import { serverFetch } from "@/lib/server-fetch";

export async function forgotPassword(email: string) {
  const response = await serverFetch.post("/auth/forgot-password", {
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}
