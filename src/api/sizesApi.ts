import type { Size, SizeData } from "@/lib/types";
import { SIZES_URL } from "@/lib/urls";

export const getSizes = async (): Promise<Size[]> => {
  const resp = await fetch(SIZES_URL);
  const data: Size[] = await resp.json();
  return data;
};

export const postSize = async (sizeData: SizeData): Promise<Size> => {
  const resp = await fetch(SIZES_URL, {
    method: "POST",
    body: JSON.stringify(sizeData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: Size = await resp.json();
  return data;
};

export const deleteSize = async (id: string) => {
  const url = `${SIZES_URL}${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
  });
  if (!resp.ok) throw Error();
};

export const editSize = async (size: Size): Promise<Size> => {
  const url = `${SIZES_URL}${size.id}`;
  const resp = await fetch(url, {
    method: "PUT", 
    body: JSON.stringify(size),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to update size");
  }

  const data: Size = await resp.json();
  return data;
};
