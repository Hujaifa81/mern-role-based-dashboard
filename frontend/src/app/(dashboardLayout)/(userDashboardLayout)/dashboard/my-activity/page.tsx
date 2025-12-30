/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { getMyActivityLogs } from "@/services/activity/my-activity-logs.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityLogTableFilters } from "@/components/activity/ActivityLogTableFilters";
import { format } from "date-fns";
import React, { useEffect, useState, useTransition } from "react";
import { IActivityLog } from "@/types/activity.interface";

export const dynamic = "force-dynamic";


interface MyActivityLogsContentProps {
  activityLogs: IActivityLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  page: number;
  setPage: (page: number) => void;
  filterBar: React.ReactNode;
}

function MyActivityLogsContent({ activityLogs, meta, page, setPage, filterBar }: MyActivityLogsContentProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Activity Logs</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Complete history of your account activities</p>
        </div>
        {filterBar}
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">All Activities</CardTitle>
          <CardDescription>
            Showing {activityLogs.length || 0} of {meta?.total || 0} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityLogs.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                    <TableHead className="font-semibold">Activity</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Browser</TableHead>
                    <TableHead className="font-semibold text-right">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((activity) => (
                    <TableRow key={activity._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {activity.activityType.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{activity.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {activity.ipAddress || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.userAgent || "N/A"}
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
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">No activities yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your activity history will appear here</p>
            </div>
          )}
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button className="btn btn-outline px-3 py-1 rounded disabled:opacity-50" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span>Page {meta.page} of {meta.totalPages}</span>
              <button className="btn btn-outline px-3 py-1 rounded disabled:opacity-50" disabled={page === meta.totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyActivityPage() {
  type FilterState = {
    searchTerm: string;
    activityType: string;
    startDate?: string;
    endDate?: string;
    sort: string;
  };
  let initialFilters: FilterState = {
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
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<MyActivityLogsContentProps["meta"]>(null);
  const [activityLogs, setActivityLogs] = useState<IActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Sync filters with URL changes
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
    syncFiltersFromUrl();
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
    const params: {
      limit: number;
      page: number;
      searchTerm?: string;
      activityType?: string;
      startDate?: string;
      endDate?: string;
      sort?: string;
    } = { limit: 10, page };
    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.activityType && filters.activityType !== "ALL") params.activityType = filters.activityType;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.sort) params.sort = filters.sort;
    let cancelled = false;
    startTransition(() => {
      setLoading(true);
      getMyActivityLogs(params)
        .then((response) => {
          if (!cancelled) {
            setActivityLogs(response?.data || []);
            // Map totalPage (backend) to totalPages (frontend)
            if (response?.meta) {
              const { totalPage, ...rest } = response.meta as any;
              setMeta({ ...rest, totalPages: totalPage ?? rest.totalPages });
            } else {
              setMeta(null);
            }
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
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  return (
    <MyActivityLogsContent
      activityLogs={activityLogs}
      meta={meta}
      page={page}
      setPage={setPage}
      filterBar={<ActivityLogTableFilters initial={initialFilters} />}
    />
  );
}
