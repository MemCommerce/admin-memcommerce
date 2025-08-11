import type { Order, OrdersResponse } from "@/lib/types";
import { ORDERS_URL } from "@/lib/urls";

export const getOrders = async (page: number = 1, limit: number = 10, status?: string): Promise<OrdersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.append("status", status);
  }

  const url = `${ORDERS_URL}?${params.toString()}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error("Failed to fetch orders");
  }

  console.log(resp, "fromr");

  return await resp.json();
};

export const markOrderAsDelivered = async (orderId: string): Promise<Order> => {
  const resp = await fetch(`${ORDERS_URL}${orderId}/delivered`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to mark order ${orderId} as delivered`);
  }

  return await resp.json();
};
