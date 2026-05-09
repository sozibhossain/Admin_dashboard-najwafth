"use client";

import { Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_data, email) => {
      sessionStorage.setItem("reset-email", email);
      toast.success("OTP sent successfully.");
      router.push("/auth/enter-otp");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate(String(formData.get("email") || ""));
  }

  return (
    <AuthShell title="Reset password" subtitle="Enter your email to receive the OTP">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-3 block text-[16px] font-semibold text-[#202124]">Your Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#919191]" />
            <Input className="h-[50px] rounded-[10px] border-[#cfd4dc] pl-11" name="email" placeholder="Enter your Email" />
          </div>
        </div>
        <Button className="h-[50px] w-full rounded-[10px] bg-[#6d98c0] text-[18px] hover:bg-[#5f88ae]" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </AuthShell>
  );
}
