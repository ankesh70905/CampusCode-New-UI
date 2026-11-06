import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { copyFile } from "node:fs/promises";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || "/",
    plugins: [
      react(),
      {
        name: "github-pages-spa-fallback",
        async closeBundle() {
          await copyFile("dist/index.html", "dist/404.html");
        },
      },
    ],
  };
});
