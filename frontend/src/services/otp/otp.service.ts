/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { otpVerificationZodSchema } from "@/zod/auth.validation";

export const sendOTP = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const email = formData.get("email");
    const name = formData.get("name");

    const res = await serverFetch.post("/otp/send", {
      body: JSON.stringify({ email, name }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to send OTP",
      };
    }

    return {
      success: true,
      message: "OTP sent successfully to your email!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const verifyOTP = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const payload = {
      email: formData.get("email"),
      otp: formData.get("otp"),
    };

    // Validate payload
    if (zodValidator(payload, otpVerificationZodSchema).success === false) {
      return zodValidator(payload, otpVerificationZodSchema);
    }

    const validatedPayload = zodValidator(payload, otpVerificationZodSchema).data;

    const res = await serverFetch.post("/otp/verify", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to verify OTP",
      };
    }

    return {
      success: true,
      message: "Email verified successfully! You can now login.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};
