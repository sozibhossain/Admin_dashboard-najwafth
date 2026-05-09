"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { forgotPassword, verifyOtp } from "@/lib/api";

export default function EnterOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const email = useMemo(() => (typeof window !== "undefined" ? sessionStorage.getItem("reset-email") || "" : ""), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : current));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      sessionStorage.setItem("reset-token", data.resetToken);
      toast.success("OTP verified successfully.");
      router.push("/auth/reset-password");
    },
  });

  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setSeconds(45);
      toast.success("OTP resent successfully.");
    },
  });

  function updateDigit(index: number, value: string) {
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verifyMutation.mutate({
      email,
      otp: digits.join(""),
    });
  }

  return (
    <AuthShell title="Enter OTP">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-4">
          {digits.map((digit, index) => (
            <input
              key={index}
              className="h-[72px] w-[72px] rounded-[10px] border border-[#8c8c8c] bg-transparent text-center text-[28px] font-semibold text-[#334155] outline-none"
              inputMode="numeric"
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              value={digit}
            />
          ))}
        </div>

        <p className="text-center text-[16px] text-[#8a8a8a]">Resend code in {seconds}s</p>
        <p className="text-center text-[16px] text-[#202124]">
          Didn&apos;t Receive OTP?{" "}
          <button className="font-medium text-[#234b2d]" disabled={resendMutation.isPending || !email} onClick={() => resendMutation.mutate(email)} type="button">
            RESEND OTP
          </button>
        </p>

        <Button className="h-[50px] w-full rounded-[10px] bg-[#6d98c0] text-[18px] hover:bg-[#5f88ae]" disabled={verifyMutation.isPending} type="submit">
          {verifyMutation.isPending ? "Verifying..." : "Verify Now"}
        </Button>
      </form>
    </AuthShell>
  );
}
