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

type SizeBase = {
    label: string;
}

export type SizeData = SizeBase

export type Size = SizeBase & {
    id: string;
}