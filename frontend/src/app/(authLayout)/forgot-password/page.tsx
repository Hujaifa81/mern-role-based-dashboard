"use client";
import { useState } from "react";
import { forgotPassword } from "@/services/auth/forgotPassword";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await forgotPassword(email);
			if (res.success) {
				toast.success("Password reset email sent!");
			} else {
				toast.error(res.message || "Failed to send email");
			}
		} catch (err) {
			toast.error("Error sending email");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
			<h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					className="w-full border px-3 py-2 rounded"
					placeholder="Enter your email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
					disabled={loading}
				>
					{loading ? "Sending..." : "Send Reset Link"}
				</button>
			</form>
		</div>
	);
}