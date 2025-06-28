import { X } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { ProductVariantFieldsProps } from "@/lib/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ProductVariant, ProductVariantData } from "@/lib/types";

const ProductVariantFields = <T extends ProductVariant | ProductVariantData>({
  pvData,
  setPvData,
  products,
  colors,
  sizes,
}: ProductVariantFieldsProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPvData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPvData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Product</Label>
            <Select
              value={pvData.product_id}
              onValueChange={(value) => setPvData((prev) => ({ ...prev, product_id: value }))}
            >
              <SelectTrigger id="product_id">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color_id">Color</Label>
            <Select
              value={pvData.color_id}
              onValueChange={(value) => setPvData((prev) => ({ ...prev, color_id: value }))}
            >
              <SelectTrigger id="color_id">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size_id">Size</Label>
            <Select
              value={pvData.size_id}
              onValueChange={(value) => setPvData((prev) => ({ ...prev, size_id: value }))}
            >
              <SelectTrigger id="size_id">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              step={0.01}
              id="price"
              name="price"
              placeholder="Price"
              required
              value={pvData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <div className="grid gap-2">
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            {"image" in pvData && pvData.image && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <img src={pvData.image} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPvData((prev) => ({ ...prev, image: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {"image_url" in pvData && pvData.image_url && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <img src={pvData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPvData((prev) => ({ ...prev, image: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductVariantFields;
