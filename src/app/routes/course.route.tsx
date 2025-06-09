import { Routes, Route, Navigate } from "react-router-dom";

import CourseList from "app/pages/course/course.list";
import CourseHome from "app/pages/course/course.page";

const CourseRoutes = () => {
  return (
    <Routes>
      <Route index element={<CourseHome />} />
      <Route path="list" element={<CourseList />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default CourseRoutes;
