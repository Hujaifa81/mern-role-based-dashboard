"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/services/auth/changePassword";
import {
  changePasswordValidationZodSchema,
  type ChangePasswordFormData,
} from "@/zod/auth.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(changePassword, null);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordValidationZodSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (state && !state.success) {
      if (state.errors) {
        // Handle field-specific errors from server
        state.errors.forEach((error: { field: string; message: string }) => {
          form.setError(error.field as keyof ChangePasswordFormData, {
            message: error.message,
          });
        });
      } else if (state.message) {
        toast.error(state.message);
      }
    }

    if (state && state.success) {
      toast.success(state.message);
      form.reset();
      // Optionally redirect to profile or dashboard
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    }
  }, [state, form, router]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmPassword", data.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Old Password */}
      <div className="space-y-2">
        <Label htmlFor="oldPassword">
          Current Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="oldPassword"
            type={showPasswords.old ? "text" : "password"}
            placeholder="Enter your current password"
            {...form.register("oldPassword")}
            className={form.formState.errors.oldPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("old")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showPasswords.old ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.oldPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.oldPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">
          New Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            placeholder="Enter your new password"
            {...form.register("newPassword")}
            className={form.formState.errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showPasswords.new ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm New Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            placeholder="Confirm your new password"
            {...form.register("confirmPassword")}
            className={
              form.formState.errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
            }
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showPasswords.confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="min-w-[140px]">
          {isPending ? "Updating..." : "Update Password"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
