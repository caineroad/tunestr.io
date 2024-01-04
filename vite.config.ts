import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
    vitePluginVersionMark({
      name: "zap.stream",
      ifGitSHA: true,
      command: "git describe --always --tags",
      ifMeta: false,
    }),
    visualizer({
      open: true,
      gzipSize: true,
      filename: "build/stats.html",
    }),
  ],
  build: {
    outDir: "build",
    sourcemap: true,
  },
  clearScreen: false,
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    global: {},
    __XXX: process.env["__XXX"] || JSON.stringify(false),
    __XXX_HOST: JSON.stringify("https://xxzap.com")
  },
});
