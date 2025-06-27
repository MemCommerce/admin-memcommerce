import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Product, ProductData } from "@/lib/types";
import { deleteProduct, getProducts, postProduct } from "@/api/productsApi";
import { getCategories } from "@/api/categoriesApi";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";
import DialogComponent from "@/components/DialogComponent";

const defaultProduct: ProductData = {
  name: "",
  brand: "",
  category_id: "",
  description: "",
};

export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProductData, setNewProductData] = useState<ProductData>(defaultProduct);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      const [getProductsData, getCategoriesData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(getProductsData);
      setCategories(getCategoriesData);
    };

    loadData();
  }, []);

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev!, [name]: value }));
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const newProduct = await postProduct(newProductData);
      setProducts((prev) => [...prev, newProduct]);
      setIsAddDialogOpen(false);
      setNewProductData(defaultProduct);
    } catch {
      toast("Something happened during creation of product!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditProduct = async (e: FormEvent) => {};

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      toast("Error during delete of product!");
    }
  };

  const openEditDialog = (product: any) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleAiGen = () => {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <DialogComponent
          isDialogOpen={isAddDialogOpen}
          setIsDialogOpen={setIsAddDialogOpen}
          onSubmit={handleAddProduct}
          trigger={
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
          }
          title="Add New Product"
          description="Fill in the details for the new product. Click save when you're done."
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Product name"
                  required
                  value={newProductData.name}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Brand"
                  required
                  value={newProductData.brand}
                  onChange={handleNewProductChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>

                <Select
                  value={newProductData.category_id}
                  onValueChange={(value) => setNewProductData((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description"
                required
                value={newProductData.description}
                onChange={handleNewProductChange}
              />
              <Button type="button" variant="outline" disabled={isAdding} onClick={handleAiGen}>
                <Bot />
                Generate with AI
              </Button>
            </div>
          </div>
        </DialogComponent>
      </div>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <NoEntitiesWrapper entities={filteredProducts} entitiesName="products" colSpan={4}>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{categories.find((c) => c.id === product.category_id)?.name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
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

      <DialogComponent
        title="Edit product"
        description="Update the product details. Click save when you're done."
        isDialogOpen={isEditDialogOpen}
        setIsDialogOpen={setIsAddDialogOpen}
        onSubmit={handleEditProduct}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Product name"
                required
                value={currentProduct!.name}
                onChange={handleEditProductChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="Brand"
                required
                value={currentProduct!.brand}
                onChange={handleEditProductChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>

              <Select
                value={currentProduct!.category_id}
                onValueChange={(value) => setCurrentProduct((prev) => ({ ...prev!, category_id: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Product description"
              required
              value={currentProduct!.description}
              onChange={handleEditProductChange}
            />
            <Button type="button" variant="outline" disabled={isAdding} onClick={handleAiGen}>
              <Bot />
              Generate with AI
            </Button>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
}
