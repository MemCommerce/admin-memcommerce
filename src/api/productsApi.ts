import type { Product, ProductData } from "@/lib/types";
import { PRODUCTS_URL } from "@/lib/urls";

export const getProducts = async (): Promise<Product[]> => {
  const resp = await fetch(PRODUCTS_URL);
  const data: Product[] = await resp.json();
  return data;
};

export const postProduct = async (productData: ProductData): Promise<Product> => {
  const resp = await fetch(PRODUCTS_URL, {
    method: "POST",
    body: JSON.stringify(productData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: Product = await resp.json();
  return data;
};

export const deleteProduct = async (id: string) => {
  const url = `${PRODUCTS_URL}${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
  });
  if (!resp.ok) {
    throw Error();
  }
};

export const editProduct = async (product: Product): Promise<Product> => {
  const resp = await fetch(PRODUCTS_URL, {
    method: "PUT",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: Product = await resp.json();
  return data;
};
