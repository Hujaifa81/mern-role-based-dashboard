/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getSingleUser } from "@/services/user/user-management.service";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";


interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
	status: string;
	isVerified: boolean;
	createdAt: string;
}

export default function ViewUserPage({ params }: { params: Promise<{ userId: string }> }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState<string>("");


	useEffect(() => {
		const init = async () => {
			const resolvedParams = await params;
			setUserId(resolvedParams.userId);
		};
		init();
	}, [params]);

	useEffect(() => {
		if (!userId) return;
		const fetchUser = async () => {
			try {
				const response = await getSingleUser(userId);
				setUser(response?.data || null);
			} catch (error) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [userId]);

	if (loading) {
		return (
			<div className="max-w-xl mx-auto py-8">
				<Skeleton className="h-10 w-full mb-6" />
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-1/2 mb-2" />
						<Skeleton className="h-4 w-1/3" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-5 w-1/4" />
						<Skeleton className="h-5 w-1/4" />
						<Skeleton className="h-5 w-1/4" />
						<Skeleton className="h-5 w-1/3" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!user) {
		return <div className="text-center py-12 text-red-500">User not found</div>;
	}

	return (
		<div className="max-w-xl mx-auto py-8">
			<Link href="/admin/dashboard/users-management" className="flex items-center gap-2 mb-6 text-blue-600 hover:underline">
				<ArrowLeft className="h-4 w-4" /> Back to Users
			</Link>
			<Card>
				<CardHeader>
					<CardTitle>{user.name}</CardTitle>
					<CardDescription>User Details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<span className="font-semibold">Email:</span> {user.email}
					</div>
					<div>
						<span className="font-semibold">Role:</span> <Badge>{user.role}</Badge>
					</div>
					<div>
						<span className="font-semibold">Status:</span> <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>{user.status}</Badge>
					</div>
					<div>
						<span className="font-semibold">Verified:</span> {user.isVerified ? <Badge className="bg-blue-600">Verified</Badge> : <Badge variant="outline">Unverified</Badge>}
					</div>
					<div>
						<span className="font-semibold">Joined:</span> {format(new Date(user.createdAt), "MMM dd, yyyy")}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}