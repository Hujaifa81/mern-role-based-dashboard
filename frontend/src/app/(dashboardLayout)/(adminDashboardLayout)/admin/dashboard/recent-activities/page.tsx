/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getRecentActivityLogs } from "@/services/activity/admin-activity-logs.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Activity, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  activityType: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  affectedResource?: string;
  createdAt: string;
}

const getActivityTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    LOGIN: "bg-blue-600",
    LOGOUT: "bg-slate-600",
    REGISTRATION: "bg-green-600",
    PASSWORD_CHANGE: "bg-yellow-600",
    PASSWORD_RESET: "bg-orange-600",
    EMAIL_VERIFIED: "bg-teal-600",
    PROFILE_UPDATE: "bg-indigo-600",
    USER_UPDATED: "bg-purple-600",
    USER_SUSPENDED: "bg-red-600",
    USER_ACTIVATED: "bg-green-600",
    ROLE_CHANGED: "bg-pink-600",
  };
  return colors[type] || "bg-slate-600";
};

const getActivityIcon = (type: string) => {
  // Return emoji icons based on activity type
  const icons: Record<string, string> = {
    LOGIN: "🔐",
    LOGOUT: "🚪",
    REGISTRATION: "✨",
    PASSWORD_CHANGE: "🔑",
    PASSWORD_RESET: "🔄",
    EMAIL_VERIFIED: "✅",
    PROFILE_UPDATE: "👤",
    USER_UPDATED: "📝",
    USER_SUSPENDED: "⛔",
    USER_ACTIVATED: "✔️",
    ROLE_CHANGED: "🎭",
  };
  return icons[type] || "📋";
};

function RecentActivitiesContent({ activityLogs }: { activityLogs: ActivityLog[] }) {

  // Group activities by time period
  const now = new Date();
  const today = activityLogs.filter(
    (log) =>
      new Date(log.createdAt).toDateString() === now.toDateString()
  );
  const yesterday = activityLogs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return logDate.toDateString() === yesterdayDate.toDateString();
  });
  const older = activityLogs.filter(
    (log) =>
      !today.includes(log) && !yesterday.includes(log)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Clock className="h-8 w-8" />
            Recent Activities
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Latest system activities in real-time
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/activity-logs" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{today.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Activities today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yesterday</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{yesterday.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Activities yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Shown</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activityLogs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Recent activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activities */}
      {today.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Today
            </CardTitle>
            <CardDescription>{today.length} activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {today.map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-shrink-0 text-3xl">
                    {getActivityIcon(log.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActivityTypeColor(log.activityType)}>
                        {log.activityType.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{log.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {log.user?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <span>{log.user?.name || "Unknown User"}</span>
                      </div>
                      {log.ipAddress && (
                        <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {log.ipAddress}
                        </code>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(new Date(log.createdAt), "HH:mm:ss")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yesterday's Activities */}
      {yesterday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Yesterday
            </CardTitle>
            <CardDescription>{yesterday.length} activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {yesterday.map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-shrink-0 text-3xl">
                    {getActivityIcon(log.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActivityTypeColor(log.activityType)}>
                        {log.activityType.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {format(new Date(log.createdAt), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{log.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {log.user?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <span>{log.user?.name || "Unknown User"}</span>
                      </div>
                      {log.ipAddress && (
                        <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {log.ipAddress}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Older Activities */}
      {older.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Older
            </CardTitle>
            <CardDescription>{older.length} activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {older.map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-shrink-0 text-3xl">
                    {getActivityIcon(log.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActivityTypeColor(log.activityType)}>
                        {log.activityType.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{log.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {log.user?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <span>{log.user?.name || "Unknown User"}</span>
                      </div>
                      {log.ipAddress && (
                        <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {log.ipAddress}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activityLogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recent activities</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function RecentActivitiesPage() {
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getRecentActivityLogs(50);
        setActivityLogs(response?.data || []);
      } catch (error) {
        setActivityLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  return <RecentActivitiesContent activityLogs={activityLogs} />;
}
