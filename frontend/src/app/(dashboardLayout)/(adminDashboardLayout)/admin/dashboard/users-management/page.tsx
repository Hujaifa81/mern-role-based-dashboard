/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAllUsers, updateUser } from "@/services/user/user-management.service";
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
import { UserTableFilters } from "@/components/users/UserTableFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Search, Eye, Edit, Ban, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

function UsersManagementContent() {
    // Clear query params when leaving the page
    useEffect(() => {
      return () => {
        // Only clear query params if still on users-management route
        if (window.location.pathname === "/admin/dashboard/users-management") {
          window.history.replaceState({}, "", "/admin/dashboard/users-management");
        }
      };
    }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; status: string } | null>(null);
  const [roleAlertOpen, setRoleAlertOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ id: string; newRole: string } | null>(null);
  const [filters, setFilters] = useState<any>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      searchTerm: params.get("searchTerm") || "",
      role: params.get("role") || "all",
      status: params.get("status") || "all",
      startDate: params.get("startDate") || undefined,
      endDate: params.get("endDate") || undefined,
      sort: params.get("sort") || "-createdAt",
    };
  });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPage: number } | null>(null);
  const router = useRouter();

  const handleRoleSelect = (userId: string, newRole: string) => {
    setPendingRoleChange({ id: userId, newRole });
    setRoleAlertOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { id, newRole } = pendingRoleChange;
    setActionLoading(id);
    setRoleAlertOpen(false);
    try {
      await updateUser(id, { role: newRole });
      toast.success("Role updated successfully");
      startTransition(() => {
        fetchUsers();
        router.refresh();
      });
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(null);
      setPendingRoleChange(null);
    }
  };

  const fetchUsers = async (params = {}, isInitial = false) => {
    try {
      if (isInitial) setInitialLoading(true);
      setError(null);
      const response = await getAllUsers({ ...filters, page, limit: 5, ...params });
      if (!response || response.success === false || response.statusCode === 401 || response.statusCode === 403) {
        setError(response?.message || "Unauthorized or failed to load users.");
        setUsers([]);
        setMeta(null);
        return;
      }
      setUsers(response?.data || []);
      setMeta(response?.meta || null);
    } catch (err) {
      setError("Failed to load users. Please check your login or server.");
      setUsers([]);
      setMeta(null);
      console.error("Failed to load users:", err);
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  // Only fetch users when filters or page change
  // Initial load
  useEffect(() => {
    fetchUsers({}, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch on filter/page change (not initial)
  useEffect(() => {
    if (!initialLoading) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // Sync filters with URL changes (popstate) and on mount
  useEffect(() => {
    const syncFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const newFilters = {
        searchTerm: params.get("searchTerm") || "",
        role: params.get("role") || "all",
        status: params.get("status") || "all",
        startDate: params.get("startDate") || undefined,
        endDate: params.get("endDate") || undefined,
        sort: params.get("sort") || "-createdAt",
      };
      startTransition(() => setFilters(newFilters));
    };
    syncFiltersFromUrl(); // initial mount
    window.addEventListener("popstate", syncFiltersFromUrl);
    // Listen for URL changes (including programmatic)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters: any) => {
    // No-op: filters are now synced from URL only
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setSelectedUser({ id: userId, status: currentStatus });
    setAlertOpen(true);
  };

  const confirmStatusToggle = async () => {
    if (!selectedUser) return;

    const { id: userId, status: currentStatus } = selectedUser;
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    setActionLoading(userId);
    setAlertOpen(false);
    try {
      await updateUser(userId, { status: newStatus });
      toast.success(
        newStatus === "ACTIVE" ? "User activated successfully" : "User suspended successfully"
      );
      startTransition(() => {
        fetchUsers();
        router.refresh();
      });
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Failed to update user status:", error);
    } finally {
      setActionLoading(null);
      setSelectedUser(null);
    }
  };

  // Remove full page skeleton for isPending
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">{error}</p>
        <p className="text-slate-500 mt-2">Try logging in again or check your server.</p>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardHeader>
            </Card>
          ))}
        </div>
        {/* Filters Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Users Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show table skeleton when isPending (not full page)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Users className="h-8 w-8" />
            Users Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {users.filter((u) => u.status === "ACTIVE").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Suspended</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {users.filter((u) => u.status === "SUSPENDED").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {users.filter((u) => u.isVerified).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      {/* Filters */}
      <div className="mb-4">
        <UserTableFilters onChange={handleFilterChange} initial={filters} />
      </div>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of registered users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Optionally, show a subtle spinner or nothing during isPending/filtering */}
          {isPending && !initialLoading ? (
            <div className="flex justify-center py-8"><span className="text-slate-400">Loading...</span></div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleSelect(user._id, value)}
                        disabled={actionLoading === user._id}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="USER">USER</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Role Change Confirmation Alert Dialog */}
                      {roleAlertOpen && (
                        <AlertDialog open={roleAlertOpen} onOpenChange={setRoleAlertOpen}>
                          <AlertDialogPortal>
                            <AlertDialogOverlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/10" />
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to change this role to <b>{pendingRoleChange?.newRole}</b>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmRoleChange}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogPortal>
                        </AlertDialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "ACTIVE" ? "default" : "destructive"
                        }
                        className={
                          user.status === "ACTIVE"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <Badge className="bg-blue-600">Verified</Badge>
                      ) : (
                        <Badge variant="outline">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <Link href={`/admin/dashboard/users-management/${user._id}`}>
                            <Eye className="h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <Link href={`/admin/dashboard/users-management/${user._id}/edit`}>
                            <Edit className="h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                        {user.status === "ACTIVE" ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            disabled={actionLoading === user._id}
                          >
                            <Ban className="h-3 w-3" />
                            {actionLoading === user._id ? "..." : "Suspend"}
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 gap-1"
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            disabled={actionLoading === user._id}
                          >
                            <CheckCircle className="h-3 w-3" />
                            {actionLoading === user._id ? "..." : "Activate"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No users found</p>
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

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.status === "ACTIVE" ? "suspend" : "activate"} this user?
              {selectedUser?.status === "ACTIVE" 
                ? " This will prevent them from accessing their account." 
                : " This will restore their account access."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusToggle}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function UsersManagementPage() {
  return <UsersManagementContent />;
}
