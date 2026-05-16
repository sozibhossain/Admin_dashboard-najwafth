"use client";

import Image from "next/image";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  Settings,
  Store,
  Truck,
  UserRoundCog,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shops", label: "Books store Management", icon: Store },
  { href: "/categories", label: "Categories", icon: LibraryBig },
  { href: "/driver-requests", label: "Driver Requests", icon: Truck },
  { href: "/drivers", label: "Driver Management", icon: UserRoundCog },
  { href: "/profit-overview", label: "Profit Overview", icon: ChartNoAxesCombined },
  { href: "/settings", label: "Settings", icon: Settings },
];

function matchRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#fcf1e2] px-6 py-8">
      <div className="flex flex-col items-center">
        <Image src="/assets/brand-mark.png" alt="Books on wheels" width={160} height={120} className="h-auto w-[150px]" />
      </div>
      <nav className="mt-12 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = matchRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-4 py-4 text-[16px] font-medium transition",
                isActive
                  ? "bg-[#6d98c0] text-white [&_svg]:text-white"
                  : "text-[#252525] hover:bg-white/60",
              )}
              onClick={onClose}
            >
              <Icon className="size-5" />
              <span className={isActive ? "text-white" : "text-[#252525]"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/logout"
        className={cn(
          "mt-6 flex items-center gap-3 rounded-[10px] px-4 py-4 text-[16px] font-medium transition",
          matchRoute(pathname, "/logout")
            ? "bg-[#6d98c0] text-white [&_svg]:text-white"
            : "text-[#252525] hover:bg-white/60",
        )}
        onClick={onClose}
      >
        <LogOut className="size-5" />
        <span className={matchRoute(pathname, "/logout") ? "text-white" : "text-[#252525]"}>
          Log Out
        </span>
      </Link>
    </div>
  );
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-40 rounded-[10px] bg-[#6d98c0] p-3 text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Menu className="size-5" />
      </button>
      <aside className="sticky top-0 hidden h-screen w-[312px] shrink-0 overflow-y-auto lg:block">
        <SidebarContent />
      </aside>
      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="relative h-full w-[300px]">
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-[#252525]"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onClose={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
