import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { eventCatalog } from "./src/data/eventsMockData.js";
import { demoProjects } from "./src/data/dashboardMockData.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || "/";
  return {
    base,
    plugins: [
      react(),
      {
        name: "github-pages-spa-fallback",
        async closeBundle() {
          const routes = [
            "login",
            "register",
            "app",
            "app/events",
            "app/my-events",
            "app/projects",
            "app/activity",
            "app/achievements",
            "app/certificates",
            "app/profile",
            "app/notifications",
            "app/settings",
            ...eventCatalog.flatMap(({ id }) => [
              `app/events/${id}`,
              `app/events/${id}/hub`,
            ]),
            ...demoProjects.map(({ id }) => `app/projects/${id}`),
          ];

          await copyFile("dist/index.html", "dist/404.html");
          await Promise.all(
            routes.map(async (route) => {
              const routeDirectory = path.join("dist", route);
              await mkdir(routeDirectory, { recursive: true });
              await copyFile("dist/index.html", path.join(routeDirectory, "index.html"));
            }),
          );
        },
      },
    ],
  };
});
