"use client"

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
import { Badge } from "@/components/ui/badge"

// Sample color data
const initialColors = [
  { id: 1, name: "Black", hex: "#000000", products: 15 },
  { id: 2, name: "White", hex: "#FFFFFF", products: 12 },
  { id: 3, name: "Red", hex: "#FF0000", products: 8 },
  { id: 4, name: "Blue", hex: "#0000FF", products: 10 },
  { id: 5, name: "Green", hex: "#00FF00", products: 6 },
  { id: 6, name: "Yellow", hex: "#FFFF00", products: 4 },
  { id: 7, name: "Purple", hex: "#800080", products: 7 },
  { id: 8, name: "Gray", hex: "#808080", products: 9 },
  { id: 9, name: "Brown", hex: "#A52A2A", products: 5 },
  { id: 10, name: "Navy", hex: "#000080", products: 3 },
]

export default function Colors() {
  const [colors, setColors] = useState(initialColors)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hex.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddColor = (formData: FormData) => {
    const newColor = {
      id: colors.length + 1,
      name: formData.get("name") as string,
      hex: formData.get("hex") as string,
      products: 0,
    }

    setColors([...colors, newColor])
    setIsAddDialogOpen(false)
  }

  const handleEditColor = (formData: FormData) => {
    if (!currentColor) return

    const updatedColor = {
      ...currentColor,
      name: formData.get("name") as string,
      hex: formData.get("hex") as string,
    }

    setColors(colors.map((c) => (c.id === currentColor.id ? updatedColor : c)))
    setIsEditDialogOpen(false)
    setCurrentColor(null)
  }

  const handleDeleteColor = (id: number) => {
    setColors(colors.filter((c) => c.id !== id))
  }

  const openEditDialog = (color: any) => {
    setCurrentColor(color)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colors</h1>
          <p className="text-muted-foreground">Manage product colors</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddColor}>
              <DialogHeader>
                <DialogTitle>Add New Color</DialogTitle>
                <DialogDescription>Add a new color to your product catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Color name" required />
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hex">Hex Code</Label>
                    <Input id="hex" name="hex" placeholder="#000000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preview">Preview</Label>
                    <div className="flex h-10 items-center justify-center rounded-md border">
                      <input
                        type="color"
                        id="preview"
                        className="h-8 w-8 cursor-pointer border-0 bg-transparent"
                        onChange={(e) => {
                          const input = document.getElementById("hex") as HTMLInputElement
                          if (input) input.value = e.target.value
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Color</Button>
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
            placeholder="Search colors..."
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
              <TableHead>Color</TableHead>
              <TableHead>Hex Code</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No colors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredColors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: color.hex }} />
                      <span className="font-medium">{color.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{color.hex}</Badge>
                  </TableCell>
                  <TableCell>{color.products}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(color)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteColor(color.id)}>
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
          {currentColor && (
            <form action={handleEditColor}>
              <DialogHeader>
                <DialogTitle>Edit Color</DialogTitle>
                <DialogDescription>Update the color details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={currentColor.name} required />
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-hex">Hex Code</Label>
                    <Input id="edit-hex" name="hex" defaultValue={currentColor.hex} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-preview">Preview</Label>
                    <div className="flex h-10 items-center justify-center rounded-md border">
                      <input
                        type="color"
                        id="edit-preview"
                        defaultValue={currentColor.hex}
                        className="h-8 w-8 cursor-pointer border-0 bg-transparent"
                        onChange={(e) => {
                          const input = document.getElementById("edit-hex") as HTMLInputElement
                          if (input) input.value = e.target.value
                        }}
                      />
                    </div>
                  </div>
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
