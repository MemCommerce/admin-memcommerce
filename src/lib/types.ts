export type Theme = "light" | "dark";

type CategoryBase = {
    name: string;
    description: string;
};

export type CategoryData = CategoryBase;

export type Category = CategoryBase & {
    id: string;
};

type ColorBase = {
    name: string;
    hex: string;
};

export type ColorData = ColorBase;

export type Color = ColorBase & {
    id: string;
};
