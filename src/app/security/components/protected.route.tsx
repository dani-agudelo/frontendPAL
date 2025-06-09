import type React from "react";

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "security/context/auth.context";
import { Role } from "app/models/role.model";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  const selectRole = (roles: Role[], role: string): boolean => {
    return roles.some((r) => r.name.toUpperCase() === role.toUpperCase());
  };

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay roles permitidos y el usuario no tiene ninguno de ellos
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasAllowedRole = user.roles.some((role) =>
      allowedRoles.includes(role.name.toUpperCase()),
    );

    if (!hasAllowedRole) {
      // Redirigir según el rol del usuario
      if (selectRole(user.roles, "ADMIN")) {
        return <Navigate to="/admin" replace />;
      } else if (selectRole(user.roles, "INSTRUCTOR")) {
        return <Navigate to="/instructor/dashboard" replace />;
      } else if (selectRole(user.roles, "ESTUDIANTE")) {
        return <Navigate to="/student/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Si todo está bien, mostrar los hijos
  return <>{children}</>;
}
