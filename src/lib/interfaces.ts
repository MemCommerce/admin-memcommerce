import type { Theme } from "@/lib/types";

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
