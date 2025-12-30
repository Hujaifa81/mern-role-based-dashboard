/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getRegistrationTrends } from "@/services/analytics/analytics.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, TrendingUp, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface RegistrationTrend {
  date: string;
  count: number;
}

function RegistrationTrendsContent() {
  const [trends, setTrends] = useState<RegistrationTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegistrationTrends(30);
        setTrends(response?.data || []);
      } catch (error) {
        console.error("Failed to load trends:", error);
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
          <Skeleton className="h-64 w-full" />
        </div>
      );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-12">
        <LineChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No registration data available</p>
      </div>
    );
  }

  // Calculate statistics
  const totalRegistrations = trends.reduce((sum, item) => sum + item.count, 0);
  const averagePerDay = Math.round(totalRegistrations / trends.length);
  const maxDay = trends.reduce((max, item) => (item.count > max.count ? item : max), trends[0]);
  const recentDays = trends.slice(-7);
  const recentTotal = recentDays.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <LineChart className="h-8 w-8" />
          Registration Trends
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          User registration patterns over the last 30 days
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total (30 Days)
            </CardDescription>
            <CardTitle className="text-3xl">{totalRegistrations}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">All registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Daily Average
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {averagePerDay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              Last 7 Days
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {recentTotal}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-600">Recent activity</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Peak Day
            </CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {maxDay.count}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              {format(new Date(maxDay.date), "MMM dd")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Timeline - Line Chart</CardTitle>
          <CardDescription>Daily user registrations for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date: any) => format(new Date(date), "MMM dd, yyyy")}
                formatter={(value: any) => [`${value} users`, "Registrations"]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Registrations"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Timeline - Area Chart</CardTitle>
          <CardDescription>Visual representation of registration patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date: any) => format(new Date(date), "MMM dd, yyyy")}
                formatter={(value: any) => [`${value} users`, "Registrations"]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                name="Registrations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Timeline - Bar View</CardTitle>
          <CardDescription>Daily user registrations with color-coded recent activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trends.map((item, index) => {
              const percentage = totalRegistrations > 0 
                ? (item.count / Math.max(...trends.map(t => t.count))) * 100 
                : 0;
              const isRecent = index >= trends.length - 7;
              
              return (
                <div key={item.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${isRecent ? "text-green-600" : "text-slate-700 dark:text-slate-300"}`}>
                      {format(new Date(item.date), "MMM dd, yyyy")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.count} users</span>
                      {isRecent && <Badge variant="outline" className="text-xs border-green-600 text-green-600">Recent</Badge>}
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isRecent ? "bg-green-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Registration Days</CardTitle>
            <CardDescription>Days with highest user signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trends
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={item.date}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-lg font-bold">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">
                        {format(new Date(item.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {item.count}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Trend Analysis</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Total Registrations
                </p>
                <p className="text-4xl font-bold text-blue-600">{recentTotal}</p>
                <p className="text-xs text-slate-500 mt-1">In the last 7 days</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Daily Average (Recent)
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {Math.round(recentTotal / 7)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Avg per day (last 7 days)</p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Trend Comparison
                </p>
                <p className="text-4xl font-bold text-purple-600">
                  {recentTotal >= averagePerDay * 7 ? "📈" : "📉"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {recentTotal >= averagePerDay * 7
                    ? "Above average trend"
                    : "Below average trend"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegistrationTrendsPage() {
  return <RegistrationTrendsContent />;
}
