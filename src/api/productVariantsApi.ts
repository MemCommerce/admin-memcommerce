import type { ProductVariantData, ProductVariant } from "@/lib/types";
import { PRODUCT_VARIANTS_URL } from "@/lib/urls";

export const postPv = async (pvData: ProductVariantData): Promise<ProductVariant> => {
    const resp = await fetch(PRODUCT_VARIANTS_URL, {
        method: "POST",
        body: JSON.stringify(pvData),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data: ProductVariant = await resp.json();
    return data;
};

export const getPvs = async (): Promise<ProductVariant[]> => {
    const resp = await fetch(PRODUCT_VARIANTS_URL);
    const data: ProductVariant[] = await resp.json();
    return data;
};

export const deletePv = async (id: string) => {
    const url = `${PRODUCT_VARIANTS_URL}${id}`;
    const resp = await fetch(url, {
        method: "DELETE",
    });
    if (!resp.ok) {
        throw Error();
    }
};
