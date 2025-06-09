import { LoginForm } from "app/components/auth/login.form";
import { useEffect } from "react";
import { useAuth } from "security/context/auth.context";
import { useNavigate } from "react-router-dom";
import { Role } from "app/models/role.model";

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const selectRole = (roles: Role[], role: string): boolean => {
    return roles.some((r) => r.name.toUpperCase() === role.toUpperCase());
  };

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir según su rol
    if (isAuthenticated && user) {
      if (selectRole(user.roles, "ADMIN")) {
        navigate("/admin");
      } else if (selectRole(user.roles, "INSTRUCTOR")) {
        navigate("/instructor/dashboard");
      } else if (selectRole(user.roles, "ESTUDIANTE")) {
        navigate("/student/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Plataforma de Aprendizaje en Línea
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
