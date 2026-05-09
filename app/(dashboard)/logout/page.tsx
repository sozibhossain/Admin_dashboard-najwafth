"use client";

import { Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { AdminPageFrame, AdminSectionCard } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  return (
    <AdminPageFrame title="Logout" subtitle="Logout of your account">
      <AdminSectionCard className="mx-auto mt-8 max-w-[930px] border-[#f1b7b7] px-8 py-16 text-center">
        <div className="mx-auto flex size-[100px] items-center justify-center rounded-[12px] bg-[#fde2e2] text-[#e53935]">
          <Shield className="size-12" />
        </div>
        <h2 className="mt-8 text-[32px] font-semibold text-[#111111]">Are you sure to log out?</h2>
        <p className="mt-3 text-[18px] text-[#222222]">You will need to log back in to access your dashboard.</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="h-[52px] min-w-[222px] rounded-[10px] border border-[#3d8ef5] bg-white text-[#4090f7] hover:bg-[#f4f9ff]">
            Cancel
          </Button>
          <Button
            className="h-[52px] min-w-[222px] rounded-[10px] bg-[#6d98c0] text-white hover:bg-[#5f88ae]"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            Logout
          </Button>
        </div>
      </AdminSectionCard>
    </AdminPageFrame>
  );
}
