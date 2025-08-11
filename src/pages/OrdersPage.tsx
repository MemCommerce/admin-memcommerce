import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/types";
import { getOrders, markOrderAsDelivered } from "@/api/apiOrders";
import Loader from "@/components/common/Loader";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrders(page, limit, statusFilter);
        setOrders(data.items);
        setTotal(data.total);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [page, limit, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      const updatedOrder = await markOrderAsDelivered(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      {/*filter */}
      <div className="flex items-center gap-4">
        <label>Status:</label>
        <select
          value={statusFilter || ""}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value || undefined);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/*render  orders  */}
      {orders.map((order) => {
        const orderTotal = order.line_items.reduce((total, item) => total + item.price * item.quantity, 0);

        return (
          <Card key={order.id}>
            <div className="border-b p-4 bg-gray-100 flex items-center justify-between">
              <div className="text-sm font-medium">Order #{order.id.slice(0, 8)}</div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-yellow-200 text-yellow-800">
                  {order.status}
                </Badge>
                <div className="text-sm font-medium">Total: ${orderTotal.toFixed(2)}</div>
                {order.status === "pending" && (
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleMarkAsDelivered(order.id)}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>

            <CardContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Customer:</strong> {order.full_name}
                </div>
                <div>
                  <strong>Email:</strong> {order.email}
                </div>
                <div>
                  <strong>Shipping Address:</strong> {order.address}, {order.city}, {order.country}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h2 className="text-lg font-semibold">Order Items ({order.line_items.length})</h2>

                {order.line_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                      <div className="text-sm text-muted-foreground">Price per unit: ${item.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right text-sm font-semibold text-gray-700">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* pagination buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
