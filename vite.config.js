import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        auth: resolve(__dirname, "auth.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        reset: resolve(__dirname, "reset.html")
      }
    }
  }
});