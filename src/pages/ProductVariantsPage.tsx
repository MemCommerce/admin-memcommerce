import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Plus, Trash, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ProductVariant, type Color, type Product, type ProductVariantData, type Size } from "@/lib/types";
import { getProducts } from "@/api/productsApi";
import { getSizes } from "@/api/sizesApi";
import { getColors } from "@/api/colorsApi";
import { getPvs, postPv } from "@/api/productVariantsApi";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";

const deafaultPvData: ProductVariantData = {
  product_id: "",
  color_id: "",
  size_id: "",
  price: 0.0,
  image: "",
};

const ProductVariantPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPvData, setNewPvData] = useState<ProductVariantData>(deafaultPvData);
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, sizesData, colorsData, pvsData] = await Promise.all([
        getProducts(),
        getSizes(),
        getColors(),
        getPvs(),
      ]);
      setProducts(productsData);
      setSizes(sizesData);
      setColors(colorsData);
      setProductVariants(pvsData);
    };
    loadData();
  }, []);

  const handleAddPV = async (e: FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const newProductVariant = await postPv(newPvData);
      setProductVariants((prev) => [...prev, newProductVariant]);
      setIsAddDialogOpen(false);
      setNewPvData(deafaultPvData);
    } catch {
      toast("Error during creationg product variant!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPvData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePv = (id: string) => {
    console.log(id);
  };

  const openEditDialog = (product: ProductVariant) => {
    console.log(product);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPvData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
                <DialogDescription>
                  Fill in the details for the new product variant. Click save when you're done.
                </DialogDescription>
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
                    {newPvData.image && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <img src={newPvData.image} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setNewPvData((prev) => ({ ...prev, image: "" }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? "Saving..." : "Save Product Variant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <NoEntitiesWrapper entities={productVariants} entitiesName="product variants" colSpan={5}>
              {productVariants.map((pv) => (
                <TableRow key={pv.id}>
                  <TableCell className="font-medium">{products.find((p) => p.id === pv.product_id)?.name}</TableCell>
                  <TableCell>{colors.find((c) => c.id === pv.color_id)?.name}</TableCell>
                  <TableCell>{sizes.find((s) => s.id === pv.size_id)?.label}</TableCell>
                  <TableCell>{pv.price}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(pv)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePv(pv.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </NoEntitiesWrapper>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ProductVariantPage;
