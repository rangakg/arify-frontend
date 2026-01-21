import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,

    // ✅ allow Cloudflare tunnel
    allowedHosts: [
      "arify-frontend.onrender.com",
    ],

    // ✅ THIS WAS MISSING (CRITICAL)
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
