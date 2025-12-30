"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IActivityLogResponse } from "@/types/activity.interface";

export const getMyActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}): Promise<IActivityLogResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
  if (params?.activityType) queryParams.append("activityType", params.activityType);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.sort) queryParams.append("sort", params.sort);

  const url = `/activity-logs/my-activity${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await serverFetch.get(url, {
    next: { tags: ["my-activity-logs"], revalidate: 30 },
  });
  return await response.json();
};
