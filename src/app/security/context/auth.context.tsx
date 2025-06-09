import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import authService from "security/services/auth.service";
import type { AuthState, LoginRequest } from "security/models/auth.model";
import { useNavigate } from "react-router-dom";
import { Role } from "app/models/role.model";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isInstructor: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar el estado de autenticación al cargar la aplicación
    const initAuth = () => {
      try {
        authService.initializeAuth();
        const user = authService.getCurrentUser();

        setAuthState({
          isAuthenticated: !!user,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: "Error initializing authentication",
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(credentials);

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        loading: false,
        error: null,
      });

      // Redireccionar según el rol
      if (selectRole(response.user.roles, "ADMIN")) {
        navigate("/admin");
      } else if (selectRole(response.user.roles, "INSTRUCTOR")) {
        navigate("/instructor/dashboard");
      } else if (selectRole(response.user.roles, "ESTUDIANTE")) {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.response?.data?.message || "Login failed",
      });
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    navigate("/login");
  };

  const selectRole = (roles: Role[], role: string): boolean => {
    return roles.some((r) => r.name.toUpperCase() === role.toUpperCase());
  };

  const isAdmin = () => authService.isAdmin();
  const isInstructor = () => authService.isInstructor();
  const isStudent = () => authService.isStudent();

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAdmin,
        isInstructor,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
