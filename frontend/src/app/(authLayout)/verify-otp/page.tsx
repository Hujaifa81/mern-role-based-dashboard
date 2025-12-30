import { Suspense } from "react";
import OTPVerificationForm from "@/components/otp-verification-form";

const OTPVerificationPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-gray-500">
            Enter the verification code sent to your email
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <OTPVerificationForm />
        </Suspense>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
