import { useEffect, useState, type FormEvent } from "react";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Size, SizeData } from "@/lib/types";
import { deleteSize, getSizes, postSize } from "@/api/sizesApi";
import { toast } from "sonner";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";

const defaultSize: SizeData = {
    label: "",
};

export default function Sizes() {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState<Size | null>(null);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newSizeData, setNewSizeData] = useState<SizeData>(defaultSize);

    useEffect(() => {
        (async () => {
            const data = await getSizes();
            setSizes(data);
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSizeData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSize = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newSize = await postSize(newSizeData);
            setSizes((prev) => [...prev, newSize]);
            setIsAddDialogOpen(false);
            setNewSizeData(defaultSize);
        } catch {
            toast("Error during creating size!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSize = (formData: FormData) => {
        if (!currentSize) return;

        const updatedSize = {
            ...currentSize,
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            description: formData.get("description") as string,
        };

        setSizes(sizes.map((s) => (s.id === currentSize.id ? updatedSize : s)));
        setIsEditDialogOpen(false);
        setCurrentSize(null);
    };

    const handleDeleteSize = async (id: string) => {
        try {
            await deleteSize(id);
            setSizes(sizes.filter((s) => s.id !== id));
        } catch {
            toast("Error during deleting of size.");
        }
    };

    const openEditDialog = (size: any) => {
        setCurrentSize(size);
        setIsEditDialogOpen(true);
    };

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
                        <form onSubmit={handleAddSize}>
                            <DialogHeader>
                                <DialogTitle>Add New Size</DialogTitle>
                                <DialogDescription>Add a new size to your product catalog.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Size Label</Label>
                                        <Input
                                            id="label"
                                            name="label"
                                            placeholder="Size label"
                                            required
                                            value={newSizeData.label}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>Add Size</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
      </div> */}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Label</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <NoEntitiesWrapper entities={sizes} entitiesName="sizes" colSpan={2}>
                            {sizes.map((size) => (
                                <TableRow key={size.id}>
                                    <TableCell className="font-medium">{size.label}</TableCell>

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
                            ))}
                        </NoEntitiesWrapper>
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
                                        <Label htmlFor="edit-name">Size Label</Label>
                                        <Input id="edit-name" name="name" defaultValue={currentSize.label} required />
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
