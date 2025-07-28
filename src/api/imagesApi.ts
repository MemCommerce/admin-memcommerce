import type { TempImage, TempImageData } from "@/lib/types";
import { IMAGES_URL } from "@/lib/urls";

export const postImage = async (imageData: string): Promise<string> => {
  const resp = await fetch(IMAGES_URL, {
    method: "POST",
    body: JSON.stringify(imageData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: string = await resp.json();
  return data;
};

export const postImages = async (imagesDatas: TempImageData[]): Promise<TempImage[]> => {
  const url = `${IMAGES_URL}temporary/bulk`;
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(imagesDatas),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: TempImage[] = await resp.json();
  return data;
};
