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
    const resp = await fetch(CATEGORIES_URL)
    const data: Category[] = await resp.json()
    return data;
}

export const deleteCategory = async (id: string) => {
    const URL = `${CATEGORIES_URL}${id}`
    const resp = await fetch(URL, {
        method: "DELETE"
    })
    if (!resp.ok) {
        throw new Error()
    }
}