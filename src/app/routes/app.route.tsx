import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "security/context/auth.context";
import { ProtectedRoute } from "security/components/protected.route";

import AdminPage from "app/pages/admin/admin";
import HomePage from "app/pages/home.page";
import LoginPage from "app/pages/auth/login.page";
import CourseRoutes from "./course.route";
import ContentRoutes from "./content.route";
import CategoryRoutes from "./category.route";
import StudentRoutes from "./student.route";
import InstructorRoutes from "./instructor.route";
import { CourseSearch } from "app/components/course/course.search";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses/search" element={<CourseSearch />} />

          {/* Rutas protegidas para administradores */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route path="course/*" element={<CourseRoutes />} />
            <Route path="content/*" element={<ContentRoutes />} />
            <Route path="category/*" element={<CategoryRoutes />} />
          </Route>

          {/* Rutas protegidas para estudiantes */}
          <Route
            path="student/*"
            element={
              <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
                <StudentRoutes />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para instructores */}
          <Route
            path="instructor/*"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <InstructorRoutes />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
