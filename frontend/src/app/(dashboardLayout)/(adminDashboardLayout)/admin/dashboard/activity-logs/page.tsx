/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAllActivityLogs } from "@/services/activity/admin-activity-logs.service";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FileText } from "lucide-react";

import { format } from "date-fns";
import React, { useEffect, useState, useTransition } from "react";
import { ActivityLogTableFilters } from "@/components/activity/ActivityLogTableFilters";
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

interface ActivityLogsContentProps {
  activityLogs: ActivityLog[];
  filterBar: React.ReactNode;
  meta: { page: number; limit: number; total: number; totalPage: number } | null;
  page: number;
  setPage: (page: number) => void;
}

function ActivityLogsContent({ activityLogs, filterBar, meta, page, setPage }: ActivityLogsContentProps) {
  // Calculate stats
  const totalLogs = meta?.total ?? activityLogs.length;
  const uniqueUsers = new Set(activityLogs.map((log) => log.user._id)).size;
  const activityTypes = new Set(activityLogs.map((log) => log.activityType)).size;
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const recentLogs = activityLogs.filter(
    (log) =>
      new Date(log.createdAt) > oneDayAgo
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Activity Logs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Complete system activity history
          </p>
        </div>
        {filterBar}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-3xl">{totalLogs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unique Users</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{uniqueUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Activity Types</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{activityTypes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last 24 Hours</CardDescription>
            <CardTitle className="text-3xl text-green-600">{recentLogs}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Activity Logs</CardTitle>
          <CardDescription>
            Complete activity history of all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {log.user?.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{log.user?.name || "Unknown User"}</p>
                        <p className="text-xs text-slate-500">{log.user?.email || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActivityTypeColor(log.activityType)}>
                      {log.activityType.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{log.description}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {log.ipAddress || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {format(new Date(log.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(new Date(log.createdAt), "HH:mm:ss")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {activityLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No activity logs found</p>
            </div>
          )}
          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </Button>
              <span>Page {meta.page} of {meta.totalPage}</span>
              <Button variant="outline" size="sm" disabled={page === meta.totalPage} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivityLogsPage() {
  let initialFilters: {
    searchTerm: string;
    activityType: string;
    startDate: string | undefined;
    endDate: string | undefined;
    sort: string;
  } = {
    searchTerm: "",
    activityType: "ALL",
    startDate: undefined,
    endDate: undefined,
    sort: "-createdAt",
  };
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    initialFilters = {
      searchTerm: params.get("searchTerm") || "",
      activityType: params.get("activityType") || "ALL",
      startDate: params.get("startDate") || undefined,
      endDate: params.get("endDate") || undefined,
      sort: params.get("sort") || "-createdAt",
    };
  }
  const [filters, setFilters] = useState<any>(initialFilters);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPage: number } | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Sync filters with URL changes (popstate and programmatic)
  useEffect(() => {
    const syncFiltersFromUrl = () => {
      let params: URLSearchParams;
      if (typeof window !== "undefined") {
        params = new URLSearchParams(window.location.search);
      } else {
        params = new URLSearchParams();
      }
      setFilters({
        searchTerm: params.get("searchTerm") || "",
        activityType: params.get("activityType") || "ALL",
        startDate: params.get("startDate") || undefined,
        endDate: params.get("endDate") || undefined,
        sort: params.get("sort") || "-createdAt",
      });
      setPage(Number(params.get("page")) || 1);
    };
    syncFiltersFromUrl(); // initial mount
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", syncFiltersFromUrl);
      let lastSearch = window.location.search;
      const interval = setInterval(() => {
        if (window.location.search !== lastSearch) {
          lastSearch = window.location.search;
          syncFiltersFromUrl();
        }
      }, 200);
      return () => {
        window.removeEventListener("popstate", syncFiltersFromUrl);
        clearInterval(interval);
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const params: any = { limit: 10, page };
    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.activityType && filters.activityType !== "ALL") params.activityType = filters.activityType;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }
    if (filters.sort) params.sort = filters.sort;
    let cancelled = false;
    startTransition(() => {
      setLoading(true);
      getAllActivityLogs(params)
        .then((response) => {
          if (!cancelled) {
            setActivityLogs(response?.data || []);
            setMeta(response?.meta || null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setActivityLogs([]);
            setMeta(null);
          }
        })
        .finally(() => { if (!cancelled) setLoading(false); });
    });
    return () => { cancelled = true; };
  }, [filters, page]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  return (
    <ActivityLogsContent
      activityLogs={activityLogs}
      filterBar={<ActivityLogTableFilters initial={initialFilters} />}
      meta={meta}
      page={page}
      setPage={setPage}
    />
  );
}
