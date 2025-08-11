import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash, Bot, Sparkles, X } from "lucide-react";
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
import type { Category, DescriptionReq, Product, ProductData } from "@/lib/types";
import { deleteProduct, editProduct, getProducts, postProduct } from "@/api/productsApi";
import { getCategories } from "@/api/categoriesApi";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";
import DialogComponent from "@/components/DialogComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateAiDescription } from "@/api/aiDescriptionApi";
import Loader from "@/components/common/Loader";

const defaultProduct: ProductData = {
  name: "",
  brand: "",
  category_id: "",
  description: "",
};

const defaultAiParams = {
  primary_keyword: "",
  secondary_keywords: [] as string[],
  target_audience: [] as string[],
};

export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProductData, setNewProductData] = useState<ProductData>(defaultProduct);

  // AI generation states
  const [showAiForm, setShowAiForm] = useState(false);
  const [aiParams, setAiParams] = useState(defaultAiParams);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [currentAudience, setCurrentAudience] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

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
    setIsLoading(true);

    try {
      const newProduct = await postProduct(newProductData);
      setProducts((prev) => [...prev, newProduct]);
      setIsAddDialogOpen(false);
      setNewProductData(defaultProduct);
    } catch {
      toast("Something happened during creation of product!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const updatedProduct = await editProduct(currentProduct!);
      const newProductsState = products.map((p) => {
        if (p.id === updatedProduct.id) {
          return updatedProduct;
        }
        return p;
      });
      setProducts(newProductsState);
      setIsEditDialogOpen(false);
      setCurrentProduct(null);
    } catch {
      toast("Something happened during editing of product!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      toast("Error during delete of product!");
    }
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleAiGen = () => {
    if (!newProductData.name || !newProductData.brand || !newProductData.category_id) {
      toast.error("Please fill in Name, Brand, and Category before generating AI description");
      return;
    }
    setShowAiForm(true);
  };

  const handleGenerateDescription = async () => {
    if (!aiParams.primary_keyword) {
      toast.error("Please provide a primary keyword");
      return;
    }

    setIsAiGenerating(true);
    try {
      const selectedCategory = categories.find((c) => c.id === newProductData.category_id);
      const descriptionReq: DescriptionReq = {
        name: newProductData.name,
        brand: newProductData.brand,
        category: selectedCategory?.name || "",
        primary_keyword: aiParams.primary_keyword,
        secondary_keywords: aiParams.secondary_keywords,
        target_audience: aiParams.target_audience,
      };

      const generatedDescription = await generateAiDescription(descriptionReq);
      console.log(generatedDescription);
      setNewProductData((prev) => ({ ...prev, description: generatedDescription }));
      setShowAiForm(false);
      toast.success("AI description generated successfully!");
    } catch {
      toast.error("Failed to generate AI description");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !aiParams.secondary_keywords.includes(currentKeyword.trim())) {
      setAiParams((prev) => ({
        ...prev,
        secondary_keywords: [...prev.secondary_keywords, currentKeyword.trim()],
      }));
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setAiParams((prev) => ({
      ...prev,
      secondary_keywords: prev.secondary_keywords.filter((k) => k !== keyword),
    }));
  };

  const addAudience = () => {
    if (currentAudience.trim() && !aiParams.target_audience.includes(currentAudience.trim())) {
      setAiParams((prev) => ({
        ...prev,
        target_audience: [...prev.target_audience, currentAudience.trim()],
      }));
      setCurrentAudience("");
    }
  };

  const removeAudience = (audience: string) => {
    setAiParams((prev) => ({
      ...prev,
      target_audience: prev.target_audience.filter((a) => a !== audience),
    }));
  };

  const resetAiForm = () => {
    setShowAiForm(false);
    setAiParams(defaultAiParams);
    setCurrentKeyword("");
    setCurrentAudience("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <DialogComponent
          isLoading={isLoading}
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
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="grid gap-4 py-4 px-1">
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
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading || isAiGenerating}
                    onClick={handleAiGen}
                    className="flex-1 bg-transparent"
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Generate with AI
                  </Button>
                  {showAiForm && (
                    <Button type="button" variant="ghost" size="icon" onClick={resetAiForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {showAiForm && (
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI Description Generator
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Provide additional context to generate a compelling product description
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary_keyword" className="text-xs">
                        Primary Keyword *
                      </Label>
                      <Input
                        id="primary_keyword"
                        placeholder="e.g., wireless, premium, innovative"
                        value={aiParams.primary_keyword}
                        onChange={(e) => setAiParams((prev) => ({ ...prev, primary_keyword: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Secondary Keywords</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add keyword and press Enter"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" size="sm" onClick={addKeyword}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {aiParams.secondary_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {aiParams.secondary_keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              {keyword}
                              <button
                                type="button"
                                onClick={() => removeKeyword(keyword)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Target Audience</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., professionals, gamers, students"
                          value={currentAudience}
                          onChange={(e) => setCurrentAudience(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAudience())}
                        />
                        <Button type="button" size="sm" onClick={addAudience}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {aiParams.target_audience.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {aiParams.target_audience.map((audience) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                              <button
                                type="button"
                                onClick={() => removeAudience(audience)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <Button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isAiGenerating || !aiParams.primary_keyword}
                      className="w-full"
                    >
                      {isAiGenerating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Description
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
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

      {currentProduct && (
        <DialogComponent
          isLoading={isLoading}
          title="Edit product"
          description="Update the product details. Click save when you're done."
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsEditDialogOpen}
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
                  value={currentProduct.name}
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
                  value={currentProduct.brand}
                  onChange={handleEditProductChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>

                <Select
                  value={currentProduct.category_id}
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
                value={currentProduct.description}
                onChange={handleEditProductChange}
              />
              <Button type="button" variant="outline" disabled={isLoading} onClick={handleAiGen}>
                <Bot />
                Generate with AI
              </Button>
            </div>
          </div>
        </DialogComponent>
      )}
    </div>
  );
}
