import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#fcf1e2]">
      <div className="mx-auto flex h-full max-w-[1920px] gap-0">
        <AdminSidebar />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          <div className="sticky top-0 z-30 bg-[#fcf1e2]">
            <AdminHeader />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
