"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully.");
      router.push("/auth/signin");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      email: sessionStorage.getItem("reset-email") || "",
      resetToken: sessionStorage.getItem("reset-token") || "",
      newPassword: String(formData.get("newPassword") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    });
  }

  return (
    <AuthShell title="Reset New password" subtitle="Enter your new password and confirm password">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-3 block text-[16px] font-semibold text-[#202124]">New Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#919191]" />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b4b4b4]"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
              type="button"
            >
              {showPasswords.newPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
            <Input
              className="h-[50px] rounded-[10px] border-[#cfd4dc] pl-11 pr-11"
              name="newPassword"
              placeholder="Enter your Password"
              type={showPasswords.newPassword ? "text" : "password"}
            />
          </div>
        </div>
        <div>
          <label className="mb-3 block text-[16px] font-semibold text-[#202124]">Confirm Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#919191]" />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b4b4b4]"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
              type="button"
            >
              {showPasswords.confirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
            <Input
              className="h-[50px] rounded-[10px] border-[#cfd4dc] pl-11 pr-11"
              name="confirmPassword"
              placeholder="Enter Confirm Password"
              type={showPasswords.confirmPassword ? "text" : "password"}
            />
          </div>
        </div>
        <Button className="h-[50px] w-full rounded-[10px] bg-[#6d98c0] text-[18px] hover:bg-[#5f88ae]" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Updating..." : "Continue"}
        </Button>
      </form>
    </AuthShell>
  );
}
