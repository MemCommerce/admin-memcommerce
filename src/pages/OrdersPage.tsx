import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { getOrders } from "@/api/apiOrders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getOrders();
      setOrders(data);
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      {orders.map((order, index) => {
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
                    <div className="flex items-start">
                      <img
                        src={item.image_name ? `/uploads/${item.image_name}` : "/placeholder-image.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                        <div className="text-sm text-muted-foreground">Price per unit: ${item.price.toFixed(2)}</div>
                      </div>
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
    </div>
  );
}
