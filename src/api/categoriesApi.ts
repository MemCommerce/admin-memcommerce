import type { Category, CategoryData } from "@/lib/types";
import { CATEGORIES_URL } from "@/lib/urls";

export const postCategory = async (categoryData: CategoryData): Promise<Category> => {
  const resp = await fetch(CATEGORIES_URL, {
    method: "POST",
    body: JSON.stringify(categoryData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: Category = await resp.json();
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const resp = await fetch(CATEGORIES_URL);
  const data: Category[] = await resp.json();
  return data;
};

export const deleteCategory = async (id: string) => {
  const url = `${CATEGORIES_URL}${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
  });
  if (!resp.ok) {
    throw new Error();
  }
};

export const editCategory = async (category: Category): Promise<Category> => {
  const url = `${CATEGORIES_URL}${category.id}`;
  const resp = await fetch(url, {
    method: "PUT", 
    body: JSON.stringify(category),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to update category");
  }

  const data: Category = await resp.json();
  return data;
};

