import { useEffect, useState, type FormEvent } from "react";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type ProductVariant, type Color, type Product, type ProductVariantData, type Size } from "@/lib/types";
import { getProducts } from "@/api/productsApi";
import { getSizes } from "@/api/sizesApi";
import { getColors } from "@/api/colorsApi";
import { deletePv, getPvs, postPv, putPv } from "@/api/productVariantsApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NoEntitiesWrapper from "@/components/common/NoEntitiesWrapper";
import DialogComponent from "@/components/DialogComponent";
import ProductVariantFields from "@/components/forms/ProductVariantFields";

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
  const [isLoading, setIsLoading] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProductVariant, setEdintProductVariant] = useState<ProductVariant | null>(null);

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
    setIsLoading(true);

    try {
      const newProductVariant = await postPv(newPvData);
      setProductVariants((prev) => [...prev, newProductVariant]);
      setIsAddDialogOpen(false);
      setNewPvData(deafaultPvData);
    } catch {
      toast("Error during creationg product variant!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePv = async (id: string) => {
    try {
      await deletePv(id)
      setProductVariants(productVariants.filter((pv) => pv.id !== id))
    } catch {
      toast("Error during delete of product variant!")
    }
  };

  const openEditDialog = (productVariant: ProductVariant) => {
    setEdintProductVariant(productVariant);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const editedPv = await putPv(editProductVariant as ProductVariant);
      const newProductVariantsState = productVariants.map((pv) => {
        if (pv.id === editedPv.id) {
          return editedPv;
        }
        return pv;
      });
      setProductVariants(newProductVariantsState);
      setIsEditDialogOpen(false);
      setEdintProductVariant(null);
    } catch {
      toast("Error during editing product variant!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <article>
          <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
          <p className="text-muted-foreground">Manage product variants inventory</p>
        </article>
        <DialogComponent
          isLoading={isLoading}
          title="Add New Product Variant"
          description="Fill in the details for the new product variant. Click save when you're done."
          onSubmit={handleAddPV}
          isDialogOpen={isAddDialogOpen}
          setIsDialogOpen={setIsAddDialogOpen}
          trigger={
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product Variant
              </Button>
            </DialogTrigger>
          }
        >
          <ProductVariantFields
            pvData={newPvData}
            setPvData={setNewPvData}
            products={products}
            colors={colors}
            sizes={sizes}
          />
        </DialogComponent>
      </section>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Image</TableHead>
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
                  <TableCell>
                    {pv.image_url ? (
                      <img src={pv.image_url} alt="" className="w-[50px] h-[50px] object-cover rounded border" />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
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
      {editProductVariant && (
        <DialogComponent
          isLoading={isLoading}
          title="Edit Product Variant"
          description="Edit the details for the product variant."
          onSubmit={handleSaveEdit}
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsAddDialogOpen}
        >
          <ProductVariantFields
            pvData={editProductVariant}
            setPvData={setEdintProductVariant as React.Dispatch<React.SetStateAction<ProductVariant>>}
            products={products}
            colors={colors}
            sizes={sizes}
          />
        </DialogComponent>
      )}
    </section>
  );
};

export default ProductVariantPage;
