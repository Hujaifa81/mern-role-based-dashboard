"use server";

import { serverFetch } from "@/lib/server-fetch";

// Get dashboard overview (all analytics in one call)
export const getDashboardOverview = async () => {
  const response = await serverFetch.get("/analytics/dashboard-overview", {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get user statistics
export const getUserStats = async () => {
  const response = await serverFetch.get("/analytics/user-stats", {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get role distribution
export const getRoleDistribution = async () => {
  const response = await serverFetch.get("/analytics/role-distribution", {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get registration trends (last N days)
export const getRegistrationTrends = async (days: number = 30) => {
  const response = await serverFetch.get(`/analytics/registration-trends?days=${days}`, {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get new users this month
export const getNewUsersThisMonth = async () => {
  const response = await serverFetch.get("/analytics/new-users-month", {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get status distribution
export const getStatusDistribution = async () => {
  const response = await serverFetch.get("/analytics/status-distribution", {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};

// Get recent users
export const getRecentUsers = async (limit: number = 5) => {
  const response = await serverFetch.get(`/analytics/recent-users?limit=${limit}`, {
    next: { tags: ["analytics"], revalidate: 60 },
  });
  return await response.json();
};
