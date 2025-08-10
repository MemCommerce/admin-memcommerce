import type { Order, OrdersResponse } from "@/lib/types";
import { ORDERS_URL } from "@/lib/urls";


export const getOrders = async (): Promise<Order[]> => {
  const resp = await fetch(ORDERS_URL);

  if (!resp.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data: OrdersResponse = await resp.json();
  return data.items; 
};

export const markOrderAsDelivered = async (orderId: string): Promise<Order> => {
  const resp = await fetch(`${ORDERS_URL}/${orderId}/delivered`, {
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