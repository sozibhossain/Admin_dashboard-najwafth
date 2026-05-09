"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminMetricCard, AdminPageFrame, ShopCard } from "@/components/admin/primitives";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOverview, getDriverRequests, getShops } from "@/lib/api";

type ShopRow = {
  _id: string;
  name?: string;
  address?: string;
  shopStatus?: string;
  owner?: {
    name?: string;
    phone?: string;
  };
};

type ShopsResponse = {
  shops: ShopRow[];
  pagination: {
    page: number;
    totalPages: number;
  };
};

type DriverRequestsResponse = {
  requests: {
    _id: string;
    shopName?: string;
    status?: string;
  }[];
};

type AdminOverview = {
  metrics: {
    totalBookstores: number;
    totalDriverRequests: number;
    totalCompleted: number;
  };
};

function ShopsLoading() {
  return (
    <AdminPageFrame title="Books store Management" subtitle="See Books store Management">
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[120px] rounded-[14px]" />
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[420px] rounded-[20px]" />
        ))}
      </div>
    </AdminPageFrame>
  );
}

export default function AdminShopsPage() {
  const [page, setPage] = useState(1);
  const shopsQuery = useQuery({
    queryKey: ["admin-shops-grid", page],
    queryFn: () => getShops({ page, limit: 8 }),
  });
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });
  const requestsQuery = useQuery({
    queryKey: ["admin-driver-requests", 1, "shops"],
    queryFn: () => getDriverRequests({ page: 1, limit: 100 }),
  });

  const shops = shopsQuery.data as ShopsResponse | undefined;
  const overview = overviewQuery.data as AdminOverview | undefined;
  const requests = requestsQuery.data as DriverRequestsResponse | undefined;

  const cards = useMemo(
    () =>
      (shops?.shops || []).map((shop) => {
        const pending = (requests?.requests || []).filter(
          (request) => request.status === "pending" && request.shopName === shop.name,
        ).length;

        return {
          id: shop._id,
          title: shop.name || "ABC Book House",
          address: shop.address || "23 Mirpur Road, Dhaka 1216",
          phone: shop.owner?.phone || "+880 1812-111222",
          totalOrders: 145,
          pending,
        };
      }),
    [requests?.requests, shops?.shops],
  );

  if (shopsQuery.isLoading) {
    return <ShopsLoading />;
  }

  return (
    <AdminPageFrame title="Books store Management" subtitle="See Books store Management">
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminMetricCard label="Total Bookstores" value={overview?.metrics.totalBookstores || 0} accent="blue" />
        <AdminMetricCard label="Total Driver Request" value={overview?.metrics.totalDriverRequests || 0} accent="amber" />
        <AdminMetricCard label="Total Completed" value={overview?.metrics.totalCompleted || 0} accent="green" />
      </div>

      <div className="mt-8">
        <h2 className="text-[32px] font-semibold text-[#202124]">Books store</h2>
        <p className="mt-2 text-[16px] text-[#666]">Total Books store</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((shop) => (
          <ShopCard key={shop.id} {...shop} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination page={shops?.pagination.page || page} totalPages={shops?.pagination.totalPages || 1} onPageChange={setPage} />
      </div>
    </AdminPageFrame>
  );
}
