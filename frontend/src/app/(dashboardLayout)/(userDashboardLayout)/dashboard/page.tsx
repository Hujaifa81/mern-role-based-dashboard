import { getMyActivityLogs } from "@/services/activity/activityLog.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Calendar, Mail, Shield, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

// Dynamic SSR
export const dynamic = "force-dynamic";

async function UserDashboardContent() {
  const userInfo = await getUserInfo();
  const activityResult = await getMyActivityLogs(10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {userInfo.name}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Here is your recent activity overview
        </p>
      </div>

      {/* Activity Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Recent Activities</CardTitle>
              <CardDescription>Your latest account activities</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/my-activity">
                View All <Activity className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activityResult.data && activityResult.data.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                    <TableHead className="font-semibold">Activity</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold text-right">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityResult.data.map((activity) => (
                    <TableRow key={activity._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {activity.activityType.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {activity.ipAddress || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">
                        <div>{format(new Date(activity.createdAt), "MMM dd, yyyy")}</div>
                        <div className="text-xs">{format(new Date(activity.createdAt), "h:mm a")}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                <Activity className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">No activities yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your activity history will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const UserDashboardPage = () => {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 h-40 animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <UserDashboardContent />
      </Suspense>
    </div>
  );
};

export default UserDashboardPage;