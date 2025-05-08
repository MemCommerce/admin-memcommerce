import { useEffect, useState, type FormEvent } from "react";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Category, CategoryData } from "@/lib/types";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { deleteCategory, getCategories, postCategory } from "@/api/categoriesApi";
import { toast } from "sonner";

const defaultCategoryData: CategoryData = {
    name: "",
    description: "",
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [newCategoryData, setNewCategoryData] = useState<CategoryData>(defaultCategoryData);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getCategories()
            setCategories(data)
        })()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = async (e: FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        try {
            const newCat = await postCategory(newCategoryData);
            setCategories((prev) => [...prev, newCat]);
            setNewCategoryData(defaultCategoryData);
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Failed to add category:", error);
            toast("Failed to add category!")
        } finally {
            setIsAdding(false);
        }
    };

    const openEditDialog = (size: any) => {};

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id)
            const newState = categories.filter((c) => c.id !== id)
            setCategories(newState)
        } catch {
            toast("Error during delete category!")
        }
    };

    const handleEditCategory = () => {};

    return (
        <section className="space-y-6">
            <section className="flex items-center justify-between">
                <article>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage product categories</p>
                </article>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddCategory}>
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                                <DialogDescription>Add a new product category.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Category Name</Label>
                                        <Input id="name" name="name" value={newCategoryData.name} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={newCategoryData.description} onChange={handleInputChange} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isAdding}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding ? "Adding..." : "Add Category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </section>

            <section className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <NoEntitiesWrapper entities={categories} entitiesName="categories" colSpan={3}>
                            {categories.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.description}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(c)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteCategory(c.id)}>
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
            </section>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    {editCategory && (
                        <form action={handleEditCategory}>
                            <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>Update the category details.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Category Name</Label>
                                        <Input id="edit-name" name="name" defaultValue={editCategory.name} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea id="edit-description" name="description" defaultValue={editCategory.description} />
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
        </section>
    );
};

export default CategoriesPage;
