import { useState } from "react"
import { Plus, Pencil, Trash, Save, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"


// Sample colors and sizes
const availableColors = [
  { id: 1, name: "White", hex: "#FFFFFF" },
  { id: 2, name: "Black", hex: "#000000" },
  { id: 3, name: "Red", hex: "#FF0000" },
  { id: 4, name: "Blue", hex: "#0000FF" },
  { id: 5, name: "Green", hex: "#00FF00" },
  { id: 6, name: "Yellow", hex: "#FFFF00" },
  { id: 7, name: "Gray", hex: "#808080" },
  { id: 8, name: "Navy", hex: "#000080" },
]

const availableSizes = [
  { id: 1, name: "XS", category: "Clothing" },
  { id: 2, name: "S", category: "Clothing" },
  { id: 3, name: "M", category: "Clothing" },
  { id: 4, name: "L", category: "Clothing" },
  { id: 5, name: "XL", category: "Clothing" },
  { id: 6, name: "XXL", category: "Clothing" },
]

// Type definitions
interface ProductVariant {
  id: number
  colorId: number
  sizeId: number
  sku: string
  price: number
  stock: number
  isActive: boolean
}

interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  category: string
  brand: string
  variants: ProductVariant[]
}

export default function ProductVariants() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null)
  
  // Product state
  const [product, setProduct] = useState<Product>({
    id: 1,
    name: "",
    description: "",
    basePrice: 0,
    category: "",
    brand: "",
    variants: [],
  })
  
  // New variant state
  const [newVariant, setNewVariant] = useState<Omit<ProductVariant, "id">>({
    colorId: 0,
    sizeId: 0,
    sku: "",
    price: 0,
    stock: 0,
    isActive: true,
  })

  // Handle product form changes
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct({
      ...product,
      [name]: name === "basePrice" ? parseFloat(value) || 0 : value,
    })
  }

  // Handle variant form changes
  const handleVariantChange = (field: keyof Omit<ProductVariant, "id">, value: any) => {
    setNewVariant({
      ...newVariant,
      [field]: field === "price" || field === "stock" ? parseFloat(value) || 0 : value,
    })
  }

  // Save product details
  const saveProductDetails = () => {
    if (!product.name || !product.category || !product.brand) {
      toast("Please fill in all required fields.")
      return
    }
    
    toast("Product details have been saved successfully.")
    
    setActiveTab("variants")
  }

  // Add new variant
  const addVariant = () => {
    if (newVariant.colorId === 0 || newVariant.sizeId === 0 || !newVariant.sku) {
      toast("Missing Information")
      return
    }
    
    // Check if variant with same color and size already exists
    const existingVariant = product.variants.find(
      v => v.colorId === newVariant.colorId && v.sizeId === newVariant.sizeId
    )
    
    if (existingVariant && !isEditing) {
        toast("Duplicate Variant")
      return
    }
    
    if (isEditing && editingVariantId !== null) {
      // Update existing variant
      setProduct({
        ...product,
        variants: product.variants.map(v => 
          v.id === editingVariantId ? { ...newVariant, id: v.id } : v
        ),
      })
      
      toast("Variant Updated")
    } else {
      // Add new variant
      const newId = product.variants.length > 0 
        ? Math.max(...product.variants.map(v => v.id)) + 1 
        : 1
        
      setProduct({
        ...product,
        variants: [
          ...product.variants,
          { ...newVariant, id: newId },
        ],
      })
      
      toast("Variant Added")
    }
    
    // Reset form
    setNewVariant({
      colorId: 0,
      sizeId: 0,
      sku: "",
      price: product.basePrice,
      stock: 0,
      isActive: true,
    })
    setIsEditing(false)
    setEditingVariantId(null)
  }

  // Edit variant
  const editVariant = (variant: ProductVariant) => {
    setNewVariant({
      colorId: variant.colorId,
      sizeId: variant.sizeId,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      isActive: variant.isActive,
    })
    setIsEditing(true)
    setEditingVariantId(variant.id)
  }

  // Delete variant
  const deleteVariant = (id: number) => {
    setProduct({
      ...product,
      variants: product.variants.filter(v => v.id !== id),
    })
    
    toast("Variant Deleted")
  }

  // Cancel editing
  const cancelEditing = () => {
    setNewVariant({
      colorId: 0,
      sizeId: 0,
      sku: "",
      price: product.basePrice,
      stock: 0,
      isActive: true,
    })
    setIsEditing(false)
    setEditingVariantId(null)
  }

  // Get color and size names by ID
  const getColorName = (id: number) => availableColors.find(c => c.id === id)?.name || "Unknown"
  const getColorHex = (id: number) => availableColors.find(c => c.id === id)?.hex || "#CCCCCC"
  const getSizeName = (id: number) => availableSizes.find(s => s.id === id)?.name || "Unknown"

  // Save all product data
  const saveProduct = () => {
    if (product.variants.length === 0) {
      toast("No Variants")
      return
    }
    
    // Here you would typically send the data to your API
    console.log("Saving product:", product)
    
    toast("Product Saved")
    
    // Navigate back to products page
    navigate("/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Product Variants</h1>
            <p className="text-muted-foreground">Add and manage variants of your product</p>
          </div>
        </div>
        <Button onClick={saveProduct}>
          <Save className="mr-2 h-4 w-4" />
          Save Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="variants">Product Variants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={product.name} 
                    onChange={handleProductChange} 
                    placeholder="e.g. Adidas T-Shirt"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand*</Label>
                  <Input 
                    id="brand" 
                    name="brand" 
                    value={product.brand} 
                    onChange={handleProductChange} 
                    placeholder="e.g. Adidas"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={product.description} 
                  onChange={handleProductChange} 
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={product.category} 
                    onChange={handleProductChange} 
                    placeholder="e.g. Clothing"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price*</Label>
                  <Input 
                    id="basePrice" 
                    name="basePrice" 
                    type="number" 
                    value={product.basePrice || ""} 
                    onChange={handleProductChange} 
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProductDetails}>Continue to Variants</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Variant" : "Add New Variant"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update the details of this variant" 
                  : "Add a new variant with different color and size"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color*</Label>
                  <Select 
                    value={newVariant.colorId.toString()} 
                    onValueChange={(value) => handleVariantChange("colorId", parseInt(value))}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded-full border" 
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size*</Label>
                  <Select 
                    value={newVariant.sizeId.toString()} 
                    onValueChange={(value) => handleVariantChange("sizeId", parseInt(value))}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id.toString()}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU*</Label>
                  <Input 
                    id="sku" 
                    value={newVariant.sku} 
                    onChange={(e) => handleVariantChange("sku", e.target.value)} 
                    placeholder="e.g. ADI-TSHIRT-WHT-L"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={newVariant.price || ""} 
                    onChange={(e) => handleVariantChange("price", e.target.value)} 
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock*</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={newVariant.stock || ""} 
                    onChange={(e) => handleVariantChange("stock", e.target.value)} 
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newVariant.isActive}
                  onChange={(e) => handleVariantChange("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={cancelEditing}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={addVariant}>
                    <Save className="mr-2 h-4 w-4" />
                    Update Variant
                  </Button>
                </>
              ) : (
                <Button onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                {product.variants.length === 0 
                  ? "No variants added yet" 
                  : `${product.variants.length} variants added`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.variants.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No variants added yet. Add your first variant above.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded-full border" 
                              style={{ backgroundColor: getColorHex(variant.colorId) }}
                            />
                            {getColorName(variant.colorId)}
                          </div>
                        </TableCell>
                        <TableCell>{getSizeName(variant.sizeId)}</TableCell>
                        <TableCell>{variant.sku}</TableCell>
                        <TableCell>${variant.price.toFixed(2)}</TableCell>
                        <TableCell>{variant.stock}</TableCell>
                        <TableCell>
                          <Badge variant={variant.isActive ? "default" : "secondary"}>
                            {variant.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => editVariant(variant)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteVariant(variant.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
