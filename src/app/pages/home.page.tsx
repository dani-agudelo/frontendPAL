import { Link } from "react-router-dom";
import { Button } from "root/components/ui/button";
import { useAuth } from "security/context/auth.context";
import { Role } from "app/models/role.model";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const renderDashboardButton = () => {
    if (!isAuthenticated || !user) return null;

    if (selectRole(user.roles, "ADMIN")) {
      return (
        <Link to="/admin">
          <Button className="px-4 py-2 bg-purple-500 text-white rounded">
            Panel de Administración
          </Button>
        </Link>
      );
    } else if (selectRole(user.roles, "INSTRUCTOR")) {
      return (
        <Link to="/instructor/dashboard">
          <Button className="px-4 py-2 bg-blue-500 text-white rounded">
            Panel de Instructor
          </Button>
        </Link>
      );
    } else if (selectRole(user.roles, "ESTUDIANTE")) {
      return (
        <Link to="/student/dashboard">
          <Button className="px-4 py-2 bg-green-500 text-white rounded">
            Mi Dashboard
          </Button>
        </Link>
      );
    }

    return null;
  };

  const selectRole = (roles: Role[], role: string): boolean => {
    return roles.some((r) => r.name.toUpperCase() === role.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">
        Bienvenido a la Plataforma de Aprendizaje en Línea
      </h1>
      <p className="text-gray-600 mt-4">
        Explora y aprende con nuestros cursos.
      </p>
      <div className="mt-6 flex gap-4">
        {isAuthenticated ? (
          <>
            {renderDashboardButton()}
            <Link to="/courses/search">
              <Button className="px-4 py-2 bg-indigo-500 text-white rounded">
                Explorar Cursos
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button className="px-4 py-2 bg-green-500 text-white rounded">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/courses/search">
              <Button className="px-4 py-2 bg-indigo-500 text-white rounded">
                Explorar Cursos
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
