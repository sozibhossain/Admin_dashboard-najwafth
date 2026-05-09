"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AdminBackHeader,
  AdminMetricCard,
  AdminSectionCard,
  AssignDriverModal,
  RequestCard,
  SegmentedTabs,
} from "@/components/admin/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOverview, getDriverRequests, getShopById } from "@/lib/api";

type ShopData = {
  _id: string;
  name?: string;
  address?: string;
  owner?: {
    _id?: string;
    phone?: string;
  };
};

type DriverRequestRow = {
  _id: string;
  shopName?: string;
  phone?: string;
  customerName?: string;
  location?: string;
  item?: string;
  orderDate?: string;
  createdAt?: string;
  totalAmount?: number;
  price?: number;
  status?: string;
  orderId?: {
    orderId?: string;
    _id?: string;
  };
};

type AdminOverview = {
  recentDrivers: {
    _id: string;
    name?: string;
    phone?: string;
  }[];
};

export default function ShopDetailsPage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState("all");
  const [openAssign, setOpenAssign] = useState(false);

  const shopQuery = useQuery({
    queryKey: ["admin-shop", params.id],
    queryFn: () => getShopById(params.id),
    enabled: Boolean(params.id),
  });
  const requestsQuery = useQuery({
    queryKey: ["admin-driver-requests", "shop-detail"],
    queryFn: () => getDriverRequests({ page: 1, limit: 100 }),
  });
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  const shop = shopQuery.data as ShopData | undefined;
  const requestsData = (requestsQuery.data as { requests: DriverRequestRow[] } | undefined)?.requests;
  const requests = requestsData || [];
  const overview = overviewQuery.data as AdminOverview | undefined;

  const filteredRequests = (() => {
    const scoped = requests.filter((request) => {
      if (!shop) {
        return true;
      }

      return request.shopName === shop.name;
    });

    if (tab === "all") {
      return scoped;
    }

    return scoped.filter((request) => (request.status || "pending").toLowerCase() === tab);
  })();

  if (shopQuery.isLoading) {
    return (
      <section className="bg-white px-6 py-7 md:px-8">
        <Skeleton className="h-[52px] w-[320px] rounded-[12px]" />
        <Skeleton className="mt-6 h-[586px] rounded-[20px]" />
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-7 md:px-8">
      <AdminBackHeader href="/shops" title="Books store" subtitle="See Books store Management" />

      <AdminSectionCard className="overflow-hidden p-3">
        <div className="h-[390px] rounded-[18px] bg-[linear-gradient(135deg,#c99d6d_0%,#f0e6d7_42%,#856342_100%)]" />
        <div className="px-4 pb-3 pt-4">
          <h2 className="text-[28px] font-semibold text-[#202124]">{shop?.name || "ABC Book House"}</h2>
          <div className="mt-2 space-y-2 text-[14px] text-[#6b7280]">
            <p>{shop?.address || "23 Mirpur Road, Dhaka 1216"}</p>
            <p>{shop?.owner?.phone || "+880 1812-111222"}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminMetricCard label="Total Orders" value={145} accent="blue" note="" />
            <AdminMetricCard
              label="Pending"
              value={requests.filter((request) => request.status === "pending").length}
              accent="cream"
              note=""
            />
          </div>
        </div>
      </AdminSectionCard>

      <div className="mt-8">
        <h3 className="text-[24px] font-semibold text-[#202124]">Orders from this Store</h3>
        <p className="mt-1 text-[16px] text-[#777]">See Orders from this Store</p>
      </div>

      <div className="mt-4">
        <SegmentedTabs
          items={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "accepted" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6 space-y-5">
        {filteredRequests.map((request) => (
          <RequestCard
            key={request._id}
            request={{
              ...request,
              orderId: request.orderId?.orderId || request.orderId?._id || request._id,
            }}
            actionLabel="Assign Driver"
            onAction={() => setOpenAssign(true)}
          />
        ))}
      </div>

      <AssignDriverModal
        open={openAssign}
        title="Assign Driver to Order #OI027"
        drivers={
          (overview?.recentDrivers || []).map((driver, index) => ({
            ...driver,
            status: index % 3 === 1 ? "busy" : "available",
            currentOrders: index % 3 === 1 ? 2 : 0,
          })) || []
        }
        onClose={() => setOpenAssign(false)}
      />
    </section>
  );
}
