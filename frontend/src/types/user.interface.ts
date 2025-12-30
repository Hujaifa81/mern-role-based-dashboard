import { UserRole } from "@/lib/auth-utils";

export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: "ACTIVE" | "SUSPENDED";
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    picture?: string;
}