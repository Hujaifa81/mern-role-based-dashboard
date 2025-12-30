/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getUserStats, getRoleDistribution, getStatusDistribution } from "@/services/analytics/analytics.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

const COLORS = {
  ADMIN: "#8b5cf6",
  USER: "#3b82f6",
  ACTIVE: "#10b981",
  SUSPENDED: "#ef4444",
};

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

interface RoleDistribution {
  role: string;
  count: number;
}

interface StatusDistribution {
  status: string;
  count: number;
}

function UserStatisticsContent() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, roleResponse, statusResponse] = await Promise.all([
          getUserStats(),
          getRoleDistribution(),
          getStatusDistribution(),
        ]);
        
        setUserStats(statsResponse?.data);
        setRoleDistribution(roleResponse?.data || []);
        setStatusDistribution(statusResponse?.data || []);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <TrendingUp className="h-8 w-8" />
          User Statistics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Detailed metrics and insights about your users
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardDescription>
            <CardTitle className="text-4xl">{userStats.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">All registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Active
            </CardDescription>
            <CardTitle className="text-4xl text-green-600">
              {userStats.activeUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-600">
              {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Suspended
            </CardDescription>
            <CardTitle className="text-4xl text-red-600">
              {userStats.suspendedUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">
              {Math.round((userStats.suspendedUsers / userStats.totalUsers) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Verified
            </CardDescription>
            <CardTitle className="text-4xl text-blue-600">
              {userStats.verifiedUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-600">
              {Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-orange-600" />
              Unverified
            </CardDescription>
            <CardTitle className="text-4xl text-orange-600">
              {userStats.unverifiedUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="border-orange-600 text-orange-600">
              {Math.round((userStats.unverifiedUsers / userStats.totalUsers) * 100)}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Role Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Distribution
            </CardTitle>
            <CardDescription>Users categorized by their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.role}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="role"
                >
                  {roleDistribution.map((entry) => (
                    <Cell key={`cell-${entry.role}`} fill={COLORS[entry.role as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-3">
              {roleDistribution.map((item) => {
                const percentage = Math.round((item.count / userStats.totalUsers) * 100);
                const Icon = item.role === "ADMIN" ? Shield : User;
                
                return (
                  <div key={item.role} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.role === "ADMIN" ? "text-purple-600" : "text-blue-600"}`} />
                      <span className="font-semibold">{item.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{item.count}</span>
                      <Badge variant={item.role === "ADMIN" ? "default" : "secondary"}>
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>Users by account status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {statusDistribution.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-3">
              {statusDistribution.map((item) => {
                const percentage = Math.round((item.count / userStats.totalUsers) * 100);
                const Icon = item.status === "ACTIVE" ? CheckCircle : XCircle;
                const isActive = item.status === "ACTIVE";
                
                return (
                  <div key={item.status} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-600" : "text-red-600"}`} />
                      <span className="font-semibold">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{item.count}</span>
                      <Badge
                        variant={isActive ? "default" : "destructive"}
                        className={isActive ? "bg-green-600" : "bg-red-600"}
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Role Distribution - Remove */}
      <div className="grid gap-6 md:grid-cols-2" style={{ display: 'none' }}>
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Distribution
            </CardTitle>
            <CardDescription>Users categorized by their roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {roleDistribution.map((item) => {
              const percentage = Math.round((item.count / userStats.totalUsers) * 100);
              const Icon = item.role === "ADMIN" ? Shield : User;
              
              return (
                <div key={item.role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.role === "ADMIN" ? "text-purple-600" : "text-blue-600"}`} />
                      <span className="font-semibold text-lg">{item.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{item.count}</span>
                      <Badge variant={item.role === "ADMIN" ? "default" : "secondary"}>
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.role === "ADMIN"
                          ? "bg-purple-600"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>Users by account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {statusDistribution.map((item) => {
              const percentage = Math.round((item.count / userStats.totalUsers) * 100);
              const Icon = item.status === "ACTIVE" ? CheckCircle : XCircle;
              const isActive = item.status === "ACTIVE";
              
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-600" : "text-red-600"}`} />
                      <span className="font-semibold text-lg">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{item.count}</span>
                      <Badge
                        variant={isActive ? "default" : "destructive"}
                        className={isActive ? "bg-green-600" : "bg-red-600"}
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Verification Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Email Verification Breakdown</CardTitle>
          <CardDescription>Detailed view of email verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Verified Accounts</p>
                    <p className="text-3xl font-bold text-blue-600">{userStats.verifiedUsers}</p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-lg px-4 py-2">
                  {Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100)}%
                </Badge>
              </div>
              <p className="text-sm text-slate-500 px-4">
                Users who have verified their email addresses and have full account access
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserX className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Unverified Accounts</p>
                    <p className="text-3xl font-bold text-orange-600">{userStats.unverifiedUsers}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-600 text-orange-600 text-lg px-4 py-2">
                  {Math.round((userStats.unverifiedUsers / userStats.totalUsers) * 100)}%
                </Badge>
              </div>
              <p className="text-sm text-slate-500 px-4">
                Users pending email verification - may have limited account features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserStatisticsPage() {
  return <UserStatisticsContent />;
}
