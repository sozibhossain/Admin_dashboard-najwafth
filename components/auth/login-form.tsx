"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("Unable to sign in as admin.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("admin-email", email);
    } else {
      localStorage.removeItem("admin-email");
    }

    toast.success("Signed in successfully.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-3 block text-[16px] font-semibold text-[#202124]">User Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#919191]" />
            <Input
              className="h-[50px] rounded-[10px] border-[#cfd4dc] bg-white pl-11 text-[16px]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your Email"
              type="email"
              value={email}
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-[16px] font-semibold text-[#202124]">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#919191]" />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b4b4b4]"
              onClick={() => setShowPassword((prev) => !prev)}
              type="button"
            >
              {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
            </button>
            <Input
              className="h-[50px] rounded-[10px] border-[#cfd4dc] bg-white pl-11 pr-11 text-[16px]"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your Password"
              type={showPassword ? "text" : "password"}
              value={password}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-[16px]">
          <label className="flex items-center gap-2 text-[#7f7f7f]">
            <input checked={rememberMe} className="size-4" onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
            Remember me
          </label>
          <Link className="font-medium text-[#0f6acc]" href="/auth/forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button className="h-[50px] w-full rounded-[10px] bg-[#6d98c0] text-[18px] hover:bg-[#5f88ae]" disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
