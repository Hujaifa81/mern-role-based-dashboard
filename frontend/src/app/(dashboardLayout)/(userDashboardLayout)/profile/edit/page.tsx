import { getUserInfo } from "@/services/auth/getUserInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/components/modules/Profile/EditProfileForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function EditProfilePage() {
  const userInfo = await getUserInfo();

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/profile">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Update your account information
        </p>
      </div>

      {/* Edit Form Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and other profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={userInfo} />
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProfilePage;
