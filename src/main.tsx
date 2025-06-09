import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AppRoutes from "app/routes/app.route";
import authService from "security/services/auth.service";

// Inicializar el servicio de autenticación
authService.initializeAuth();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
);
