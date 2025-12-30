"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/auth/resetPassword";
import { toast } from "sonner";

export default function ResetPasswordPage() {
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token") || "";
	const userId = searchParams.get("userId") || "";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await resetPassword({ token, newPassword, userId });
			if (res.success) {
				toast.success("Password reset successful!");
				setTimeout(() => {
					router.push("/login");
				}, 1200);
			} else {
				toast.error(res.message || "Failed to reset password");
			}
		} catch (err) {
			toast.error("Error resetting password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
			<h2 className="text-2xl font-bold mb-4">Reset Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="password"
					className="w-full border px-3 py-2 rounded"
					placeholder="Enter new password"
					value={newPassword}
					onChange={e => setNewPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
					disabled={loading}
				>
					{loading ? "Resetting..." : "Reset Password"}
				</button>
			</form>
		</div>
	);
}