import { Routes, Route, BrowserRouter } from "react-router";

import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/DashboardPage";
import Colors from "./pages/ColorsPage";
import Products from "./pages/ProductsPage";
import Header from "./components/Header";
import CategoriesPage from "./pages/CategoriesPage";
import Sizes from "./pages/SizesPage";
import ProductVariantPage from "./pages/ProductVariantsPage";
import AiAdminPage from "./pages/AiAdminPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="products" element={<Products />} />
          <Route path="products-variants" element={<ProductVariantPage />} />
          <Route path="colors" element={<Colors />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="ai-admin" element={<AiAdminPage />} />
        </Routes>
        <Toaster />
      </main>
    </BrowserRouter>
  );
}
