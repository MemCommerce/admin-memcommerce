import { Routes, Route, BrowserRouter } from "react-router";

import Dashboard from "./pages/DashboardPage";
import Colors from "./pages/ColorsPage";
import Products from "./pages/ProductsPage";
import Header from "./components/Header";
import ProductVariants from "./pages/ProductVariantsPage";
import CategoriesPage from "./pages/CategoriesPage";
import Sizes from "./pages/SizesPage";

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <main className="p-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products-variants" element={<ProductVariants />} />
                    <Route path="colors" element={<Colors />} />
                    <Route path="sizes" element={<Sizes />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
