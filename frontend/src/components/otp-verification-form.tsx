"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOTP, sendOTP } from "@/services/otp/otp.service";
import {
  otpVerificationZodSchema,
  type OTPVerificationFormData,
} from "@/zod/auth.validation";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail } from "lucide-react";

const OTPVerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";

  const [state, formAction, isPending] = useActionState(verifyOTP, null);
  const [resendState, resendAction, isResending] = useActionState(sendOTP, null);
  const [, startTransition] = useTransition();
  const [countdown, setCountdown] = useState(0);
  const prevResendState = useRef(resendState);

  const form = useForm<OTPVerificationFormData>({
    resolver: zodResolver(otpVerificationZodSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  useEffect(() => {
    if (state && !state.success) {
      if (state.errors) {
        state.errors.forEach((error: { field: string; message: string }) => {
          form.setError(error.field as keyof OTPVerificationFormData, {
            message: error.message,
          });
        });
      } else if (state.message) {
        toast.error(state.message);
      }
    }

    if (state && state.success) {
      console.log("✅ OTP Verified Successfully, redirecting to login...");
      toast.success(state.message);
      setTimeout(() => {
        console.log("Redirecting now...");
        router.push("/login");
        router.refresh();
      }, 1500);
    }
  }, [state, form, router]);

  useEffect(() => {
    // Only process if resendState has actually changed
    if (prevResendState.current !== resendState) {
      prevResendState.current = resendState;

      if (resendState && !resendState.success && resendState.message) {
        toast.error(resendState.message);
      }

      if (resendState && resendState.success) {
        toast.success(resendState.message);
      }
    }
  }, [resendState]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPVerificationFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("otp", data.otp);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleResendOTP = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    startTransition(() => {
      resendAction(formData);
    });
    // Set countdown immediately when button is clicked
    setCountdown(60);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          We have sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" value={email} {...form.register("email")} />

        {/* OTP Input */}
        <div className="space-y-2">
          <Label htmlFor="otp">
            Verification Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...form.register("otp")}
            className={form.formState.errors.otp ? "border-red-500 text-center text-2xl tracking-widest" : "text-center text-2xl tracking-widest"}
          />
          {form.formState.errors.otp && (
            <p className="text-sm text-red-500">
              {form.formState.errors.otp.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Did not receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </p>
        </div>

        <div className="text-center text-sm">
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default OTPVerificationForm;
