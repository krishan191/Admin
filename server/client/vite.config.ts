import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/", // This ensures relative paths work correctly
  build: {
    outDir: "dist", // Default, ensures build output goes here
    chunkSizeWarningLimit: 3000,
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
