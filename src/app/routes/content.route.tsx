import { Routes, Route, Navigate } from "react-router-dom";

import ContentList from "app/pages/content/content.list";
import ContentHome from "app/pages/content/content.page";

const ContentRoutes = () => {
  return (
    <Routes>
      <Route index element={<ContentHome />} />
      <Route path="list" element={<ContentList />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ContentRoutes;