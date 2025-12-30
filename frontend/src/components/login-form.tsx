"use client";
import { loginUser } from "@/services/auth/loginUser";
import {
  loginValidationZodSchema,
  type LoginFormData,
} from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state) {
      if (state.success) {
        // Show backend success message as toast
        if (state.message) {
          toast.success(state.message);
        }
      } else {
        if (state.errors) {
          // Handle field-specific errors from server
          state.errors.forEach((error: { field: string; message: string }) => {
            form.setError(error.field as keyof LoginFormData, {
              message: error.message,
            });
          });
        } else if (state.message) {
          toast.error(state.message);
        }
      }
    }
  }, [state, form]);

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (redirect) {
      formData.append("redirect", redirect);
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>

        <div className="text-center text-sm">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/*
        <div className="text-center mt-4">
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/google${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.45 2.7 30.65 0 24 0 14.64 0 6.27 5.7 2.13 14.02l7.98 6.21C12.18 13.16 17.62 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.56-.14-3.07-.41-4.53H24v9.08h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.19 5.59C43.73 37.3 46.1 31.37 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.11 28.23c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.21C.41 15.47 0 19.91 0 24.5c0 4.59.41 9.03 2.13 13.11l7.98-6.21z"/>
                <path fill="#EA4335" d="M24 48c6.65 0 12.45-2.2 16.94-6.01l-7.19-5.59c-2.01 1.35-4.59 2.13-7.75 2.13-6.38 0-11.82-3.66-13.89-8.73l-7.98 6.21C6.27 42.3 14.64 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Sign in with Google
          </a>
        </div>
        */}
      </form>
    </Form>
  );
};

export default LoginForm;