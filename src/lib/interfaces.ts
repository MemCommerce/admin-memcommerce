import type { Theme } from "@/lib/types";
import type { ReactNode } from "react";

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export interface NoEntitiesProps<T> {
    entities: T[],
    entitiesName: string;
    colSpan: number;
    children: ReactNode;
}
