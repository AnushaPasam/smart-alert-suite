import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg", "logo.png"],
      manifest: {
        name: "EduAlert",
        short_name: "EduAlert",
        description:
          "Stay updated with college announcements, events, and important notices in real-time.",
        theme_color: "#3b82f6",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192 512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "lucide-react",
          ],
          "charts-vendor": ["recharts", "date-fns"],
          "framer-vendor": ["framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
