"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IActivityLogResponse } from "@/types/activity.interface";

export const getMyActivityLogs = async (
  limit: number = 10
): Promise<IActivityLogResponse> => {
  try {
    const response = await serverFetch.get(
      `/activity-logs/my-activity?limit=${limit}&sort=-createdAt`,
      {
        next: { tags: ["my-activity-logs"], revalidate: 60 },
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return {
      success: false,
      message: "Failed to fetch activity logs",
      data: [],
    };
  }
};
