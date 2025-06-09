import { Role } from "app/models/role.model";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  redirectUrl: string;
  user: {
    id: number;
    username: string;
    email: string;
    roles: Role[];
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    roles: Role[];
  } | null;
  loading: boolean;
  error: string | null;
}
