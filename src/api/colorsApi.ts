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
