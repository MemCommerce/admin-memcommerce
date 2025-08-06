import type { ColorData, Color } from "@/lib/types";
import { COLORS_URL } from "@/lib/urls";

export const postColor = async (colorData: ColorData): Promise<Color> => {
  const resp = await fetch(COLORS_URL, {
    method: "POST",
    body: JSON.stringify(colorData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: Color = await resp.json();
  return data;
};

export const getColors = async (): Promise<Color[]> => {
  const resp = await fetch(COLORS_URL);
  const data: Color[] = await resp.json();
  return data;
};

export const deleteColor = async (id: string) => {
  const url = `${COLORS_URL}${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
  });
  if (!resp.ok) {
    throw Error();
  }
};

export const editColor = async (size: Color): Promise<Color> => {
  const url = `${COLORS_URL}${size.id}`;
  const resp = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(size),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to update color");
  }

  const data: Color = await resp.json();
  return data;
};
