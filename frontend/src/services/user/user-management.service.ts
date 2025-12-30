/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

// Get all users with pagination and filters
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.startDate) {
    const dateOnly = params.startDate.split('T')[0];
    queryParams.append("startDate", dateOnly);
  }
  if (params?.endDate) {
    const dateOnly = params.endDate.split('T')[0];
    queryParams.append("endDate", dateOnly);
  }
  if (params?.sort) queryParams.append("sort", params.sort);

  const url = `/user/all-users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await serverFetch.get(url, {
    next: { tags: ["users"], revalidate: 0 }, 
  });
  return await response.json();
};

// Get single user by ID
export const getSingleUser = async (userId: string) => {
  const response = await serverFetch.get(`/user/${userId}`, {
    next: { tags: ["users"], revalidate: 60 },
  });
  return await response.json();
};

// Update user (role, status, etc.)
export const updateUser = async (userId: string, data: Record<string, any>) => {
  const response = await serverFetch.patch(`/user/${userId}`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
