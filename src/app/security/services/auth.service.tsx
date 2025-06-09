import { environment } from "@/environments/environment";
import type { LoginRequest, AuthResponse } from "security/models/auth.model";

import axios from "axios";
import { Role } from "app/models/role.model";

const TOKEN_KEY = "pal_auth_token";
const USER_KEY = "pal_user";

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.authBaseUrl;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.baseUrl}/login`,
        credentials,
      );

      // Guardar token y datos de usuario en localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

      // Configurar el token para futuras peticiones
      this.setAuthHeader(response.data.token);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.removeAuthHeader();
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.roles && this.selectRole(user.roles, role);
  }

  selectRole(roles: Role[], role: string): boolean {
    return roles.some((r) => r.name.toUpperCase() === role.toUpperCase());
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN");
  }

  isInstructor(): boolean {
    return this.hasRole("INSTRUCTOR");
  }

  isStudent(): boolean {
    return this.hasRole("ESTUDIANTE");
  }

  // Configurar el token en el header para todas las peticiones
  setAuthHeader(token: string): void {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeAuthHeader(): void {
    delete axios.defaults.headers.common["Authorization"];
  }

  // Inicializar el servicio (llamar al inicio de la aplicación)
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }
}

export default new AuthService();
