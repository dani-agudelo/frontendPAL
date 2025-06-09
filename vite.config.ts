import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      root: path.resolve(__dirname, "."),
      app: path.resolve(__dirname, "src/app"),
      security: path.resolve(__dirname, "src/app/security"),
    },
  },
});
