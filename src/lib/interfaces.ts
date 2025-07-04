import type { Color, Product, ProductVariant, ProductVariantData, Size, Theme } from "@/lib/types";
import type { FormEvent, ReactNode } from "react";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface NoEntitiesProps<T> {
  entities: T[];
  entitiesName: string;
  colSpan: number;
  children: ReactNode;
}

export interface DialogComponentProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: FormEvent) => Promise<void>;
  title: string;
  description: string;
  children: ReactNode;
  isLoading: boolean;
  trigger?: ReactNode;
}

export interface ProductVariantFieldsProps<T extends ProductVariant | ProductVariantData> {
  pvData: T;
  setPvData: React.Dispatch<React.SetStateAction<T>>;
  products: Product[];
  colors: Color[];
  sizes: Size[];
}
