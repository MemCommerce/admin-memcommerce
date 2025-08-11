import { useEffect, useState, type FormEvent } from "react";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Color, ColorData } from "@/lib/types";
import { deleteColor, editColor, getColors, postColor } from "@/api/colorsApi";
import { toast } from "sonner";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";
import Loader from "@/components/common/Loader";

const defaultColorData: ColorData = {
  name: "",
  hex: "",
};

export default function Colors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<any>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [newColorData, setNewColorData] = useState<ColorData>(defaultColorData);
  const [isAdding, setIsAdding] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getColors();
      setColors(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewColorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddColor = async (e: FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const newColor = await postColor(newColorData);
      setColors((prev) => [...prev, newColor]);
      setNewColorData(defaultColorData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add color:", error);
      toast("Failed to add color!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditColor = async (formData: FormData) => {
    if (!currentColor) return;

    const updatedColor = {
      ...currentColor,
      name: formData.get("name") as string,
      hex: formData.get("hex") as string,
    };

    try {
      const savedColor = await editColor(updatedColor);

      setColors((prev) => prev.map((c) => (c.id === savedColor.id ? savedColor : c)));

      setIsEditDialogOpen(false);
      setCurrentColor(null);
    } catch (error) {
      console.error("Failed to update color:", error);
      toast("Failed to update color!");
    }
  };

  const handleDeleteColor = async (id: string) => {
    try {
      await deleteColor(id);
      setColors(colors.filter((c) => c.id !== id));
    } catch {
      toast("Error during delete color!");
    }
  };

  const openEditDialog = (color: any) => {
    setCurrentColor(color);
    setIsEditDialogOpen(true);
  };

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
            <form onSubmit={handleAddColor}>
              <DialogHeader>
                <DialogTitle>Add New Color</DialogTitle>
                <DialogDescription>Add a new color to your product catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Color name"
                    required
                    value={newColorData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hex">Hex Code</Label>
                    <Input
                      id="hex"
                      name="hex"
                      placeholder="#000000"
                      required
                      value={newColorData.hex}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preview">Preview</Label>
                    <div className="flex h-10 items-center justify-center rounded-md border">
                      <input
                        type="color"
                        id="preview"
                        name="hex"
                        className="h-8 w-8 cursor-pointer border-0 bg-transparent"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Color"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="flex items-center">
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
      </div> */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Hex Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <NoEntitiesWrapper entities={colors} colSpan={3} entitiesName="colors">
              {colors.map((color) => (
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
              ))}
            </NoEntitiesWrapper>
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
                        name="hex"
                        defaultValue={currentColor.hex}
                        className="h-8 w-8 cursor-pointer border-0 bg-transparent"
                        onChange={handleChange}
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
  );
}
