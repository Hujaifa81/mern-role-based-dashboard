import { getUserInfo } from "@/services/auth/getUserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, Shield, Edit, Activity } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";


function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="h-8 w-48 mb-2 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-6">
        <div className="h-20 w-20 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-40 bg-slate-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

async function ProfileContent() {
  const userInfo = await getUserInfo();
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {userInfo.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{userInfo.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{userInfo.role}</Badge>
                  <Badge variant={userInfo.status === "ACTIVE" ? "default" : "destructive"}>
                    {userInfo.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Account Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Full Name</p>
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {userInfo.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email Address</p>
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Member Since</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {format(new Date(userInfo.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="shadow-sm pb-7">
          <CardHeader>
            <CardTitle className="text-lg">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Account Role</p>
                <Badge variant="outline" className="mt-1">
                  {userInfo.role}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <Badge
                  variant={userInfo.status === "ACTIVE" ? "default" : "destructive"}
                  className="mt-1"
                >
                  {userInfo.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email Verification</p>
                <Badge
                  variant={userInfo.isVerified ? "default" : "secondary"}
                  className="mt-1"
                >
                  {userInfo.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/change-password">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/dashboard/my-activity">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Activity Logs</p>
                    <p className="text-xs text-muted-foreground">View your account activity</p>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Suspense } from "react";

export default function MyProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
