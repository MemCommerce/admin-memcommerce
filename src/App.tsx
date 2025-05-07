import { Routes, Route } from "react-router";

import Dashboard from "./pages/DashboardPage";
import Colors from "./pages/ColorsPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="products" element={<Products />} /> */}
            <Route path="colors" element={<Colors />} />
            {/* <Route path="sizes" element={<Sizes />} />
          <Route path="orders" element={<Orders />} /> */}
        </Routes>
    );
}
