import type { Order } from "@/lib/types";
import { ORDERS_URL } from "@/lib/urls";


export const getOrders = async (): Promise<Order[]> => {
  const resp = await fetch(ORDERS_URL);

  if (!resp.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data: Order[] = await resp.json();
  return data;
};