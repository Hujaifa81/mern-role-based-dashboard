/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateProfileValidationZodSchema } from "@/zod/user.validation";
import { revalidatePath } from "next/cache";

export const updateUserProfile = async (
  _currentState: any,
  formData: any,
  userId: string
): Promise<any> => {
  try {
    // Call API using serverFetch (FormData for file upload)
    const res = await serverFetch.patch(`/user/${userId}`, {
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update profile",
      };
    }

    // Revalidate profile page
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};
