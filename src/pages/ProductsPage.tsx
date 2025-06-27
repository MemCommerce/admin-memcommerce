import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Product, ProductData } from "@/lib/types";
import { deleteProduct, getProducts, postProduct } from "@/api/productsApi";
import { getCategories } from "@/api/categoriesApi";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProductData((prev) => ({ ...prev, [name]: value }));
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

    const handleEditProduct = (formData: FormData) => {
        if (!currentProduct) return;

        const updatedProduct = {
            ...currentProduct,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: Number.parseFloat(formData.get("price") as string),
            category: formData.get("category") as string,
            inventory: Number.parseInt(formData.get("inventory") as string),
        };

        setProducts(products.map((p) => (p.id === currentProduct.id ? updatedProduct : p)));
        setIsEditDialogOpen(false);
        setCurrentProduct(null);
    };

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

    const handleAiGen = () => {
        
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleAddProduct}>
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>Fill in the details for the new product. Click save when you're done.</DialogDescription>
                            </DialogHeader>
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                        onChange={handleChange}
                                    />
                                    <Button type="button" variant="outline" disabled={isAdding} onClick={handleAiGen}>
                                        <Bot />
                                        Generate with AI
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isAdding}>{isAdding ? "Saving..." : "Save Product"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    {currentProduct && (
                        <form action={handleEditProduct}>
                            <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>Update the product details. Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="details" className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="variants">Variants</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-name">Name</Label>
                                            <Input id="edit-name" name="name" defaultValue={currentProduct.name} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-category">Category</Label>
                                            <Input id="edit-category" name="category" defaultValue={currentProduct.category} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea id="edit-description" name="description" defaultValue={currentProduct.description} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-price">Price</Label>
                                            <Input
                                                id="edit-price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                defaultValue={currentProduct.price}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-inventory">Inventory</Label>
                                            <Input
                                                id="edit-inventory"
                                                name="inventory"
                                                type="number"
                                                defaultValue={currentProduct.inventory}
                                                required
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="variants" className="space-y-4 pt-4">
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Color</TableHead>
                                                    <TableHead>Size</TableHead>
                                                    <TableHead>Stock</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentProduct.variants.map((variant: any) => (
                                                    <TableRow key={variant.id}>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-gray-100">
                                                                {variant.color}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{variant.size}</TableCell>
                                                        <TableCell>{variant.stock}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Variant
                                    </Button>
                                </TabsContent>
                            </Tabs>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
