"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

function ChangePasswordPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Simulate loading
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-slate-200 animate-pulse" />
          <div>
            <div className="h-8 w-48 mb-2 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-32 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
          <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Change Password
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      {/* Change Password Form Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Update Your Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="shadow-sm border-blue-200 dark:border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-lg">Password Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>Avoid using personal information or common words</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>Do not reuse passwords from other accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>Change your password regularly for better security</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePasswordPage;
