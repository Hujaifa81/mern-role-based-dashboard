/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, startTransition, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/services/user/user.service";
import {
  updateProfileValidationZodSchema,
  type UpdateProfileFormData,
} from "@/zod/user.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileFormProps {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_currentState: any, formData: any) => updateUserProfile(_currentState, formData, user._id),
    null
  );

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileValidationZodSchema),
    defaultValues: {
      name: user.name,
    },
  });

  useEffect(() => {
    if (state && !state.success) {
      if (state.errors) {
        // Handle field-specific errors from server
        state.errors.forEach((error: { field: string; message: string }) => {
          form.setError(error.field as keyof UpdateProfileFormData, {
            message: error.message,
          });
        });
      } else if (state.message) {
        toast.error(state.message);
      }
    }

    if (state && state.success) {
      toast.success(state.message);
      router.push("/profile");
      router.refresh();
    }
  }, [state, form, router]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Email (Read Only) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-slate-50 dark:bg-slate-900/50"
        />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...form.register("name")}
          className={form.formState.errors.name ? "border-red-500" : ""}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="picture">Profile Image</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={e => {
            const fileList = e.target.files;
            if (fileList && fileList.length > 0) {
              setImagePreview(URL.createObjectURL(fileList[0]));
              // react-hook-form expects FileList for file[]
              form.setValue("picture", fileList as any);
            } else {
              setImagePreview(null);
              form.setValue("picture", undefined);
            }
          }}
        />
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? "Saving..." : "Save Changes"}
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
