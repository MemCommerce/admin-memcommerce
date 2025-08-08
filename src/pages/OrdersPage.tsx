import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      <Card>
        <div className="border-b p-4 bg-gray-100 flex items-center justify-between">
          <div className="text-sm font-medium">Order #123456</div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-yellow-200 text-yellow-800">
              Pending
            </Badge>
            <div className="text-sm font-medium">Total: $129.99</div>
          </div>
        </div>

        <CardContent className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Customer:</strong> John Doe
            </div>
            <div>
              <strong>Email</strong> john@example.com
            </div>
            <div>
              <strong>Shipping Adress:</strong> Dobrich mahlata N16
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Order Items (3)</h2>

            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm">
                <div className="flex items-start">
                  <img src="/placeholder-image.png" alt="Product" className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="space-y-1">
                    <div className="font-medium">Product Name {item}</div>
                    <div className="text-sm text-muted-foreground">Quantity: 5</div>
                    <div className="text-sm text-muted-foreground">Price per unit: $20</div>
                  </div>
                </div>

                <div className="text-right text-sm font-semibold text-gray-700">${(5 * 20).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
