import { Routes, Route, Navigate } from "react-router-dom";

import CategoryList from "app/pages/category/category.list";
import CategoryHome from "app/pages/category/category.page";

const CategoryRoutes = () => {
    return (
        <Routes>
            <Route index element={<CategoryHome />} />
            <Route path="list" element={<CategoryList />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default CategoryRoutes;
