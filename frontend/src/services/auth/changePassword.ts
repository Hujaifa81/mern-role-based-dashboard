/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { changePasswordValidationZodSchema } from "@/zod/auth.validation";

export const changePassword = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const payload = {
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate payload
    if (zodValidator(payload, changePasswordValidationZodSchema).success === false) {
      return zodValidator(payload, changePasswordValidationZodSchema);
    }

    const validatedPayload = zodValidator(payload, changePasswordValidationZodSchema).data as {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    };

    
    const { confirmPassword, ...backendPayload } = validatedPayload;

  
    const res = await serverFetch.post("/auth/change-password", {
      body: JSON.stringify(backendPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to change password",
      };
    }

    return {
      success: true,
      message: "Password changed successfully!",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};
