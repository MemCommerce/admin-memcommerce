import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Color, Product, ProductVariantData, Size } from "@/lib/types";

const deafaultPvData: ProductVariantData = {
    product_id: "",
    color_id: "",
    size_id: "",
    price: 0.00,
};

const ProductVariantPage = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newPvData, setNewPvData] = useState<ProductVariantData>(deafaultPvData);
    const [products, setProducts] = useState<Product[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddPV = (e: FormEvent) => {
      e.preventDefault()
      setIsAdding(true)

      
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPvData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <section className="space-y-6">
            <section className="flex items-center justify-between">
                <article>
                    <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
                    <p className="text-muted-foreground">Manage product variants inventory</p>
                </article>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product Variant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleAddPV}>
                            <DialogHeader>
                                <DialogTitle>Add New Product Variant</DialogTitle>
                                <DialogDescription>Fill in the details for the new product variant. Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_id">Product</Label>
                                        <Select
                                            value={newPvData.product_id}
                                            onValueChange={(value) => setNewPvData((prev) => ({ ...prev, product_id: value }))}
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
                                            value={newPvData.color_id}
                                            onValueChange={(value) => setNewPvData((prev) => ({ ...prev, color_id: value }))}
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
                                            value={newPvData.size_id}
                                            onValueChange={(value) => setNewPvData((prev) => ({ ...prev, size_id: value }))}
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
                                            value={newPvData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isAdding}>{isAdding ? "Saving..." : "Save Product Variant"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </section>
        </section>
    );
};

export default ProductVariantPage;
