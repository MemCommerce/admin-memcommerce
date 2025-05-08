import { useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample size data
const initialSizes = [
  { id: 1, name: "S", category: "Clothing", description: "Small size", products: 12 },
  { id: 2, name: "M", category: "Clothing", description: "Medium size", products: 15 },
  { id: 3, name: "L", category: "Clothing", description: "Large size", products: 10 },
  { id: 4, name: "XL", category: "Clothing", description: "Extra Large size", products: 8 },
  { id: 5, name: "XXL", category: "Clothing", description: "Double Extra Large size", products: 5 },
  { id: 6, name: "38", category: "Footwear", description: "EU size 38", products: 7 },
  { id: 7, name: "40", category: "Footwear", description: "EU size 40", products: 9 },
  { id: 8, name: "42", category: "Footwear", description: "EU size 42", products: 11 },
  { id: 9, name: "44", category: "Footwear", description: "EU size 44", products: 6 },
  { id: 10, name: "One Size", category: "Accessories", description: "Universal size", products: 14 },
]

const categories = ["Clothing", "Footwear", "Accessories"]

export default function Sizes() {
  const [sizes, setSizes] = useState(initialSizes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSize, setCurrentSize] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredSizes = sizes.filter((size) => {
    const matchesSearch =
      size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory ? size.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  const handleAddSize = (formData: FormData) => {
    const newSize = {
      id: sizes.length + 1,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      products: 0,
    }

    setSizes([...sizes, newSize])
    setIsAddDialogOpen(false)
  }

  const handleEditSize = (formData: FormData) => {
    if (!currentSize) return

    const updatedSize = {
      ...currentSize,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
    }

    setSizes(sizes.map((s) => (s.id === currentSize.id ? updatedSize : s)))
    setIsEditDialogOpen(false)
    setCurrentSize(null)
  }

  const handleDeleteSize = (id: number) => {
    setSizes(sizes.filter((s) => s.id !== id))
  }

  const openEditDialog = (size: any) => {
    setCurrentSize(size)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sizes</h1>
          <p className="text-muted-foreground">Manage product sizes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Size
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddSize}>
              <DialogHeader>
                <DialogTitle>Add New Size</DialogTitle>
                <DialogDescription>Add a new size to your product catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Size Name</Label>
                    <Input id="name" name="name" placeholder="Size name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Size description" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Size</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sizes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full max-w-xs">
          <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSizes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No sizes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell className="font-medium">{size.name}</TableCell>
                  <TableCell>{size.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{size.description}</TableCell>
                  <TableCell>{size.products}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(size)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteSize(size.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {currentSize && (
            <form action={handleEditSize}>
              <DialogHeader>
                <DialogTitle>Edit Size</DialogTitle>
                <DialogDescription>Update the size details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Size Name</Label>
                    <Input id="edit-name" name="name" defaultValue={currentSize.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select name="category" defaultValue={currentSize.category} required>
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={currentSize.description} />
                </div>
              </div>
              <DialogFooter>
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
  )
}
