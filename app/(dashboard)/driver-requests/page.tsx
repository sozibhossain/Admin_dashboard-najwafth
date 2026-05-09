"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AdminMetricCard,
  AdminPageFrame,
  AssignDriverModal,
  RequestCard,
  SegmentedTabs,
} from "@/components/admin/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOverview, getDriverRequests } from "@/lib/api";

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

type DriverRequestsResponse = {
  total: number;
  requests: DriverRequestRow[];
};

type AdminOverview = {
  recentDrivers: {
    _id: string;
    name?: string;
    phone?: string;
  }[];
};

export default function DriverRequestsPage() {
  const [tab, setTab] = useState("all");
  const [openAssign, setOpenAssign] = useState(false);

  const requestsQuery = useQuery({
    queryKey: ["admin-driver-requests", "screen"],
    queryFn: () => getDriverRequests({ page: 1, limit: 100 }),
  });
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  const requestsData = requestsQuery.data as DriverRequestsResponse | undefined;
  const overview = overviewQuery.data as AdminOverview | undefined;

  const filteredRequests = useMemo(() => {
    const rows = requestsData?.requests || [];
    if (tab === "all") {
      return rows;
    }

    if (tab === "completed") {
      return rows.filter((row) => row.status === "accepted");
    }

    return rows.filter((row) => row.status === tab);
  }, [requestsData?.requests, tab]);

  if (requestsQuery.isLoading) {
    return (
      <AdminPageFrame title="For Driver Requests" subtitle="See Orders from this Store">
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[108px] rounded-[14px]" />
          ))}
        </div>
        <Skeleton className="mt-6 h-[700px] rounded-[18px]" />
      </AdminPageFrame>
    );
  }

  const totalPending = (requestsData?.requests || []).filter((row) => row.status === "pending").length;
  const totalCompleted = (requestsData?.requests || []).filter((row) => row.status === "accepted").length;

  return (
    <AdminPageFrame title="For Driver Requests" subtitle="See Orders from this Store">
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminMetricCard label="Total Driver Request" value={requestsData?.total || filteredRequests.length} accent="blue" />
        <AdminMetricCard label="Total Pending" value={totalPending} accent="amber" />
        <AdminMetricCard label="Total Completed" value={totalCompleted} accent="green" />
      </div>

      <div className="mt-8">
        <SegmentedTabs
          items={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
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
            status: index % 2 === 0 ? "available" : "busy",
            currentOrders: index % 2 === 0 ? 0 : 2,
          })) || []
        }
        onClose={() => setOpenAssign(false)}
      />
    </AdminPageFrame>
  );
}
