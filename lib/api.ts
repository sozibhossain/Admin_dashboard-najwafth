import { apiClient } from "./axios-client";

export async function getAdminOverview() {
  const response = await apiClient.get("/dashboard/admin/overview");
  return response.data.data;
}

export async function loginAdmin(payload: { email: string; password: string }) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data.data;
}

export async function forgotPassword(email: string) {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data.data;
}

export async function verifyOtp(payload: { email: string; otp: string }) {
  const response = await apiClient.post("/auth/verify-otp", payload);
  return response.data.data;
}

export async function resetPassword(payload: {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await apiClient.post("/auth/reset-password", payload);
  return response.data.data;
}

export async function getShops(params: { page: number; limit: number; status?: string; search?: string }) {
  const response = await apiClient.get("/shop", { params });
  return response.data.data;
}

export async function getShopById(shopId: string) {
  const response = await apiClient.get(`/shop/${shopId}`);
  return response.data.data;
}

export async function updateShopStatus(shopId: string, status: "verified" | "not verified") {
  const response = await apiClient.patch(`/shop/${shopId}/status`, { status });
  return response.data.data;
}

export async function getOrders(params: { page: number; limit: number; status?: string }) {
  const response = await apiClient.get("/order", { params });
  const orders = response.data.data || [];
  return {
    orders,
    pagination: {
      total: orders.length < params.limit && params.page === 1 ? orders.length : params.page * params.limit + (orders.length === params.limit ? 1 : 0),
      page: params.page,
      limit: params.limit,
      totalPages: orders.length === params.limit ? params.page + 1 : params.page,
    },
  };
}

export async function updateOrderStatus(orderId: string, payload: { status: string; trackingNumber?: string }) {
  const response = await apiClient.patch(`/order/${orderId}/status`, payload);
  return response.data.data;
}

export async function getDriverRequests(params: { page: number; limit: number }) {
  const response = await apiClient.get("/driver-request/driver-requests", { params });
  return response.data.data;
}

export async function updateDriverRequestStatus(id: string, status: string) {
  const response = await apiClient.patch(`/driver-request/driver-requests/${id}/update-status`, { status });
  return response.data.data;
}

export async function assignDriverToRequest(id: string, driverId: string) {
  const response = await apiClient.patch(`/driver-request/driver-requests/${id}/assign-driver`, { driverId });
  return response.data.data;
}

export async function getDriverRequestsByDriver(driverId: string) {
  const response = await apiClient.get(`/driver-request/driver-requests/driver/${driverId}`);
  return response.data.data;
}

export async function getProfile() {
  const response = await apiClient.get("/user/me");
  return response.data.data;
}

export async function updateProfile(formData: FormData) {
  const response = await apiClient.patch("/user/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await apiClient.patch("/user/change-password", payload);
  return response.data.data;
}
