"use server";

import { serverFetch } from "@/lib/server-fetch";

// Get all activity logs (admin)
export const getAllActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
  if (params?.activityType) queryParams.append("activityType", params.activityType);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.sort) queryParams.append("sort", params.sort);

  const url = `/activity-logs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await serverFetch.get(url, {
    next: { tags: ["activity-logs"], revalidate: 30 },
  });
  return await response.json();
};

// Get recent activity logs
export const getRecentActivityLogs = async (limit: number = 10) => {
  const response = await serverFetch.get(`/activity-logs/recent?limit=${limit}`, {
    next: { tags: ["activity-logs"], revalidate: 30 },
  });
  return await response.json();
};

// Get activity logs by type
export const getActivityLogsByType = async (type: string) => {
  const response = await serverFetch.get(`/activity-logs/type/${type}`, {
    next: { tags: ["activity-logs"], revalidate: 30 },
  });
  return await response.json();
};

// Get user activity logs (admin viewing specific user)
export const getUserActivityLogs = async (userId: string) => {
  const response = await serverFetch.get(`/activity-logs/user/${userId}`, {
    next: { tags: ["activity-logs"], revalidate: 30 },
  });
  return await response.json();
};

// Delete old activity logs
export const deleteOldActivityLogs = async (days: number = 90) => {
  const response = await serverFetch.delete(`/activity-logs/cleanup?days=${days}`);
  return await response.json();
};
